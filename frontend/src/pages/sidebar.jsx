import React, { useState } from 'react';
import { useAuth } from '../../utils/UserContext';
import axios from 'axios';

function Sidebar({ handleSidebarStateUpdate }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { user, userlogin, userlogout } = useAuth();
  const chats = user.chats;

  const handleStateUpdate = (chatId) => {
    handleSidebarStateUpdate(chatId); 
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  
    const formData = new FormData();
    formData.append('email', user.email); 
    files.forEach((file) => {
      formData.append('pdfPaths', file);
    });
  
    try {
      const response = await axios.post('http://localhost:5000/fileupload', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="bg-gray-900 h-screen w-full flex flex-col">
      <div className="flex items-center justify-center py-4">
        <h1 className="text-white text-lg font-bold">Saturday</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-2 py-4">
        {chats.map((chat) => (
          <button key={chat.id} className="bg-blue-500 text-white py-2 rounded-lg w-9/12" onClick={() => handleStateUpdate(chat.id)}>
            {chat.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center pb-2">
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white text-center px-4 py-2 rounded-lg mb-2 w-9/12">
          Upload Files
        </label>
        <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
      </div>

      <div className="px-4 pb-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="text-white">{file.name}</div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
