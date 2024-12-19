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
import fitz
from docx import Document

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

def calculate_sentence_length(content: str) -> int:
    """
    Calculate sentence count automatically depending on sentence count
    :param content: the text to count the sentences in.
    :return: sentence count for summarization
    """

    sentence_count = content.count(".")

    if sentence_count < 10:
        return 3
    elif sentence_count < 50:
        return 6
    else:
        return 10



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

model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...), sentence_count: int = 4):
    """
    Transcribes audio file
    :param sentence_count: summarized sentences count
    :param file: mp3 file to transcribe
    :return: transcribed and summarized text
    """

    file_extension = file.filename.split('.')[-1].lower()

    allowed_video_formats = ['mp4', 'mkv', 'mov']
    allowed_audio_formats = ['mp3', 'wav', 'm4a']

    if file_extension not in allowed_audio_formats + allowed_video_formats:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as temp_file:
            temp_file.write(await file.read())
            input_file_path = temp_file.name

        if file_extension in allowed_video_formats:
            output_audio_path = input_file_path.rsplit('.',1)[0] + ".mp3"
            ffmpeg_command = [
                "ffmpeg", "-i", input_file_path, "-q:a", "0", "-map", "a", output_audio_path
            ]
            subprocess.run(ffmpeg_command, check=True)
        else:
            output_audio_path = input_file_path

        result = model.transcribe(output_audio_path)
        transcription = result["text"]

        summary = summarize_content(transcription, sentence_count)

        return {"transcription": transcription, "summary": summary}

    except subprocess.CalledProcessError as ffmpeg_error:
        raise HTTPException(status_code=500, detail=f"Error during audio extraction: {ffmpeg_error}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during transcription: {e}")

    finally:
        for path in [input_file_path, output_audio_path]:
            if os.path.exists(path):
                os.remove(path)


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


def parse_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def parse_docx(file_path):
    doc = Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

@app.post("/parse-document/")
async def parse_document(file: UploadFile = File(...)):
    """
    Parse a document, extract text and summarize
    :param file: the document
    :return: summarized content
    """

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        file_extension = file.filename.split('.')[-1].lower()

        if file_extension == "pdf":
            content = parse_pdf(file_path)
        elif file_extension == "docx":
            content = parse_docx(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        sentence_count = calculate_sentence_length(content)

        summary = summarize_content(content, sentence_count)

        os.remove(file_path)

        return {"summary": summary}

    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing document: {e}")