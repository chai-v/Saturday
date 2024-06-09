import React from 'react'
import { useState } from 'react';
import Sidebar from './sidebar'
import Chat from './chat'

function Dashboard() {
  const [chatID, setChatID] = useState(1);

  function handleSidebarStateUpdate(id) {
    setChatID(id);
  }
  
  return (
    <div className='w-full h-full grid grid-cols-6'>
        <div className='col-span-1'><Sidebar handleSidebarStateUpdate={handleSidebarStateUpdate}></Sidebar></div>
        <div className='col-span-5'><Chat chatID={chatID}></Chat></div>
    </div>
  )
}

export default Dashboard