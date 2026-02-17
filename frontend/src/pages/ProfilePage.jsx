import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const activeParam = searchParams.get("active");
  const [active, setActive] = useState(activeParam ? parseInt(activeParam) : 1);

  useEffect(() => {
    if (activeParam) {
      setActive(parseInt(activeParam));
    }
  }, [activeParam]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className="w-full bg-gradient-to-br from-teal-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
            <div className={`${styles.section} flex py-8 gap-8 items-stretch`}>
              <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%] flex flex-col">
                <ProfileSideBar active={active} setActive={setActive} />
              </div>
              <div className="flex-1 flex flex-col">
                <ProfileContent active={active} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
