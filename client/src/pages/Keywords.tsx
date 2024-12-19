import {useState} from "react"
import {Navbar} from "../components/Navbar.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Loader2} from "lucide-react"
import axios from "axios";
import {Slider} from "@/components/ui/slider.tsx";

export const Keywords = () => {

    const [text, setText] = useState("")
    const [kwCount, setKwCount] = useState(4)
    const [keywords, setKeywords] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const handleAction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(isLoading) return

        setIsLoading(true)

        try {
            const response = await axios.post("http://127.0.0.1:8000/keywords/", {
                content: text,
                kw_count: kwCount
            })
            setKeywords(response.data.keywords)
            console.log(response.data)

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
            <Navbar currentPage="Keywords"/>
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm border-gray-700 sm:mt-20 mt-40">
                    <CardHeader className="text-center">
                        <CardTitle
                            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Keywords from text
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAction} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="text-input"
                                       className="block text-sm font-medium text-gray-300">
                                    Input the text here you want to get the keywords from
                                </label>
                                <textarea
                                    id="text-input"
                                    placeholder="Enter the text..."
                                    className="h-72 w-full bg-gray-700 resize-none border-gray-600 border-2 rounded-md p-2 text-gray-200 placeholder-gray-400"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                            </div>
                            <div className="w-full flex flex-col items-center space-y-2">
                                <label htmlFor="sentence-count"
                                       className="text-md font-medium text-gray-300">
                                    The text will be summarized in {kwCount} keywords.
                                </label>
                                <Slider
                                    id="sentence-count"
                                    min={1}
                                    max={10}
                                    step={2}
                                    value={[kwCount]}
                                    onValueChange={(value) => setKwCount(value[0])}
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
                                            Loading...
                                        </div>
                                    ) : (
                                        'Get keywords'
                                    )}
                                </button>
                            </div>
                        </form>

                        {keywords && (
                            <Card className="mt-8 bg-gray-700 border-gray-600">
                                <CardHeader>
                                    <CardTitle
                                        className="text-xl font-semibold text-purple-300">Keywords</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {keywords.map((keyword, index) => (
                                        <p key={index} className="text-gray-200">{keyword}</p>
                                    ))}

                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}