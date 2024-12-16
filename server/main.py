from fastapi import FastAPI, Body
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

app = FastAPI()

@app.post("/summarize/")
async def summarize_text(
        content: str = Body(...),
        sentence_count: int = Body(2)
):
    """
    Summarize the given text
    :param content: The text to summarize
    :param sentence_count: Number of sentences in the summary.
    """
    parser = PlaintextParser.from_string(content, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentence_count)
    summary_text = " ".join(str(sentence) for sentence in summary)

    return {"summary": summary_text}