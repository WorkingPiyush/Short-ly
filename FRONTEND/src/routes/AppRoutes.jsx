import { Routes, Route, Links } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "@/Layout/Layout";
import DashboardLayout from "@/Layout/DashboardLayout";
import ProtectedLayout from "@/Layout/ProtectedLayout";
import UnprotectedLayout from "@/Layout/UnprotectedLayout";
import Home from "@/Pages/Home/Home";
import Signup from "@/Pages/Auth/Signup";
import Login from "@/Pages/Auth/Login";
import UserDashboard from "@/Pages/Dashboard/UserDashboard";
import FullScreenLoader from "@/components/FullScreenLoader";
import LinksPage from "@/Pages/Dashboard/LinksPage";

const FeaturesPage = lazy(() => import("@/Pages/Supporting/FeaturesPage"));
const PricingPage = lazy(() => import("@/Pages/Supporting/PricingPage"));
const SupportPage = lazy(() => import("@/Pages/Supporting/SupportPage"));
const PrivacyPage = lazy(() => import("@/Pages/Supporting/PrivacyPage"));
const TermsAndConditionsPage = lazy(() => import("@/Pages/Supporting/TermsAndConditionsPage"));
const EditLink = lazy(() => import("@/Pages/Dashboard/EditLink"));
const BulkUrl = lazy(() => import("@/Pages/Dashboard/BulkUrl"));
const Analytics = lazy(() => import("@/Pages/Dashboard/Analytics"));
const Category = lazy(() => import("@/Pages/Dashboard/Category"));
const ProfilePage = lazy(() => import("@/Pages/Dashboard/ProfilePage"));
const LinkAnalytics = lazy(() => import("@/Pages/Dashboard/LinkAnalytics"));
const ProfileForm = lazy(() => import("@/Pages/Dashboard/ProfileForm"));
const ProtectedLinkPage = lazy(() => import("@/Pages/Dashboard/ProtectedLinkPage"));
const DestinationDownPage = lazy(() => import("@/Pages/Supporting/DestinationDownPage"));
const ResetPassword = lazy(() => import("@/Pages/Auth/ResetPassword"));
const ExpiredPage = lazy(() => import("@/Pages/Supporting/ExpiredPage"));
const ScheduledPage = lazy(() => import("@/Pages/Supporting/ScheduledPage"));
const LinkNotFoundPage = lazy(() => import("@/Pages/Supporting/LinkNotFoundPage"));
const SingleUsedPage = lazy(() => import("@/Pages/Supporting/SingleUsedPage"));
const NotFoundPage = lazy(() => import("@/Pages/Supporting/NotFoundPage"));
const ApiDocsPage = lazy(() => import("@/Pages/Supporting/ApiDocsPage"));


export default function AppRoutes() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />

                    {/* For Guest user only */}
                    <Route element={<UnprotectedLayout />}>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                    </Route>

                    {/* Public routes */}
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    {/* <Route path="/apiDocs" element={<ApiDocsPage />} /> */}
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                </Route>

                {/* For only registerd user only */}
                <Route element={<DashboardLayout />}>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard">
                            <Route index element={<UserDashboard />} />
                            <Route path="links" element={<LinksPage />} />
                            <Route path="links/:shortCode" element={<EditLink />} />
                            <Route path="bulk" element={<BulkUrl />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="categories" element={<Category />} />
                            <Route path=":shortCode/analytics" element={<LinkAnalytics />} />
                        </Route>
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/edit" element={<ProfileForm />} />
                    </Route>
                </Route>
                {/* Other public routes */}
                <Route path="/:shortCode/password-verify" element={<ProtectedLinkPage />} />
                <Route path="/:shortCode/status" element={<DestinationDownPage />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                {/* supporting pages */}
                <Route path="/:shortCode/expired" element={<ExpiredPage />} />
                <Route path="/:shortCode/scheduled" element={<ScheduledPage />} />
                <Route path="/:shortCode/not-found" element={<LinkNotFoundPage />} />
                <Route path="/:shortCode/single-used" element={<SingleUsedPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}