import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { Home } from "./pages/Home"
import {TextSummarization} from "./pages/TextSummarization.tsx";
import {UnWikipediafy} from "./pages/UnWikipediafy.tsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/summarize" element={<TextSummarization />} />
                    <Route path="/unwikipediafy" element={<UnWikipediafy />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
