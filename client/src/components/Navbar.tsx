import { Link } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

export const Navbar = ({ currentPage }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-2xl font-semibold">PMST</span>
                    </Link>

                    <div className="hidden lg:ml-6 lg:flex lg:items-center">
                        <div className="text-lg font-medium text-gray-700 select-none">{currentPage}</div>
                    </div>

                    <div className="ml-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                                    Menu
                                    <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="mt-2 w-48 rounded-md shadow-lg bg-white">
                                <Link to={"/summarize"}>
                                    <DropdownMenuItem className="cursor-pointer px-4 py-2 text-md text-gray-700 hover:bg-gray-100">
                                        Text Summarization
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="sm:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <div className="font-medium text-gray-700 block px-3 py-2 rounded-md">{currentPage}</div>
                </div>
            </div>
        </nav>
    )
}

