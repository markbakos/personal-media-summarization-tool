import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { Home } from "./pages/Home"
import {TextSummarization} from "./pages/TextSummarization.tsx";
import {UnWikipediafy} from "./pages/UnWikipediafy.tsx";
import {Keywords} from "@/pages/Keywords.tsx";
import {DocSummarize} from "@/pages/DocSummarize.tsx";
import {VideoSummarize} from "@/pages/VideoSummarize.tsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/summarize" element={<TextSummarization />} />
                    <Route path="/unwikipediafy" element={<UnWikipediafy />} />
                    <Route path="/keywords" element={<Keywords />} />
                    <Route path="/document" element={<DocSummarize />} />
                    <Route path="/video" element={<VideoSummarize />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
