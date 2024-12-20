import {useState} from "react";
import axios from "axios";
import {Navbar} from "../components/Navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Loader2, Upload} from "lucide-react";

export const DocSummarize = () => {

    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const [summary, setSummary] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0])
        }
    }

    const handleSummarize = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(isLoading) return

        if(!file) {
            setError("Select a file to upload.")
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post("http://127.0.0.1:8000/parse-document/", {
                file: file
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
                setError(e.response?.data?.detail || "An error occurred while summarizing the document.");
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
            <Navbar currentPage="Text Summarization"/>
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm border-gray-700 sm:mt-20 mt-40">
                    <CardHeader className="text-center">
                        <CardTitle
                            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Summarize Document
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSummarize} className="space-y-6">
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
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                {file && (
                                    <p className="mt-2 text-sm text-gray-400">
                                        Selected file: {file.name}
                                    </p>
                                )}
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
                                        'Summarize Text'
                                    )}
                                </button>

                            </div>
                        </form>

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