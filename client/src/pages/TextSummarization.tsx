import {useState} from "react";
import axios from "axios";
import {Navbar} from "../components/Navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {Loader2} from "lucide-react";

export const TextSummarization = () => {

    const [text, setText] = useState("")
    const [sentenceCount, setSentenceCount] = useState(2)
    const [summary, setSummary] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSummarize = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(isLoading) return

        setIsLoading(true)

        try {
            const response = await axios.post("http://127.0.0.1:8000/summarize/", {
                content: text,
                sentence_count:sentenceCount
            })
            setSummary(response.data.summary)

        }
        catch (e)
        {
            console.error("error:", e)
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
                            Text Summarization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSummarize} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="text-input"
                                       className="block text-sm font-medium text-gray-300">
                                    Input your text here
                                </label>
                                <textarea
                                    id="text-input"
                                    placeholder="Enter the text you want to summarize..."
                                    className="h-72 w-full bg-gray-700 resize-none border-gray-600 border-2 rounded-md p-2 text-gray-200 placeholder-gray-400"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                            </div>
                            <div className="w-full flex flex-col items-center space-y-2">
                                <label htmlFor="sentence-count"
                                       className="text-md font-medium text-gray-300">
                                    The text will be summarized in {sentenceCount} sentences.
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
                            <div className="flex justify-center">
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