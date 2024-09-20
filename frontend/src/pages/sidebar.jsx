import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/UserContext';
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../utils/ChatContext';

function Sidebar({ handleMenu, handleOpen, isMobile }) {
  const { user, userlogin, userlogout } = useAuth();
  const chats = user.chats;
  const { updateChat, chatID, setChatID, chat, setChat, chatHistory, setChatHistory, updated, setUpdated } = useChat();
  const navigate = useNavigate();

  const [overflowingButtons, setOverflowingButtons] = useState([]);

  useEffect(() => {
    const buttons = document.querySelectorAll('.chat-button');
    const overflowing = Array.from(buttons).map(button => {
      return button.scrollWidth > button.clientWidth;
    });
    setOverflowingButtons(overflowing);
  }, [chats]);

  const handleChatSwitch = async (chatId) => {
    await updateChat(chatID);
    setChat(chats[chatID-1])
    setChatID(chatId);
    handleMenu();
  };

  const handleModalOpen = () => {
    handleOpen();
    handleMenu();
  };

  const handleLogout = async () => {
    console.log(updated)
    if (updated){
      await updateChat();
    }
    userlogout();
    navigate("/");
  };

  return (
    <div className="bg-gray-950 h-screen w-full flex flex-col">
      <div className="flex items-center justify-start p-4 ">
        <h1 className="text-white text-xl font-bold">Saturday</h1>
        {isMobile &&
        <button className='ml-auto' onClick={()=>{handleMenu()}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292"/></svg>
        </button>}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-2 py-4">
        <button htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white text-center px-4 py-2 rounded-lg w-9/12" onClick={handleModalOpen}>
          New Chat
        </button>
        <hr className="bg-gray-300 opacity-20 my-2 h-px w-9/12 border-none"></hr>
        {chats.map((chat, index) => (
          <button 
            key={chat.id} 
            className={`text-white p-2 rounded-lg w-9/12 text-ellipsis overflow-hidden whitespace-nowrap chat-button ${chat.id === chatID ? 'bg-blue-600' : 'bg-blue-900'} ${overflowingButtons[index] ? 'button-fade' : ''}`} 
            onClick={() => handleChatSwitch(chat.id)}
          >
            {chat.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center pb-2">
        <button htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white text-center px-4 py-2 rounded-lg mb-2 w-9/12" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
