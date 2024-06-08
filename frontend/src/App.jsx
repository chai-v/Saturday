import { useEffect, useState } from 'react'
import Login from './components/Login'
import './App.css'

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
      calculateContentHeight();
    };

    const calculateContentHeight = () => {
      const navbarHeight = document.querySelector('.nav').offsetHeight;
      const screenHeight = window.innerHeight;
      setContentHeight(screenHeight - navbarHeight);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-900">
      {/* Nav bar */}
      <div className="nav w-full h-14 flex items-center justify-between p-4 bg-slate-900 content-center frosted sticky top-0 bg-opacity-40 z-40">
        <h1 className="text-slate-300 font-sans font-bold">SATURDAY</h1>
        <a href="https://github.com/chai-v">
          <i className="fa fa-github" style={{ fontSize: "36px", color: "#f2f2f2" }}></i>
        </a>
      </div>

      <div className={`content w-full ${isMobile ? 'flex flex-col items-center content-center px-8 py-32 gap-28' : 'grid grid-cols-3'}`} style={{ height: `${contentHeight}px` }}>
        <div className="text-slate-300 m-auto md:col-span-2 font-sans font-bold flex items-center">
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
      </div>
    </div>
  )
}

export default App
