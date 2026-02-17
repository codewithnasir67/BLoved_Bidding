import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import adminLogo from '../../assets/admin_logo.png'

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-[#111827] shadow-lg sticky top-0 left-0 z-30 flex items-center justify-between px-8 py-4 transition-all duration-300 border-b border-gray-800">
      <div>
        <img src="/BB-Logo.png" alt="BLoved-Bidding Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
      </div>

      <div className="flex items-center gap-6">
        <Link to="/admin/profile" className="flex items-center gap-3 pl-4 border-l border-gray-800 cursor-pointer group">
          <img
            src={adminLogo}
            alt=""
            className="w-[42px] h-[42px] rounded-full object-cover border-2 border-transparent group-hover:border-teal-500 transition-all duration-300 shadow-lg"
          />
          <div className="hidden lg:block">
            <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">Super Admin</h4>
            <p className="text-xs text-gray-500 group-hover:text-teal-400 transition-colors">Manage Web </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AdminHeader