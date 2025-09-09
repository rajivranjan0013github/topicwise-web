import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { MathJaxContext } from 'better-react-mathjax'
import Home from './pages/Home'
import Question from './pages/Question'

const mathJaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  }
}



const App = () => {
  return (
    <MathJaxContext config={mathJaxConfig}>
      <div>
    

      <div style={{ padding: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions/:id" element={<Question />} />
        </Routes>
      </div>
      </div>
    </MathJaxContext>
  )
}

export default App