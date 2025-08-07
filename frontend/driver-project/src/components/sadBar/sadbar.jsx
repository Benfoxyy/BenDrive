import React from 'react';

function Sadbar() {
  return (
    <aside className="min-h-screen w-[260px] bg-blue-normal flex flex-col items-center pt-3">
      <img src="./images/benDrive.png" className="mx-auto mb-8" alt="Ben Drive Logo" />

      <ul className="flex flex-col gap-y-4 font-MorabbaBold w-full items-start">
        <li className="max-w-[222px]">
          <a href="#" className="flex items-center gap-x-3.5 w-[180px] justify-center">
            <svg className="size-5 min-w-[24px] text-gray-700">
              <use href="#home"></use>
            </svg>
            <span className="text-[#272833] text-lg">Home</span>
          </a>
        </li>
        <li className="max-w-[222px]">
          <a href="#" className="flex items-center gap-x-3.5 w-[180px] justify-center">
            <svg className="size-5 min-w-[24px] text-gray-700">
              <use href="#strong"></use>
            </svg>
            <span className="text-gray-normal text-[15px]">My drive</span>
          </a>
        </li>
        <li className="max-w-[222px]">
          <a href="#" className="flex items-center gap-x-3.5 w-[180px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
              <g clipPath="url(#clip0_362_546)">
                <path d="M7.17871 12.5706C5.83701 13.4609 4.89684 14.6673 4.89684 16.2757V19.1479H0.979459V16.2757C0.979459 14.1886 4.47572 12.9535 7.17871 12.5706Z" fill="#5F6367" />
                <path d="M8.81441 11.4888C6.65006 11.4888 4.89704 9.77503 4.89704 7.65918C4.89704 5.54333 6.65006 3.82959 8.81441 3.82959C9.27471 3.82959 9.70562 3.92533 10.1169 4.05937C9.30409 5.04549 8.81441 6.29968 8.81441 7.65918C8.81441 9.01869 9.30409 10.2729 10.1169 11.259C9.70562 11.393 9.27471 11.4888 8.81441 11.4888Z" fill="#5F6367" />
                <path d="M14.6903 11.4888C12.5259 11.4888 10.7729 9.77503 10.7729 7.65918C10.7729 5.54333 12.5259 3.82959 14.6903 3.82959C16.8546 3.82959 18.6077 5.54333 18.6077 7.65918C18.6077 9.77503 16.8546 11.4888 14.6903 11.4888ZM14.6903 5.74439C13.613 5.74439 12.7316 6.60604 12.7316 7.65918C12.7316 8.71232 13.613 9.57398 14.6903 9.57398C15.7676 9.57398 16.649 8.71232 16.649 7.65918C16.649 6.60604 15.7676 5.74439 14.6903 5.74439Z" fill="#5F6367" />
                <path d="M14.6904 12.4462C17.3052 12.4462 22.5251 13.7291 22.5251 16.2758V19.148H6.85563V16.2758C6.85563 13.7291 12.0755 12.4462 14.6904 12.4462ZM8.81432 17.2332H20.5665V16.2853C20.3706 15.596 17.3346 14.361 14.6904 14.361C12.0462 14.361 9.01019 15.596 8.81432 16.2758V17.2332Z" fill="#5F6367" />
              </g>
              <defs>
                <clipPath id="clip0_362_546">
                  <rect width="23.5043" height="22.9776" fill="white" transform="matrix(-1 0 0 1 23.5044 0)" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-gray-normal text-[15px]">Shared</span>
          </a>
        </li>
        <li className="max-w-[222px]">
          <a href="#" className="flex items-center gap-x-3.5 w-[180px] justify-center">
            <svg className="size-5">
              <use href="#storage"></use>
            </svg>
            <span className="text-gray-normal text-[15px]">Storage</span>
          </a>
        </li>

        {/* این بخش رو داخل یک li قرار دادم چون div داخل ul معتبر نیست */}
        <li className="w-full flex flex-col items-center mt-6">
          <div className="w-[145px] h-2 bg-white border rounded overflow-hidden">
            <div className="w-3/4 h-full bg-[#1A5EC1]"></div>
          </div>
          <p style={{ letterSpacing: '0.8px' }} className="text-xs font-MorabbaMedium mt-2">
            23.19 GB of 30 GB used
          </p>
        </li>
      </ul>

      <span className="mt-auto mb-3">amir</span>
    </aside>
  );
}

export default Sadbar;
