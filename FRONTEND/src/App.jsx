import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import './App.css'
import Home from './Pages/Home/Home'
import Layout from './Layout/Layout'
import Signup from './Pages/Auth/Signup'
import Login from './Pages/Auth/Login'
import UserDashboard from './Pages/Dashboard/UserDashboard';


function App() {
  return (
    <>
      <div className="min-h-screen p-5 bg-white text-white dark:bg-black dark:text-white">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  )
}

export default App
