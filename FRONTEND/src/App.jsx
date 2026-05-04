import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import Layout from './Layout/Layout'


function App() {
  return (
    <>
      <div className="min-h-screen p-5 bg-black text-white">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
