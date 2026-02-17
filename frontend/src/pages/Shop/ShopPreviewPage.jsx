import React from 'react'
import styles from '../../styles/styles'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopPreviewPage = () => {
  return (
    <div className={`w-full bg-gray-50 min-h-screen`}>
      <div className="w-11/12 mx-auto 800px:flex py-10 justify-between">
        <div className="800px:w-[25%] 800px:sticky top-10 left-0 z-10 h-fit">
          <ShopInfo isOwner={false} />
        </div>
        <div className="800px:w-[72%] mt-5 800px:mt-['unset'] rounded-[4px]">
          <ShopProfileData isOwner={false} />
        </div>
      </div>
    </div>
  )
}

export default ShopPreviewPage