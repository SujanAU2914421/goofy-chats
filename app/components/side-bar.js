import Link from 'next/link';
import React from 'react';

export default function SideBar() {
  return (
    <div className="relative h-full w-full">
      <div className="relative w-full pt-10">
        <div className="relative h-auto w-full grid gap-y-6">
          <div
            onClick={() => {
              window.location.pathname = '/chats';
            }}
            className="relative w-full flex items-center justify-center cursor-pointer group"
          >
            <div className="relative text-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="absolute left-1 w-[2px] h-full rounded-r-full flex items-center">
              <div className="relative h-0 w-full group-hover:h-full rounded-full bg-white duration-100"></div>
            </div>
          </div>
          <div className="relative h-auto w-full grid gap-y-4">
            <div
              onClick={() => {
                window.location.pathname = '/profile';
              }}
              className="relative w-full flex items-center justify-center cursor-pointer group"
            >
              <div className="relative text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="absolute left-1 w-[2px] h-full rounded-r-full flex items-center">
                <div className="relative h-0 w-full group-hover:h-full rounded-full bg-white duration-100"></div>
              </div>
            </div>
            <div className="relative h-auto w-full grid gap-y-5">
              {/* <div className="relative flex items-center justify-center cursor-pointer group">
								<div className="relative text-white">
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<polyline points="21 8 21 21 3 21 3 8"></polyline>
										<rect x="1" y="3" width="22" height="5"></rect>
										<line x1="10" y1="12" x2="14" y2="12"></line>
									</svg>
								</div>
								<div className="absolute left-1 w-[2px] h-full rounded-r-full flex items-center">
									<div className="relative h-0 w-full group-hover:h-full rounded-full bg-white duration-100"></div>
								</div>
							</div> */}

              <div
                onClick={() => {
                  window.location.pathname = '/find-people';
                }}
                className="relative flex items-center justify-center cursor-pointer group"
              >
                <div className="relative text-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <div className="absolute left-1 w-[2px] h-full rounded-r-full flex items-center">
                  <div className="relative h-0 w-full group-hover:h-full rounded-full bg-white duration-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-auto w-full bottom-0 left-0 pb-4">
        <div className="relative h-auto w-full grid gap-4">
          <div className="relative flex items-center justify-center cursor-pointer">
            <div className="relative text-white">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
