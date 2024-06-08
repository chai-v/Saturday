import React from 'react'
import Sidebar from './sidebar'
import Chat from './chat'

function Dashboard() {
  return (
    <div className='w-full h-full grid grid-cols-6'>
        <div className='col-span-1'><Sidebar></Sidebar></div>
        <div className='col-span-5'><Chat></Chat></div>
    </div>
  )
}

export default Dashboard