import os
import subprocess
import tempfile
import yt_dlp
import whisper
from fastapi import FastAPI, Body, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from keybert import KeyBERT
from sympy.simplify.hyperexpand import try_lerchphi

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def summarize_content(content: str, sentence_count: int = 4):
    """
    Summarize the given text
    :param content: The text to summarize
    :param sentence_count: Number of sentences in the summary.
    :return: the summarized text
    """
    parser = PlaintextParser.from_string(content, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentence_count)
    return " ".join(str(sentence) for sentence in summary)


@app.post("/summarize/")
async def summarize_text(
        content: str = Body(...),
        sentence_count: int = Body(4)
):
    """
    Calls summarize_content to return the summarized text
    :param content: The text to summarize
    :param sentence_count: Number of sentences in the summary.
    """
    summary = summarize_content(content, sentence_count)
    return {"summary": summary}


UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):
    """
    Uploads a video and saves it
    :param file: Uploaded video
    :return: extracted audio's path
    """
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    audio_path = os.path.join(UPLOAD_DIR, "extracted_audio.mp3")
    subprocess.run(["ffmpeg", "-i", file_path, "-q:a", "0", "-map", "a", audio_path])

    return {"message": "video uploaded and audio extracted", "audio_path": audio_path}


model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...), sentence_count: int = 4):
    """
    Transcribes audio file
    :param sentence_count: summarized sentences count
    :param file: mp3 file to transcribe
    :return: transcribed and summarized text
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        temp_audio.write(await file.read())
        temp_audio_path = temp_audio.name

    result = model.transcribe(temp_audio_path)
    transcription = result["text"]
    summary = summarize_content(transcription, sentence_count)
    os.remove(temp_audio_path)
    return {"transcription": transcription, "summary": summary}


@app.post("/keywords/")
async def extract_keywords(content: str = Body(...), kw_count: int = Body(10)):
    """
    Get keywords with KeyBERT
    :param content: input text
    :param kw_count: amount of keywords to return
    """
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(content, keyphrase_ngram_range=(1,2), stop_words="english", top_n=kw_count)
    return {"keywords": [kw[0] for kw in keywords]}


def youtube_download(link, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{output_path}/%(id)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(link, download=True)
        video_id = info_dict.get("id", None)
        return video_id


@app.post("/youtube/")
async def process_video(link:str = Body(...), sentence_count: int = Body(4)):
    """
        download YouTube video as audio, transcribe and summarize
        :param link: YouTube link
        :param sentence_count: how many sentences the video should be summarized in
        :return: transcribed and summarized text
        """
    try:
        video_id = youtube_download(link, UPLOAD_DIR)
        temp_video_path = os.path.join(UPLOAD_DIR, f"{video_id}.mp3")

        result = model.transcribe(temp_video_path)
        transcription = result["text"]
        summary = summarize_content(transcription, sentence_count)

        os.remove(temp_video_path)

        return {"transcription": transcription, "summary": summary}
    except Exception as e:
        print(f"error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


