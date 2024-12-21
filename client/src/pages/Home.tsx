import { useState, useEffect } from 'react'
import { Navbar } from "../components/Navbar.tsx"
import { motion } from "framer-motion"

export const Home = () => {
    const [textPos, setTextPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event
            const displacementX = Math.sin(clientX * 0.005) * 10
            const displacementY = Math.cos(clientY * 0.005) * 10
            setTextPos({ x: displacementX, y: displacementY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <main className="h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
            <div className="w-screen h-screen  flex flex-col justify-center items-center">
                <Navbar currentPage={"Home"}/>
                <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 select-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: textPos.x,
                        y: textPos.y
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                        x: { type: "spring", stiffness: 50, damping: 20 },
                        y: { type: "spring", stiffness: 50, damping: 20 }
                    }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.3 }}
                    >
                        Personal Media
                    </motion.span>
                    {' '}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.8 }}
                    >
                        Summarization Tool
                    </motion.span>
                </motion.h1>
                <motion.p
                    className="mt-4 text-xl text-white text-center select-none"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        x: textPos.x,
                        y: textPos.y
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 2.3,
                        x: { type: "spring", stiffness: 50, damping: 20 },
                        y: { type: "spring", stiffness: 50, damping: 20 }
                    }}
                >
                    Effortlessly summarize your personal media content
                </motion.p>
            </div>
        </main>
    )
}

