import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'

function DashboardLayout() {
    return (
        <div>
            <SideBar />
            <Outlet />
        </div>
    )
}

export default DashboardLayout
