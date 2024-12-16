import {useState} from "react"
import {Navbar} from "../components/Navbar.tsx"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Loader2} from "lucide-react"

export const UnWikipediafy = () => {

    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(isLoading) return
        setIsLoading(true)

        const newText = text.replace(/\[\d+\]/g, '')
        setIsLoading(false)
        setText(newText)
    }

    return (
        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
            <Navbar currentPage="UnWikipediafy" />
            <main className="container mx-auto px-4 py-8">

                <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm mt-20">
                    <CardHeader className="text-center">
                        <CardTitle
                            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            UnWikipediafy Text
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAction} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="text-input"
                                       className="block text-sm font-medium text-gray-700">
                                    Input your text here to remove [.] from copied wikipedia articles
                                </label>
                                <textarea
                                    id="text-input"
                                    placeholder="Enter the text..."
                                    className="h-72 w-full bg-white resize-none border-black border-2 rounded-md p-2"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                            </div>
                            <div className="w-full flex flex-col items-center space-y-2">
                                <button
                                    type="submit"
                                    className="w-64 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Loading...
                                        </div>
                                    ) : (
                                        'UnWikipediafy'
                                    )}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}