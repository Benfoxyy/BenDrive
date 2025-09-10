import React, { useState, useContext } from 'react'
import swal from 'sweetalert'
import authContext from '../../context/authContext';
import {Link} from "react-router-dom"
function MainboxItem({ item, refreshItems, myShareDriveList }) {
  const [openBox, setOpenBox] = useState(false);
  const AuthContext = useContext(authContext);

  const showSelectBox = () => setOpenBox((v) => !v);

  const handleDeleteItem = async (id) => {
    swal({
      title: "are you sure for delete this item?",
      buttons: ["yes", "no"],
      icon: "warning",
    }).then(async (confirmDelete) => {
      if (!confirmDelete) {
        const res = await fetch(`https://api.benben.pics/file/delete/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
          },
        });

        if (res.ok) {
          swal({ title: " File removed successfully", buttons: "ok", icon: "success" });
          refreshItems();
          try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.token) {
              const res = await fetch("https://api.benben.pics/accounts/me/", {
                headers: { Authorization: `Bearer ${user.token}` },
              });
              if (res.ok) {
                const data = await res.json();
          
                localStorage.setItem("user", JSON.stringify({ token: user.token, ...data }));
          
                if (typeof AuthContext?.login === "function") {
                  await AuthContext.login(user.token);
                }
              }
            }
          } catch (e) {
            console.error("refresh after upload failed:", e);
          }
        } else {
          swal({ title: "Server Erorr", buttons: "ok", icon: "Error" });
        }
      }
    });
  };

  const hanldeSharedApi = (id) => {
    swal({
      title: "Enter user email",
      content: "input",
      buttons: "send",
    }).then(async (value) => {
      if (!value) {
        swal({ title: "the input is empty", buttons: "ok", icon: "warning" });
      } else {
        const newObjForShare = { id, shares_with: [value] };
        const res = await fetch(`https://api.benben.pics/file/share/add/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
          },
          body: JSON.stringify(newObjForShare),
        });
        if (res.ok) {
          swal({ title: "File shared successfully", buttons: "ok", icon: "success" });
        }
        const data = await res.json();
        console.log("Api share item ===>>", data);
      }
    });
  };


const fileName = item?.file_name || "";
const extension = fileName.split(".").pop().toLowerCase();

const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(extension);
const isVideo = ["mp4", "webm", "ogg", "mkv"].includes(extension);
const isAudio = ["mp3", "wav", "ogg"].includes(extension);
const isPdf   = ["pdf"].includes(extension);
// const isDoc   = ["doc", "docx"].includes(extension);
// const isExcel = ["xls", "xlsx"].includes(extension);
// const isPpt   = ["ppt", "pptx"].includes(extension);
// const isZip   = ["zip", "rar", "7z", "tar", "gz"].includes(extension);

  return (
    <div>
      <div className="main__box-content bg-[#FFFFFF] border-[0.5px] rounded-md p-3.5 border-[#DADCE0]">
        {/* Header */}
        <div className="header mb-2.5 flex justify-between items-center">
          <span className="text-[#3C4043] text-sm font-MorabbaMedium whitespace-nowrap overflow-hidden overflow-ellipsis">
            {item.file_name}
          </span>

          <div className="relative">
            {AuthContext.userInfos?.email === item?.owner && (
              <button
                type="button"
                className="cursor-pointer relative flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                onClick={showSelectBox}
                aria-haspopup="menu"
                aria-expanded={openBox}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </button>
            )}

            {openBox && (
              <div
                className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg border border-gray-200 z-10"
                role="menu"
              >
                <div
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => hanldeSharedApi(item.id)}
                  role="menuitem"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
                    <path d="M12 16V3" />
                    <path d="M7 8l5-5 5 5" />
                  </svg>
                  <span>Share</span>
                </div>

                <div
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                  onClick={() => handleDeleteItem(item.id)}
                  role="menuitem"
                >
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  </svg>
                  <span>Delete</span>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="main-content">
                {isImage ? (
                    <a href={item?.file_url} target='blank' rel='noopener noreferrer'>
                      <img src={item?.file_url}  className="rounded-sm w-full h-48" alt="" />
                    </a>
                ) : isVideo ? (
                  <a href={item?.file_url} target="_blank" rel="noopener noreferrer">
                  <div className="relative w-full h-48">
                    <video
                      src={item?.file_url}
                      className="rounded-sm w-full h-48 object-cover"
                    />
                
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10 absolute inset-0 m-auto hover:text-green-500 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                      />
                    </svg> */}

{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" absolute inset-0 m-auto active:text-white transition-colors   size-11.5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
</svg> */}

<svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute inset-0 m-auto w-14 h-14 bg-black/40 rounded-full p-3 hover:scale-110 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                      />
                    </svg>


                  </div>
                </a>
                      //! className="absolute inset-0 m-auto w-14 h-14 bg-black/40 rounded-full p-3 hover:scale-110 transition-transform"

                ) : isAudio ? (
                  <a href={item?.file_url} target="_blank" rel="noopener noreferrer">
                  <div className="relative w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-2v13" />
  <circle cx="6" cy="18" r="3" />
  <circle cx="18" cy="16" r="3" />
</svg>


                  </div>
                </a>
                
              ) : isPdf ?(
  <a
    href={item?.file_url}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-sm w-full h-48 flex flex-col items-center justify-center  bg-gray-50 hover:bg-gray-100 transition"
  >
    {/* PDF Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zM14 2v6h6" />
    </svg>
  </a>
              ) : (
                <a
                href={item?.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm w-full h-48 flex flex-col items-center justify-center border bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* Generic File Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 truncate px-2">
                  {item?.file_name || "File"}
                </span>
              </a>
              )}
          <div className="footer-main mt-3 flex justify-between items-end w-full">
            <div className="flex gap-x-1 items-end">
              <img
                src="./images/user-profile.png"
                className="w-auto size-4.5 border border-[#D2D2D2] rounded-full"
                alt=""
              />
              <span className="text-[#000000] text-xs  pr-2 inline-block" >{item?.owner}</span>
            </div>
            <span className="text-xs text-[#5F6367] whitespace-nowrap">
              {new Date(item.created_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainboxItem
