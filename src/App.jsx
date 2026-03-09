
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputPage from './pages/InputPage'
import AnalyzingPage from './pages/AnalyzingPage'
import ResultPage from './pages/ResultPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
