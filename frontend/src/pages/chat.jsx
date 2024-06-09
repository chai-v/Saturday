import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { useAuth } from '../../utils/UserContext';

function Chat({chatID}) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const {user} = useAuth();
    const [chatHistory, setChatHistory] = useState([]);

    // useEffect(() => {
    //     setChatHistory(user.chats[chatID-1].history)
    // }, [chatID]);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleSend = async () => {
        try {
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                formData.append('chat', chatID);
                formData.append('email', user.email);
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });
    
                const response = await axios.post('http://localhost:5000/genai/imageupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response);
                await setChatHistory([...chatHistory, ['ai', response.data.result]])
                setSelectedFiles([]);
            } else {
                const message = document.getElementById('message-input').value;

                const formData = new FormData();
                formData.append('chat', chatID);
                formData.append('email', user.email);
                formData.append('query', message);
                
                const response = await axios.post('http://localhost:5000/chat/query', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data);
                document.getElementById('message-input').value = '';
            }
        } catch (error) {
            console.error('Error sending message or images:', error);
        }
    };
    

    return (
        <div className='w-full h-full px-4 bg-slate-800'>
            <div className="flex flex-col h-full w-full">
                <div className="p-4">
                    <h1 className="text-lg font-bold text-stone-50">Chat</h1>
                </div>
                <div className='flex-1 flex flex-col items-center justify-between'>
                    <div className="w-4/5 h-64 bg-slate-700 flex-1 p-4 overflow-y-scroll rounded-md">
                        <div className="w-4/5 h-64 flex flex-col gap-2">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`mb-2 p-2 ${msg[0]==='User' ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'} rounded shadow`}>
                                {msg[1]}
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="bg-slate-700 p-2 rounded-lg w-3/5 mt-2 mb-2 flex items-center">
                        <div className="flex items-center">
                            {selectedFiles.map((file, index) => (
                                <img key={index} src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 mr-2 rounded-sm" style={{ width: '40px', height: '40px' }} />
                            ))}
                        </div>
                        <label htmlFor="file-image" className="bg-slate-600 text-white py-2 px-4 rounded-full ml-2 cursor-pointer">
                            <span className="icon-[ion--attach]" style={{ width: '24px', height: '24px', color: '#fff' }}></span>
                        </label>
                        <input id="file-image" type="file" className="hidden" multiple onChange={handleFileChange} />
                        <TextareaAutosize
                            id="message-input"
                            className="flex-1 bg-slate-700 text-white outline-none rounded-md p-2 z-10 no-scrollbar"
                            placeholder="Type a message..."
                            minRows={1}
                            maxRows={5}
                        />
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-2 mr-2" onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;