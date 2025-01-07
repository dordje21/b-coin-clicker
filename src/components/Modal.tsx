import { useState } from "react"
import back from "../assets/back.svg"
// import { trackCustomEvent } from '../components/pixel'

export default function Modal({btn, title, showFooter, content, showRocket, bg} : any) {
  const [showModal, setShowModal] = useState(false);

		const handleVibrateClick = () => {
			setShowModal(true)
			if (navigator.vibrate) {
					// Trigger a single vibration of 200 milliseconds
					navigator.vibrate(200);
			} else {
					console.log('Vibration API is not supported on this device.');
			}
      // trackCustomEvent(`ButtonClick-${title}`, { token: '' });
	};

  return (
    <>
      <div
        className={`mb-2 text-white text-sm font-bold flex flex-row rounded-sm items-center justify-center ${bg ? bg : 'bg-[#1a1a1a]'}`}
       
        onClick={() => handleVibrateClick()}
      >
         {btn} {showRocket && <img src={showRocket} width={30} height={30} className="ml-2 mr-[-18px]"/>}
      </div>
        <div className={`${showModal ? 'fixed z-50 pointer-events-auto opacity-100' : 'fixed -z-50 pointer-events-none opacity-0'}`}>
          <div
            className="h-screen justify-center items-center flex w-full overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="h-screen relative w-full mx-auto max-w-3xl">
              {/*content*/}
              <div className="h-screen  border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200">
                  <h3 className="text-3xl font-semibold">
                    {title}
                  </h3>
                  <div
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none text-white">
                      <img src={back} />
                    </span>
                  </div>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto w-full overflow-y-scroll">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed text-left w-full tasks">
																				{content}
                  </p>
                </div>
                {/*footer*/}
																{ showFooter ? <>
																	<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <div
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
   
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </div>
                  <div
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"

                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </div>
                </div>
																</> : null}
                
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    </>
  );
}