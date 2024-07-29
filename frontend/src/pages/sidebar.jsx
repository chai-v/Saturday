import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/UserContext';
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../utils/ChatContext';

function Sidebar({ handleMenu, handleOpen }) {
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
    <div className="bg-gray-900 h-screen w-full flex flex-col">
      <div className="flex items-center justify-start p-4 ">
        <h1 className="text-white text-xl font-bold">Saturday</h1>
        <button className='ml-auto' onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"/><path d="M9 12h12l-3-3m0 6l3-3"/></g></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-2 py-4">
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
        <button htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white text-center px-4 py-2 rounded-lg mb-2 w-9/12" onClick={handleModalOpen}>
          New Chat
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
