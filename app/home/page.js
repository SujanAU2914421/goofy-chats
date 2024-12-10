'use client';

export default function MainHome() {
  return (
    <div className="relative h-screen w-screen overflow-hidden font-mono">
      <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-gradient-to-r from-gray-50 to-white">
        <div className="relative h-screen w-screen">
          <div className="relative h-full w-full flex pl-32">
            <div className="relative h-full w-1/2">
              <div className="relative h-auto w-full">
                <div className="relative h-auto w-auto pt-32">
                  <div className="relative h-1 w-8 rounded-full bg-black"></div>
                  <div className="relative text-sm font-extralight uppercase pt-3 text-gray-600">
                    us from the start
                  </div>
                  <div className="relative text-6xl font-extrabold uppercase text-gray-600 pt-3">
                    Link. Laugh. Live.
                  </div>
                </div>
              </div>
              <div className="relative h-auto w-auto pt-16">
                <div className="relative uppercase font-extrabold">
                  Chatters
                </div>
                <div className="relative text-xs text-gray-600 uppercase font-extralight">
                  website
                </div>
                <div className="relative text-xs text-gray-600 w-full pr-16 pt-6 leading-5">
                  <div className="relative">
                    Where conversations come alive – chat, connect, and create
                    moments in real time!
                  </div>
                  <div className="relative pt-3">
                    Where every message feels like a little piece of warmth,
                    waiting to brighten your day.
                  </div>
                </div>
                <div
                  onClick={() => {
                    window.location.pathname = '/signup';
                  }}
                  className="fixed top-16 right-16 z-40 h-10 w-36 flex cursor-pointer"
                >
                  <div className="relative rounded h-full w-full bg-gray-700 text-white text-xs flex items-center justify-center">
                    Sign Up Now
                  </div>
                </div>
                <div
                  className="relative pt-8 text-4xl"
                  style={{ fontFamily: 'GreatVibes' }}
                >
                  Chatters
                </div>
              </div>
            </div>
            <div className="relative h-full w-1/2 flex justify-end">
              <div className="relative h-full w-3/4 bg-gray-100">
                <div className="absolute bottom-10 -left-32 h-[24rem] w-[24rem] shadow-xl"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-screen w-screen">
          <div className="relative h-full w-full flex items-center">
            <div className="relative h-full w-4/12">
              <div className="absolute bottom-0 right-0 h-[36rem] w-[23rem] border"></div>
              <div className="relative text-6xl leading-[4rem] font-extrabold flex-col px-40 pt-40 text-gray-600 drop-shadow-xl drop-shadow-black">
                <div>Unleash.</div>
                <div>Connect.</div>
                <div>Free!</div>
              </div>
            </div>
            <div className="relative h-full w-6/12 px-20">
              <div className="relative h-full w-full">
                <div className="absolute top-0 left-0 h-[10rem] w-[17rem]"></div>
                <div className="absolute bottom-0 left-0 h-[34rem] w-full bg-gray-50 text-gray-700 px-16 pt-16 text-xs leading-6">
                  Experience limitless conversations with no strings attached.
                  Our free chat app lets you connect effortlessly, anytime,
                  anywhere.
                  <br />
                  <br />
                  Join now and unlock a world of seamless communication, all for
                  free!
                </div>
              </div>
              <div className="absolute bottom-0 left-56 h-[13rem] w-[1px] bg-gray-300"></div>
              <div className="absolute bottom-0 right-0 h-[13rem] w-[23rem] shadow-xl"></div>
            </div>
            <div className="relative h-full w-2/12">
              <div
                className="absolute top-0 right-0 h-[25rem] w-[15rem]"
                style={{
                  background:
                    'url(/images/phil-desforges-d9fskDpKYS4-unsplash.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'end',
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="relative h-screen w-screen">
          <div className="relative h-full w-full flex pl-32">
            <div className="relative h-full w-1/2">
              <div className="relative h-auto w-full">
                <div className="relative h-auto w-auto pt-32">
                  <div className="relative h-1 w-8 rounded-full bg-black"></div>
                  <div className="relative text-sm font-extralight uppercase pt-3 text-gray-600">
                    skill = pride
                  </div>
                  <div className="relative text-6xl font-extrabold uppercase text-gray-600 pt-3">
                    About Us
                  </div>
                </div>
              </div>
              <div className="absolute z-10 bottom-0 -right-20 h-[20rem] w-[28rem] shadow-xl shadow-gray-200"></div>
            </div>
            <div className="relative h-full w-1/2 flex items-center px-16 bg-gray-100">
              <div className="relative text-xs text-gray-600 w-full leading-6 z-20">
                <div className="relative">
                  A talented full-stack developer who built a seamless chat app,
                  combining front-end creativity with back-end efficiency. With
                  a focus on user experience and reliable performance, they’ve
                  crafted a platform that makes communication easy and engaging.
                </div>
                <div className="relative pt-3">
                  Their work reflects dedication, innovation, and technical
                  expertise.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-screen w-screen overflow-hidden">
          <div className="relative h-full w-full">
            <div className="relative h-full w-8/12 px-32">
              <div className="relative h-auto w-full">
                <div className="relative h-auto w-auto pt-32">
                  <div className="relative h-1 w-8 rounded-full bg-black"></div>
                  <div className="relative text-sm font-extralight uppercase pt-3 text-gray-600">
                    us from the start
                  </div>
                  <div className="relative text-6xl font-extrabold uppercase text-gray-600 pt-3">
                    Join. Connect. Enjoy.
                  </div>
                </div>
              </div>
              <div className="relative h-auto w-auto pt-16">
                <div className="relative text-xs text-gray-600 w-full pr-16 pt-6 leading-5">
                  <div className="relative">
                    Discover a simple, classic way to stay connected with
                    friends and family. Sign up today and experience seamless
                    communication in a secure, user-friendly environment.
                  </div>
                  <div className="relative pt-3">
                    Don’t miss out on the chance to be part of something
                    special. Join now and start chatting instantly!
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute -top-20 right-32 h-[200%] w-[30rem] rotate-[36deg] shadow-xl"
              style={{
                background:
                  'url(/images/phil-desforges-d9fskDpKYS4-unsplash.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute w-4 h-2/6 bg-gray-100 -left-8"></div>
            </div>
          </div>
        </div>
        <div className="relative h-auto w-full px-16">
          <div className="realtive h-20 w-full flex justify-end items-center text-xs">
            <div className="relative">
              © Goofy Chat 2024. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
