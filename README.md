# Personal Media Summarization Tool

A media summarization tool for long texts, documents, video files and links with other useful tools such as Unwikipediafy, frontend built with React (TypeScript), animations with framer. Backend built with Python FastAPI and libraries for summarizing and transcribing videos.

<div align="center">
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png" alt="Python" title="Python"/></code>
</div>
<div align="center">
	<img src="https://wakatime.com/badge/user/7a2d5960-3199-4705-8543-83755e2b4d0c/project/638c8225-7663-47c3-9f84-eff5b6d62f1c.svg" />
</div>

## Features

- Change how many sentences your summary should be.
- Summarize long texts with LsaSummarizer (sumy).
- Transcribe video or audio files and summarize them.
- Summarize videos from links (YouTube, etc..)
- Parse documents and summarize them.
- User-friendly, fully responsive website

## Requirements

### Prerequisites

1. **Python 3.10 or higher**: Install from [python.org](https://www.python.org/downloads/).
2. **pip**: Python package manager (comes with Python installations).
3. **Node.js (v14 or later)**: Install from [nodejs.org](https://nodejs.org/en/download/package-manager)

### Python Dependencies

Install the required Python packages from `requirements.txt` found in root folder.

```
pip install -r requirements.txt
```

## Installation

1. **Clone the repository**
```
git clone https://github.com/markbakos/personal-media-summarization-tool.git
cd personal-media-summarization-tool
```

2. **Install dependencies for frontend**
```
cd client
npm install
```

3. **Start the development server**
- Frontend:
```
  cd client
  npm run dev
```

- Backend:
```
  # Make sure you are in root folder
  source venv/bin/activate
  uvicorn server.main:app
```

4. **Open the app in your browser**<br>

Navigate to [http://localhost:5173](http://localhost:5173) or the address provided in your terminal to use the app.

## API Endpoints

| Method | Endpoint         | Description                                  |  
|--------|------------------|----------------------------------------------|  
| POST    | `/summarize/`    | Summarize `content` given                   |  
| POST   | `/transcribe/`    |   Transcribes and summarizes uploaded video   |  
| POST    | `/keywords/`| Get the keywords from `content` text             |  
| POST    | `/youtube/`| Summarizes video from gives `link`           |
| POST    | `/parse-document/`| Summarizes uploaded `file` document.          |

## Contributing

Contributions are welcome!

## Contact
For any inquiries, feel free to reach out:

- Email: [markbakosss@gmail.com](mailto:markbakosss@gmail.com) 
- GitHub: [markbakos](https://github.com/markbakos)
- Instagram: [187mrk](https://instagram.com/187mrk)


