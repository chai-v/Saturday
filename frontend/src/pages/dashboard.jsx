import React, { useEffect } from 'react'
import { useState } from 'react';
import Sidebar from './sidebar'
import Chat from './chat'
import Modal from '../components/Modal';
import { useAuth } from '../../utils/UserContext';

function Dashboard() {
  const {user} = useAuth();
  const [open, isOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 700);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
  },[]);

  function handleOpen(){
    isOpen(!open);
  }
  
  function handleMenu(){
    setMenu(!menu);
  }
  
  return (
    <div className={`w-full h-full grid grid-cols-6 relative`}>
      <div
          className={`${
            isMobile
              ? `col-span-6 z-50 fixed inset-0 bg-white shadow-md transition-transform transform ease-in-out duration-300 ${
                  menu ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'col-span-1'
          }`}
        >        
        <Sidebar handleMenu={handleMenu} handleOpen={handleOpen} />
      </div>

      {/* Main Content Area */}
      <div className={`relative ${isMobile ? 'ml-full col-span-6' : 'col-span-5'}`}>
          <Chat handleMenu={handleMenu} isMobile={isMobile} />
      </div>
      {open && <Modal isMobile={isMobile} handleOpen={handleOpen} />}
    </div>
  )
}

export default Dashboard