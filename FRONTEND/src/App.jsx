import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import Layout from './Layout/Layout'
import Signup from './Pages/Auth/Signup'
import Login from './Pages/Auth/Login'


function App() {
  return (
    <>
      <div className="min-h-screen p-5 bg-black text-white">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
