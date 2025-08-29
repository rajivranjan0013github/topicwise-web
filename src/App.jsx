import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'

const About = () => (
  <div>
    <h1>About Page</h1>
    <p>This is a simple React application with routing.</p>
  </div>
)

const App = () => {
  return (
    <div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 20, display: 'flex', gap: 20 }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        
      </nav>

      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  )
}

export default App