import {useState} from "react";
import axios from "axios";
import {Navbar} from "../components/Navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Loader2, Upload} from "lucide-react";
import {Slider} from "@/components/ui/slider.tsx";

export const VideoSummarize = () => {

    const [selectedTab, setSelectedTab] = useState<"file" | "link">("file")
    const [file, setFile] = useState<File | null>(null)
    const [link, setLink] = useState<string | null>(null)
    const [sentenceCount, setSentenceCount] = useState(4)
    const [error, setError] = useState("")
    const [summary, setSummary] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0])
        }
    }

    const handleSummarizeFile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(isLoading) return
        if(!file) {
            setError("Select a file to upload.")
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post("http://127.0.0.1:8000/transcribe/", {
                file: file,
                sentence_count: sentenceCount
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            setSummary(response.data.summary)
            setError('')
        }
        catch (e:any)
        {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.detail || "An error occurred while summarizing the video.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
        finally{
            setIsLoading(false)
        }
    }

    const handleSummarizeLink = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(isLoading) return
        if(!link) {
            setError("Input a link to summarize.")
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post("http://127.0.0.1:8000/youtube/", {
                link: link,
                sentence_count: sentenceCount
            })
            setSummary(response.data.summary)
            setError('')
        }
        catch (e:any)
        {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.detail || "An error occurred while summarizing the video.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 min-h-screen">
            <Navbar currentPage="Summarize Video"/>
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm border-gray-700 sm:mt-20 mt-40">
                    <CardHeader className="text-center">
                        <CardTitle
                            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Summarize Video
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full flex justify-center mb-4">
                            <button className={`w-32 h-12 text-white border-[1px] ${selectedTab==="file" ? "bg-white" : ""}`}
                                    onClick={() => {setSelectedTab("file")}}
                            >
                                <span className={`text-xl font-semibold select-none ${selectedTab==="file" ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400" : ""}`}>File</span>
                            </button>
                            <button
                                className={`w-32 h-12 text-white border-[1px] ${selectedTab === "link" ? "bg-white" : ""}`}
                                onClick={() => {setSelectedTab("link")}}
                            >
                                <span
                                    className={`text-xl font-semibold select-none ${selectedTab === "link" ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400" : ""}`}>Link</span>
                            </button>
                        </div>
                        {selectedTab === "file" ? (
                            <form onSubmit={handleSummarizeFile} className="space-y-6">
                                <div className="flex flex-col items-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="w-full max-w-xs px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center"
                                    >
                                        <Upload className="w-5 h-5 mr-2"/>
                                        {file ? file.name : 'Choose a file'}
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".mp4,.mkv,.mov,.mp3,.wav,.m4a"
                                    />
                                    {file && (
                                        <p className="mt-2 text-sm text-gray-400">
                                            Selected file: {file.name}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full flex flex-col items-center space-y-2">
                                    <label htmlFor="sentence-count"
                                           className="text-md font-medium text-gray-300">
                                        The video will be summarized in {sentenceCount} sentences.
                                    </label>
                                    <Slider
                                        id="sentence-count"
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[sentenceCount]}
                                        onValueChange={(value) => setSentenceCount(value[0])}
                                        className="lg:w-96 md:w-96 sm:w-64 rounded-2xl bg-gray-400 text-white"
                                    />
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    {error && (
                                        <p className="text-red-600">{error}</p>
                                    )}
                                    <button
                                        type="submit"
                                        className="w-64 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Summarizing...
                                            </div>
                                        ) : (
                                            'Summarize Video'
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSummarizeLink} className="space-y-6">
                                <div className="flex flex-col items-center space-y-2">
                                    <label htmlFor="link-input"
                                           className="block text-md font-medium text-gray-300 ">
                                        Input your link here:
                                    </label>
                                    <input type="text" className="w-[80%] rounded-sm" onChange={(e) => {
                                        setLink(e.target.value)
                                    }}/>
                                    <p className="text-white text-sm text-center">(Tested working with YouTube, most
                                        likely works with other big streaming sites)</p>

                                </div>
                                <div className="w-full flex flex-col items-center space-y-2">
                                    <label htmlFor="sentence-count"
                                           className="text-md font-medium text-gray-300">
                                        The video will be summarized in {sentenceCount} sentences.
                                    </label>
                                    <Slider
                                        id="sentence-count"
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[sentenceCount]}
                                        onValueChange={(value) => setSentenceCount(value[0])}
                                        className="lg:w-96 md:w-96 sm:w-64 rounded-2xl bg-gray-400 text-white"
                                    />
                                </div>
                                <div className="flex flex-col items-center space-y-2">
                                    {error && (
                                        <p className="text-red-600">{error}</p>
                                    )}
                                    <button
                                        type="submit"
                                        className="w-64 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="w-full flex items-center justify-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Summarizing...
                                            </div>
                                        ) : (
                                            'Summarize Video'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {summary && (
                            <Card className="mt-8 bg-gray-700 border-gray-600">
                                <CardHeader>
                                    <CardTitle
                                        className="text-xl font-semibold text-purple-300">Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-200">{summary}</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}