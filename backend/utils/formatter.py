def format_answer(query: str, results: list) -> str:
    """
    Convert retrieved chunks into a clean answer.
    """

    if not results:
        return "I don't have enough information on that topic yet."

    best = results[0]

    # Safety check
    score = best.get("score", 0)

    # If similarity score is poor
    if score > 2.5:
        return "I couldn't find a confident answer for that. Try rephrasing your question."

    top_chunks = [r.get("text", "") for r in results[:3]]

    cleaned = []

    for chunk in top_chunks:

        if " | " in chunk:
            parts = chunk.split(" | ")
            cleaned.append(". ".join(parts))
        else:
            cleaned.append(chunk)

    # Return the most relevant chunk
    return cleaned[0]


def format_sources(results: list) -> list:
    """
    Return formatted source snippets
    """

    sources = []

    for r in results[:3]:

        text = r.get("text", "")

        if len(text) > 200:
            text = text[:200] + "..."

        sources.append(text)

    return sources