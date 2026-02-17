import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import ShopPlacedBids from "../../components/Shop/ShopPlacedBids";

const ShopPlacedBidsPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-start justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={13} />
                </div>
                <div className="w-full justify-center flex">
                    <ShopPlacedBids />
                </div>
            </div>
        </div>
    )
}

export default ShopPlacedBidsPage
