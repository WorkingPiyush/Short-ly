import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import './App.css'
import Home from './Pages/Home/Home'
import Layout from './Layout/Layout'
import Signup from './Pages/Auth/Signup'
import Login from './Pages/Auth/Login'
import UserDashboard from './Pages/Dashboard/UserDashboard';
import DashboardLayout from './Layout/DashboardLayout';
import Links from './Pages/Dashboard/Links';
import ProfilePage from './Pages/Dashboard/ProfilePage';
import BulkUrl from './Pages/Dashboard/BulkUrl';
import Analytics from './Pages/Dashboard/Analytics';
import EditLink from './Pages/Dashboard/EditLink';


function App() {
  return (
    <>
      <div className="min-h-screen p-5 bg-white text-white dark:bg-black dark:text-white">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/links" element={<Links />} />
            <Route path="/dashboard/links/:shortcode" element={<EditLink />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/bulk" element={<BulkUrl />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
          </Route>
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  )
}

export default App
