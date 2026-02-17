import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AdminProfileContent from '../components/Admin/AdminProfileContent'

const AdminProfilePage = () => {
    return (
        <div>
            <AdminHeader />
            <div className="w-full flex bg-[#111827]">
                <div className="flex items-start justify-between w-full">
                    <div className="w-[80px] 800px:w-[330px]">
                        <AdminSideBar active={9} />
                    </div>
                    <div className="w-full justify-center flex">
                        <AdminProfileContent />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminProfilePage
