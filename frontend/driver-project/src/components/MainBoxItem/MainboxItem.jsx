import React, { useState } from 'react'
import swal from 'sweetalert'
function MainboxItem({item , refreshItems} ) {
    const [openBox , setOpenBox ] = useState(false)
  
    const showSelectBox = () => {
        setOpenBox(!openBox)
    }

   


    const handleDeleteItem = async  (id) => {
      swal({
        title  :"are you sure for delete this item",
        buttons : ["yes" , "no"],
        icon : "warning"
      }).then(async(confirmDelete) => {
        if(!confirmDelete) {
          const res   =  await fetch(`https://api.benben.pics/file/delete/${id}/` , {
            method : "DELETE" , 
            headers : {
              Authorization : `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
            }
          })
          
       
          
          if(res.ok) {
            swal({
              title  : "ایتم با موفقیت حذف شد ",
              buttons  : "ok" , 
              icon  : "success"
            })
            refreshItems()
          }
          else {
            swal({
              title : "Server Erorr",
              buttons : "ok" , 
              icon : "Error"
            })
          }
        }
        
      })

    }


    const hanldeSharedApi =  (id) => {

      swal({
        title  : "ایمیل مورد نظر برای ارسال وارد نمایید" , 
        content  : "input",
        buttons : "send"
        
      }).then(async value => {
        if(!value) {
          swal({
            title : "the input is empty" , 
            buttons : "ok" ,
            icon  : "warning" ,
          })
        }
        else {
          let newObjForShare   = {
            id : id , 
            shares_with :[value]
          }
          const res =  await fetch(`https://api.benben.pics/file/share/add/` , {
              method : "POST",
              headers  : {
                "Content-Type" : "application/json" ,
                Authorization : `Bearer ${JSON.parse(localStorage.getItem("user")).token}` ,
    
              },
              body : JSON.stringify(newObjForShare)
          })
          if(res.ok) {
            swal({
              title : "File shared successfully" , 
              buttons : "ok" ,
              icon  : "success" ,
            })
          }
          const data = await res.json() ;
          console.log("Api share item for api ===>>" ,data);
          
        }
      })

        
    }

    
    return (
        <div>
          <div className="main__box-content bg-[#FFFFFF] border-[0.5px] rounded-md p-3.5 border-[#DADCE0]">
                <div className="header mb-2.5 flex justify-between items-center">
                        <span className='text-[#3C4043] text-sm font-MorabbaMedium'>File  name</span>
                        <button className="cursor-pointer relative" onClick={() => showSelectBox()}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  </svg>

  { openBox &&
    <div className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg border border-gray-200" >
      <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => hanldeSharedApi(item.id)}>
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
  
      <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={() => handleDeleteItem(item.id)}>
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
  }
</button>





                </div>

                <div className="main-content">
                    <img src={item?.file_url} className='rounded-sm w-full h-48 ' alt="" />
                    <div className="footer-main mt-3 flex justify-between items-center">
                        <div className='flex gap-x-2 items-end'>
                        <img src="./images/user-profile.png" className=' w-auto size-4.5 border border-[#D2D2D2] rounded-full'  alt="" />
                        <span className='text-[#000000] text-xs '>{item?.owner}</span>
                        </div>
                        <span className='text-xs text-[#5F6367] whitespace-nowrap'>
                        Jul 16 2025
                        </span>
                    </div>
                </div>


   

    
          </div>
        </div>
    )
}

export default MainboxItem
