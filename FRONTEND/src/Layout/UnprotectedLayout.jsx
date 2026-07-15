import { useUserInfo } from "@/Hooks/useAuth";
import FullScreenLoader from "@/components/FullScreenLoader";
import { Navigate, Outlet } from "react-router-dom";

function UnprotectedLayout() {
    const { data: user, isLoading } = useUserInfo();
    if (isLoading) return <FullScreenLoader />
    if (user) return <Navigate to='/dashboard' replace />;
    return <Outlet />;
}

export default UnprotectedLayout
