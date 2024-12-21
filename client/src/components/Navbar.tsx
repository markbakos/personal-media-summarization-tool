import { Link } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

interface NavbarProps{
    currentPage: string
}

export const Navbar : React.FC<NavbarProps> = ({ currentPage }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center">
                        <span
                            className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 text-2xl font-semibold select-none">PMST</span>
                    </Link>

                    <div className="hidden lg:ml-6 lg:flex lg:items-center">
                        <div className="text-lg font-medium text-gray-300 select-none">{currentPage}</div>
                    </div>

                    <div className="ml-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                                    Menu
                                    <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true"/>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end"
                                                 className="mt-2 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 hover:text-white">
                                <Link to={"/summarize"}>
                                    <DropdownMenuItem
                                        className="cursor-pointer px-4 py-2 text-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        Text Summarization
                                    </DropdownMenuItem>
                                </Link>
                                <Link to={"/video"}>
                                    <DropdownMenuItem
                                        className="cursor-pointer px-4 py-2 text-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        Summarize Videos
                                    </DropdownMenuItem>
                                </Link>
                                <Link to={"/document"}>
                                    <DropdownMenuItem
                                        className="cursor-pointer px-4 py-2 text-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        Summarize Documents
                                    </DropdownMenuItem>
                                </Link>
                                <Link to={"/keywords"}>
                                    <DropdownMenuItem
                                        className="cursor-pointer px-4 py-2 text-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        Get keywords
                                    </DropdownMenuItem>
                                </Link>
                                <Link to={"/unwikipediafy"}>
                                    <DropdownMenuItem
                                        className="cursor-pointer px-4 py-2 text-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        UnWikipediafy
                                    </DropdownMenuItem>
                                </Link>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="sm:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <div className="font-medium text-gray-300 block px-3 py-2 rounded-md">{currentPage}</div>
                </div>
            </div>
        </nav>
    )
}

