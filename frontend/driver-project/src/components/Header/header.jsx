import React, { useState } from 'react'
import Sadbar from '../Sidebar/sidebar'
import { useSearchParams } from "react-router";
import swal from 'sweetalert';
import { useEffect } from 'react';
function Header({FindallItems  , setIsSearching}) {
    const [valueParam , setValueParam ]  = useState("")
    const [searchParams, setSearchParams] = useSearchParams();
    async function handleSearchArray () {
        if(valueParam.length) {
          const res = await fetch(`https://api.benben.pics/file/list?search=${valueParam}`, {
            headers: {
              Authorization : `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
            }
          });
          const data = await res.json();
      
          if (FindallItems) FindallItems(data);   
          if (setIsSearching) setIsSearching(true);
      
          setSearchParams(`?search=${valueParam}&t=${Date.now()}`);
          setValueParam("");
        } else {
          swal({ title:"the input is empty", icon:"error", buttons:"ok" });
        }
      }
      
      useEffect(() => {
        if (!searchParams.get("search")) {
          if (FindallItems) FindallItems([]);
          if (setIsSearching) setIsSearching(false);
          setSearchParams("");
        }
      }, [searchParams, FindallItems, setIsSearching]);
      

    // useEffect(() => {
    //     if (!searchParams.get("search")) {
    //        FindallItems([]);  
    //        setIsSearching(false);
    //        setSearchParams("")
    //     }
    //   }, [searchParams, FindallItems]);
      
    return (
        <>
           <Sadbar />
           <header className='max-w-[1440px] mx-auto'>
           <form action="" className='bg-[#F0F3F4] rounded-md w-full flex justify-start items-center max-w-7xl  gap-x-3 py-3 px-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 " onClick={() => handleSearchArray()}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
                  <input type="text" value={valueParam} onChange={(event) => setValueParam(event.target.value)} placeholder='search for file ' className='text-[#6C7074] w-full focus:outline-none '   />

           </form>
            
           </header>
        </>
    )
}

export default Header
