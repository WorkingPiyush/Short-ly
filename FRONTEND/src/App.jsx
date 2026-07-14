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
import EditLink from './Pages/Dashboard/EditLink';
import AnalyticsPage from './Pages/Dashboard/Analytics';
import ProtectedLinkPage from './Pages/Dashboard/ProtectedLinkPage';
import LinkAnalytics from './Pages/Dashboard/LinkAnalytics';
import ProfileForm from './Pages/Dashboard/ProfileForm';
import ResetPassword from './Pages/Auth/ResetPassword';
import Category from './Pages/Dashboard/Category';
import DestinationDownPage from './Pages/Dashboard/Destinationdownpage ';
import ApiDocsPage from './Pages/Supporting/ApiDocsPage';
import FeaturesPage from './Pages/Supporting/FeaturesPage';
import PricingPage from './Pages/Supporting/PricingPage';
import PrivacyPage from './Pages/Supporting/PrivacyPage';
import SupportPage from './Pages/Supporting/SupportPage';
import TermsAndConditionsPage from './Pages/Supporting/TermsAndConditionsPage';


function App() {
  return (
    <>
      <div className="min-h-screen bg-white text-white dark:bg-black dark:text-white">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/apiDocs" element={<ApiDocsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/termsnCondition" element={<TermsAndConditionsPage />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/links" element={<Links />} />
            <Route path="/dashboard/links/:shortcode" element={<EditLink />} />
            <Route path="/dashboard/bulk" element={<BulkUrl />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/categories" element={<Category />} />
            <Route path="/:shortCode/analytics" element={<LinkAnalytics />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileForm />} />
          </Route>
          <Route path="/:shortCode/password-verify" element={<ProtectedLinkPage />} />
          <Route path="/:shortCode/status" element={<DestinationDownPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  )
}

export default App
