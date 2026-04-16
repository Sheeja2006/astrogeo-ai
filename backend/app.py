from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    os.getenv("FRONTEND_URL", "*")
])

print("🚀 Starting AstroGeo AI backend...")

try:
    from utils.embedder import search
    from utils.formatter import format_answer, format_sources
    print("✅ All systems ready!")
except Exception as e:
    print(f"❌ Failed to load embedder: {e}")
    raise


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "message": "AstroGeo AI is running"
    })


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()

    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    query = data['message'].strip()

    if not query:
        return jsonify({'reply': 'Please ask a question!', 'sources': []})

    if len(query) > 500:
        return jsonify({'reply': 'Please keep your question under 500 characters.', 'sources': []})

    try:
        results = search(query, top_k=5)
        reply = format_answer(query, results)
        sources = format_sources(results)

        return jsonify({
            "reply": reply,
            "sources": sources,
            "status": "ok"
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({
            "reply": "Something went wrong processing your question.",
            "sources": [],
            "status": "error"
        }), 500


@app.route('/search', methods=['POST'])
def search_raw():
    data = request.get_json()
    query = data.get("message", "").strip()

    if not query:
        return jsonify({"results": []})

    results = search(query, top_k=5)
    return jsonify({"results": results})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)