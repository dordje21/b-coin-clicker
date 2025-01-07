import WebApp from '@twa-dev/sdk'
// import eruda from 'eruda'
import { useEffect, useState } from 'react'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'
// import { Helmet } from "react-helmet"
import './App.css'
import back from "./assets/back.svg"
import coin from './assets/coin.png'
import diamand from './assets/diamand.svg'
import energyImg from './assets/energy.png'
import { default as logo, default as logo2 } from './assets/logo.jpeg'
import rocket from './assets/rocket.png'
import Modal from './components/Modal'
import Loader from './components/loader/Loader'
import { initFacebookPixel } from './components/pixel'
import ProgressBar from './components/progress/ProgressBar'
import Sparkle from './components/sparkle/Sparkle'
import './index-tailwind.css'

interface Sparkle {
  x: number;
  y: number;
}

function App() {
  // eruda.init()

  const [solana] = useState('00000');
  const [usdt] = useState('00000');
  const [bnb] = useState('00000');
  const [eth] = useState('00000');

  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null);
  // const [stopClicking, setStopClicking] = useState(false)
  const [showAddresses, setShowAddresses] = useState(false)
  const [clickPoints, setClickPoints] = useState(1)
  const [maxEnergy, setMaxEnergy] = useState(500)
  const [energyPercent, setEnergyPercent] = useState(100);
  const [energy, setEnergy] = useState(500);
  const [count, setCount] = useState(0);

  const [countUsd, setCountUsd] = useState('0');
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [copySuccess, setCopySuccess] = useState('');
  const [userName, setUserName] = useState<string | undefined>(undefined);

  // const setItem = async (key: string, value: any): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     WebApp.CloudStorage.setItem(key, JSON.stringify(value), (error, success) => {
  //       if (error) {
  //         console.error('Error storing data:', error);
  //         reject(error);
  //         return;
  //       }
  //       if (success) {
  //         console.log('Data stored successfully');
  //         resolve();
  //       }
  //     });
  //   });
  // }

  const getItem = async (key: string): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      WebApp.CloudStorage.getItem(key, (error, data) => {
        if (error) {
          console.error('Error retrieving data:', error);
          reject(error);
          return;
        }
        resolve(data);
      });
    });
  };

  useEffect(() => {
    initFacebookPixel();
  }, []);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    const init = async () => {
    const userNameTg = WebApp.initDataUnsafe?.user?.username
    setUserName(userNameTg)
    // await handleRetrieveData('user');
    const balanceTg = await getItem('balance')
    if(balanceTg && balanceTg != null) {
      const parsedBalance = parseFloat(balanceTg);
        if (!isNaN(parsedBalance)) {
          setCount(parsedBalance);
        } else {
          WebApp.CloudStorage.setItem('balance', '0');
          setCount(0);
        }
    } else {
      WebApp.CloudStorage.setItem('balance', '0')
      setCount(0)
    }
    

    const maxEnergyTg = await getItem('maxEnergy');
    if (maxEnergyTg && maxEnergyTg !== null) {
      const parsedMaxEnergy = parseFloat(maxEnergyTg);
      if (!isNaN(parsedMaxEnergy)) {
        setMaxEnergy(parsedMaxEnergy);
      } else {
        WebApp.CloudStorage.setItem('maxEnergy', '500');
        setMaxEnergy(500);
      }
    } else {
      WebApp.CloudStorage.setItem('maxEnergy', '500');
      setMaxEnergy(500);
    }
    
    const clickPointsTg = await getItem('clickPoints');
    if (clickPointsTg && clickPointsTg !== null) {
      const parsedClickPoints = parseFloat(clickPointsTg);
      if (!isNaN(parsedClickPoints)) {
        setClickPoints(parsedClickPoints);
      } else {
        WebApp.CloudStorage.setItem('clickPoints', '1');
        setClickPoints(1);
      }
    } else {
      WebApp.CloudStorage.setItem('clickPoints', '1');
      setClickPoints(1);
    }
    
    const energyTg = await getItem('energy'); 
    if (energyTg && energyTg !== null) {
      const parsedEnergy = parseFloat(energyTg);
      if (!isNaN(parsedEnergy)) {
        setEnergy(parsedEnergy);
      } else {
        WebApp.CloudStorage.setItem('energy', '500');
        setEnergy(500);
      }
    } else {
      WebApp.CloudStorage.setItem('energy', '500');
      setEnergy(500);
    }    
    setLoading(false)
  }

  init();
  }, []);

  useEffect(() => {
    function updateEnergy() {
      setEnergy((currentEnergy) => {
        if (currentEnergy < maxEnergy) {
          return currentEnergy + 1;
        }
        return currentEnergy;
      });
    }

    setEnergyPercent((energy / maxEnergy) * 100);

    const intervalId = setInterval(updateEnergy, 1000);

    return () => clearInterval(intervalId);
  }, [energy, maxEnergy]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => {
        setCopySuccess('');
      }, 1000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const upPoints = async (points: number, price: number) => {
    if (count > price) {
      setCount((count) => count - price)
      setClickPoints(clickPoints + points)
      try {
        WebApp.CloudStorage.setItem('clickPoints', `${clickPoints + points}`);
      } catch (error) {
        console.error('Error updating balance: ', error);
      }
      WebApp.HapticFeedback.impactOccurred("medium")
    }
  }

  const upEnergy = async (energy: number, price: number) => {
    if (count > price) {
      setCount((count) => count - price)
      setMaxEnergy(maxEnergy + energy)
      try {
        WebApp.CloudStorage.setItem('maxEnergy', `${maxEnergy + energy}`);
      } catch (error) {
        console.error('Error updating balance: ', error);
      }
      WebApp.HapticFeedback.impactOccurred("medium")
    }
  }

  const fullEnergy = async (price: number) => {
    if (count > price) {
      setCount((count) => count - price)
      setEnergy(maxEnergy)
    try {
      WebApp.CloudStorage.setItem('energy', `${maxEnergy}`);
    } catch (error) {
      console.error('Error updating balance: ', error);
    }
      WebApp.HapticFeedback.impactOccurred("medium")
    }
  }

  useEffect(() => {
    if(energy % 3 == 0){
      WebApp.CloudStorage.setItem('energy', `${energy}`); 
    }
  }, [energy]);
  

  useEffect(() => {
    if (count) {
      const usd = count * 0.002;
      setCountUsd(usd.toFixed(3));
    }
  }, [count]);

  const handleClick = (e: any) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    // setStopClicking(false)
    if (energy < clickPoints) {
      return
    }
    setCount(count + clickPoints);
    setEnergy(energy - clickPoints)
    setSparkles((prev) => [...prev, { x: e.clientX, y: e.clientY }]);
    setActive(true);

    const timeOutIdStart = setTimeout(() => 
      {
        // setStopClicking(true)
        WebApp.CloudStorage.setItem('balance', `${count + clickPoints}`);
      }, 1000)
    setTimeOutId(timeOutIdStart)

    WebApp.HapticFeedback.impactOccurred("medium")
  };

  // useEffect(() => {
  //   if(stopClicking){
  //     // saveBalance(count)
  //     WebApp.CloudStorage.setItem('balance', `${count}`);
  //   }
  // }, [stopClicking]);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setActive(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active]);


  if (loading) {
    return <Loader />;
  }

  const handleDivClick = () => {
    const url = 'https://t.me/'; // Replace with your desired URL
    window.open(url, '_blank');
  };

  // <script src="/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js" data-cf-settings="3b122e2f45eb379fe4188d84-|49" defer></script>

  // useEffect(() => {
  //   // Создаем новый элемент script
  //   const script = document.createElement('script');
  //   script.src = 'rocket-loader.min.js';
  //   script.setAttribute('data-cf-settings', '3b122e2f45eb379fe4188d84-|49');
  //   script.defer = true;

  //   // Добавляем скрипт в конец body
  //   document.body.appendChild(script);

  //   // Удаляем скрипт при размонтировании компонента
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <>
      {isMobile || isTablet || isDesktop ? (
        <>
          <div className="grid-bg-img"></div>
          <div className="h-screen relative z-10 flex justify-between flex-col p-[15px] w-full" style={{ userSelect: 'none' }}>
            <div className="flex flex-col justify-center items-center">
              <div className="w-full p-5">
                <div className="flex items-center justify-center">
                  {WebApp.initDataUnsafe?.user?.photo_url ? <div className="h-[30px] w-[30px] rounded-full overflow-hidden mr-2"><img src={WebApp.initDataUnsafe?.user?.photo_url} className="w-full h-full object-cover" /></div> : null}
                  {userName ? <span className="font-bold text-2xl">Welcome, @{userName}</span> : null}
                </div>
              </div>
              <div className="my-2 flex items-center justify-center">
                <img src={logo} className="w-[40px] h-[40px] rounded-full overflow-hidden" alt="logo" />
                <span className="font-bold text-4xl">{count}</span>
              </div>
              <span className="font-bold text-xl ml-2"> ~ {countUsd}$</span>
            </div>

            <div className="card-card flex items-center justify-center">
              <div className={`btn-coin rounded-full w-[220px] h-[220px] bg-black ${active ? 'active' : ''}`} onClick={handleClick}>
                <img src={logo} className="logo w-full h-full object-cover pointer-events-none rounded-full overflow-hidden" alt="logo" style={{ userSelect: 'none' }} />
              </div>
            </div>
            <div className="w-full flex justify-center flex-col">
              <div className="flex flex-row mb-2 justify-between items-center pr-4">
                <div className="flex flex-row">
                  <img src={energyImg} className="w-[30px] h-[30px]" /><span className="font-bold ml-1 mr-1">{energy}/{maxEnergy}</span>
                </div>
                <div className='flex flex-row'>
                  <Modal bg={`bg-[#fff0]`} showRocket={rocket} btn={'BOOST'} title={'Boost'} content={
                    <>
                      <div className="grid grid-cols-1 gap-2">
                        <div className='text-white bg-[#1a1a1a] mb-2 w-full block font-bold flex flex-row items-center justify-between focus:opacity-50 rounded-lg p-2' onClick={() => { upPoints(clickPoints * 2, clickPoints * 500) }}>
                          <div className="flex items-center">
                            <img src={coin} className="w-[30px] h-[30px]  mr-2" />  +{clickPoints * 2}
                          </div>
                          <div className="flex items-center">
                            <img src={logo} className="w-[30px] h-[30px] overflow-hidden rounded-full  mr-2" />  {clickPoints * 500}
                          </div>
                        </div>
                        <div className='text-white bg-[#1a1a1a] mb-2 w-full flex flex-row items-center justify-between font-bold focus:opacity-50 rounded-lg p-2' onClick={() => { upEnergy(maxEnergy * 2, maxEnergy * 3) }}>
                          <div className="flex items-center">
                            <img src={energyImg} className="w-[30px] h-[30px]  mr-2" /> +{maxEnergy * 2}
                          </div>
                          <div className="flex items-center">
                            <img src={logo} className="w-[30px] h-[30px] overflow-hidden rounded-full  mr-2" /> {maxEnergy * 3 + maxEnergy / 4}
                          </div>
                        </div>
                        <div className='text-white bg-[#1a1a1a] mb-2 w-full flex flex-row items-center justify-between font-bold focus:opacity-50 rounded-lg p-2' onClick={() => {
                          fullEnergy(maxEnergy / 2)
                        }}>
                          <div className="flex items-center">
                            <img src={energyImg} className="w-[30px] h-[30px]  mr-2" /> <span className="text-sm">Full Energy</span>
                          </div>
                          <div className="flex items-center">
                            <img src={logo} className="w-[30px] h-[30px] overflow-hidden rounded-full  mr-2" /> {maxEnergy / 2 + maxEnergy / 4}
                          </div>
                        </div>
                        <div className="text-center mt-5">
                          <h2 className="font-bold text-3xl">Tasks</h2>
                        </div>
                        <div className="text-center mt-5 w-full h-[30vh] flex items-center justify-center text-2xl font-bold">
                          No tasks now...
                        </div>
                      </div>
                    </>
                  } />
                </div>
              </div>
              <ProgressBar count={energyPercent} />
            </div>

            <div className="w-full h-[65px] grid grid-cols-3 gap-2 mt-4">
              <Modal btn={'Stake'} title={'Staking'} content={
                <div className='flex flex-col justify-between items-start h-full w-full'>
                  <div className='stack-wrap  w-full'>
                    <div className='mb-6 w-full'>
                      <h2 className="text-center font-bold w-full">CHOOSE YOURS</h2>
                    </div>
                    {showAddresses && <div className='wallets-wrap w-full bg-black fixed top-0 left-0 h-screen flex flex-col items-center justify-start z-50'>
                      <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 w-full">
                        <h3 className="text-3xl font-semibold">
                          Staking Addresses
                        </h3>
                        <div
                          className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowAddresses(false)}
                        >
                          <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none text-white">
                            <img src={back} />
                          </span>
                        </div>
                      </div>
                      <div className='w-full relative mb-10 p-5 '>
                        <div className="w-full bg-[#3f3f3f] block mb-6 p-2 rounded-md overflow-auto text-sm mb-4 relative">
                          <div className="text-center font-bold mb-2">Solana:</div>
                          <textarea className="w-full bg-transparent outline-none focus:opacity-50" defaultValue={solana} />
                          <div className="absolute w-full h-full top-0 left-0 bg-black opacity-0"
                            onClick={() => copyToClipboard(solana)}></div>
                        </div>
                        <div className="w-full bg-[#3f3f3f] block mb-6 p-2 rounded-md overflow-auto text-sm mb-4 relative">
                          <div className="text-center font-bold mb-2">Usdt(trc20):</div>
                          <textarea className="w-full bg-transparent outline-none focus:opacity-50" defaultValue={usdt} />
                          <div className="absolute w-full h-full top-0 left-0 bg-black opacity-0"
                            onClick={() => copyToClipboard(usdt)}></div>
                        </div>
                        <div className="w-full bg-[#3f3f3f] block mb-6 p-2 rounded-md overflow-auto text-sm mb-4 relative">
                          <div className="text-center font-bold mb-2">Bnb(bep20):</div>
                          <textarea className="w-full bg-transparent outline-none focus:opacity-50" defaultValue={bnb} />
                          <div className="absolute w-full h-full top-0 left-0 bg-black opacity-0"
                            onClick={() => copyToClipboard(bnb)}></div>
                        </div>
                        <div className="w-full bg-[#3f3f3f] block mb-6 p-2 rounded-md overflow-auto text-sm mb-4 relative">
                          <div className="text-center font-bold mb-2">ETH(erc20):</div>
                          <textarea className="w-full bg-transparent outline-none focus:opacity-50" defaultValue={eth} />
                          <div className="absolute w-full h-full top-0 left-0 opacity-0"
                            onClick={() => copyToClipboard(eth)}></div>
                        </div>
                        {copySuccess && <div className="fixed z-50 top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] bg-black p-8 rounded-xl">{copySuccess}</div>}
                      </div>
                    </div>}
                    <div className='mb-6 w-full'>
                      <ul className='w-full'>
                        <li className='w-full'>
                          <div className='w-full mb-2 text-white text-sm font-bold flex flex-row items-center justify-between bg-[#1a1a1a] h-[50px] rounded-md px-2'><div className="flex items-center"><img src={coin} width={30} height={30} className="mr-2 opacity-50" />50$-99$</div>
                            <div>+10% per week.</div> </div>
                        </li>
                        <li className='w-full'>
                          <div className='w-full mb-2 text-white text-sm font-bold flex flex-row items-center justify-between bg-[#1a1a1a] h-[50px] rounded-md px-2'><div className="flex items-center"><img src={coin} width={30} height={30} className="mr-2 grayscale" />100-500$</div>
                            <div>+25% per week.</div> </div>
                        </li>
                        <li className='w-full'>
                          <div className='w-full mb-2 text-white text-sm font-bold flex flex-row items-center justify-between bg-[#1a1a1a] h-[50px] rounded-md px-2'><div className="flex items-center"><img src={coin} width={30} height={30} className="mr-2" />501-1000$</div>
                            <div>+41% per week.</div> </div>
                        </li>
                        <li className='w-full'>
                          <div className='w-full mb-2 text-white text-sm font-bold flex flex-row items-center justify-between bg-[#1a1a1a] h-[50px] rounded-md px-2'><div className="flex items-center"><img src={diamand} width={30} height={30} className="mr-2" />From 1010$</div>
                            <div>+67% per week.</div> </div>
                        </li>
                      </ul>
                    </div>
                    <div className='mb-6 w-full'>
                      <div className='w-full mb-2 text-white text-sm font-bold bg-[#009a3a] h-[40px] rounded-md text-center flex flex-col justify-center items-center'
                        onClick={() => setShowAddresses(true)}>Stake Now</div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm">
                        You will receive rewards to the address of the wallet from which you make the transfer.
                      </p>
                      <p className="mb-2 text-sm">
                        Funds will automatically arrive to your wallet at the end of the week, staking time starts from the moment of crediting the funds to our address.
                      </p>
                    </div>
                  </div>
                </div>
              } />
              {/* href='https://t.me/' */}
              <div className='mb-2 text-white text-sm font-bold flex flex-row rounded-sm items-center justify-center bg-[#1a1a1a]' onClick={handleDivClick}>Telegram</div>

              <div className='mb-2 text-white text-sm font-bold flex flex-row rounded-sm items-center justify-center bg-[#1a1a1a] claim-button'>
                Wallet
              </div>
              {/* <Modal btn={'Wallet'} title={'Connect Wallet'} content={
                <div className='flex flex-col justify-between items-start h-full w-full'>
                  <button className='text-white bg-[#1a1a1a] claim-button mb-2 w-full block'>Connect Wallet</button>
                </div>
              } /> */}
            </div>
          </div>
        </>
      ) : (
        <div className="w-screen h-screen bg-black">
          <div className='desc-top-wrap flex flex-col justify-center items-center' style={{ userSelect: 'none' }}>
            <h1>Use your mobile phone to claim coins.</h1>
            <img src={logo2} className="w-full max-w-lg rounded-full overflow-hidden" alt="logo" style={{ userSelect: 'none' }} />
          </div>
        </div>
      )}
      {sparkles.map((sparkle, index) => (
        <Sparkle key={index} x={sparkle.x} y={sparkle.y} clickPoints={clickPoints} />
      ))}
    </>
  );
}

export default App;
