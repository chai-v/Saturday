import { useEffect, useState } from 'react'

import Login from './components/Login'
import './App.css'

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`w-screen ${isMobile ? 'h-screen' : 'h-screen'} bg-slate-900 flex flex-col`}>
      {/* Nav bar */}
      <div className="nav w-full h-14 flex items-center justify-between p-4 bg-black content-center frosted sticky top-0 bg-opacity-40 z-40">
        <h1 className="text-slate-300 font-sans font-bold">SATURDAY</h1>
        <a href="https://github.com/chai-v/Saturday">
          <img src="./src/assets/github.png" style={{width:"32px", height:"32px"}}></img>
        </a>
      </div>

      <div className={`content w-full flex-1 ${isMobile ? 'flex flex-col content-center overflow-scroll items-center justify-center p-6' : 'grid grid-cols-3'}`}>
        <>
        <div className="text-slate-300 m-auto md:col-span-2 font-sans font-bold flex flex-col  items-center">
          <div className="gap-6 text-center md:text-left">
            <h1 className="text-5xl">Unlock the power of <span className="text-blue-500">SATURDAY</span></h1>
            <br />
            <p className="text-slate-400">
              Multimodal Learning assistant powered by Gemini
            </p>
          </div>
        </div>
        <div className="md:col-span-1 flex items-center">
          <Login />
        </div>
        </>
      </div>
    </div>
  )
}

export default App
