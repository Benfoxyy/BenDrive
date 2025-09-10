import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/header';
import MainboxItem from '../../components/MainBoxItem/MainboxItem';
import UploadModal from '../../components/UploadModal/UploadModal';

function Home() {
  const [allItems , setAllItems ] = useState([]);  
  const [findItems , setFindItems ] = useState([]);  
  const [isSearching, setIsSearching] = useState(false);

  //! getAllItmesApi
  const getAllItmesApi = async () => {
    const res = await fetch(`https://api.benben.pics/file/list`, {
      headers  : {
        Authorization : `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
      }
    });
    const data = await res.json(); 
    setAllItems(data);
  };

  useEffect(() => {
    getAllItmesApi();
  }, []);

  const [isShowUploader, setIsShowUploader] = useState(false);
  const toggleUploader = () => setIsShowUploader(v => !v);

  return (
    <div className="ml-8">
      {/* 👇 اینجا setter درست پاس داده میشه */}
      <Header FindallItems={setFindItems} setIsSearching={setIsSearching}/>

      <main className="max-w-[1440px] mt-9 font-MorabbaBold text-2xl">
        <div className="header-box flex justify-between items-center">
          <h1 className="text-start">Documents</h1>

          <button
            className="bg-blue-normal p-4 flex justify-center items-center gap-x-2.5"
            onClick={toggleUploader}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
            <span className="text-[#000000] text-base font-MorabbaMedium">Upload</span>
          </button>
        </div>

        <div className="grid grid-cols-4 mt-8 gap-5">
          {isSearching ? (
            findItems.length > 0 ? (
              findItems.map(item => (
                <MainboxItem key={item.id} refreshItems={getAllItmesApi} item={item}/>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500">
                Not Found 😢
              </p>
            )
          ) : (
            allItems.map(item => (
              <MainboxItem key={item.id} refreshItems={getAllItmesApi} item={item}/>
            ))
          )}
        </div>
      </main>

      {isShowUploader && (
        <UploadModal refreshItems={getAllItmesApi} onClose={() => setIsShowUploader(false)} />
      )}
    </div>
  );
}

export default Home;
