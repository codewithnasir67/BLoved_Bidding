import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import ShopUpdateProduct from "../../components/Shop/ShopUpdateProduct";

const ShopUpdateProductPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={3} />
                </div>
                <div className="w-full justify-center flex">
                    <div className="w-[90%] 800px:w-[70%]">
                        <ShopUpdateProduct />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopUpdateProductPage
