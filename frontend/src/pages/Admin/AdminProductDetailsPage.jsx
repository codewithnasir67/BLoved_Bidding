import React, { useEffect, useState } from 'react'
import AdminHeader from '../../components/Layout/AdminHeader'
import AdminSideBar from '../../components/Admin/Layout/AdminSideBar'
import AdminProductDetails from '../../components/Admin/AdminProductDetails'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../server'

const AdminProductDetailsPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`${server}/product/get-product/${id}`)
            .then((res) => {
                setData(res.data.product);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [id]);

    return (
        <div>
            <AdminHeader />
            <div className="w-full flex bg-[#111827]">
                <div className="flex items-start justify-between w-full">
                    <div className="w-[80px] 800px:w-[330px]">
                        <AdminSideBar active={5} />
                    </div>
                    <div className="w-full justify-center flex overflow-y-scroll h-[90vh] bg-[#111827]">
                        <AdminProductDetails data={data} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminProductDetailsPage
