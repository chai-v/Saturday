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
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
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
