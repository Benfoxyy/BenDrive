import React, { useState, useEffect } from 'react';
import MainboxItem from '../../components/MainBoxItem/MainboxItem';
import UploadModal from '../../components/UploadModal/UploadModal';
import Header from '../../components/Header/header';

import { useContext } from 'react';
import authContext from '../../context/authContext';

function Myshare() {
  const [myShareDriveList, setMyShareDriveList] = useState([]);
  const [isShowUploader, setIsShowUploader] = useState(false);

  const AuthContext = useContext(authContext)


      
      console.log("email  ===>" , AuthContext.userInfos?.email );

  const listSharesApi = async () => {
    try {
      const res = await fetch(`https://api.benben.pics/file/share/list/`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
        },
      });

      const data = await res.json();
      console.log("result data ===>>", data);
      setMyShareDriveList(data);
    } catch (err) {
      console.error("Error fetching shares list:", err);
    }
  };

  useEffect(() => {
    listSharesApi();
  }, []);

  const refreshItems = () => {
    listSharesApi();
  };
  const toggleUploader = () => setIsShowUploader(v => !v);

  return (
    <div className="ml-8">
      <Header />

      <main className="max-w-[1440px] mt-9 font-MorabbaBold text-2xl">
        <div className="header-box flex justify-between items-center">
          <h1 className="text-start">Documents</h1>

          <button
            className="bg-blue-normal p-4 flex justify-center items-center gap-x-2.5"
            onClick={toggleUploader}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
            <span className="text-[#000000] text-base font-MorabbaMedium">
              Upload
            </span>
          </button>
        </div>

        <div className="grid grid-cols-4 mt-8 gap-5">
          {myShareDriveList.map(item => (
            
            
            <MainboxItem myShareDriveList={myShareDriveList} key={item.id} item={item} />
          ))}
        </div>
      </main>

      {isShowUploader && (
        <UploadModal
          onClose={() => setIsShowUploader(false)}
          refreshItems={refreshItems} 
        />
      )}
    </div>
  );
}

export default Myshare;
