import React, { useEffect, useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { useAuth } from '../../utils/UserContext';
import { useChat } from '../../utils/ChatContext';
import ReactMarkdown from 'react-markdown';

function Chat({handleMenu, isMobile}) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { user } = useAuth();
    const { updateChat, chatID, setChatID, chat, setChat, chatHistory, setChatHistory, updated, setUpdated } = useChat();
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleMenuOpen = (()=>{
        handleMenu();
    });

    const handleEnter = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleSend();
        };
    }

    const handleSend = async () => {
        try {
            if (selectedFiles.length > 0) {
                setIsLoading(true);
                setChatHistory(prevChatHistory => [...prevChatHistory, { role: 'User', content: "Image uploaded" }]);
                const formData = new FormData();
                formData.append('chat', chatID);
                formData.append('email', user.email);
                const chatHistoryString = chatHistory.map(chat => chat.content).join('\n');
                formData.append('history', chatHistoryString);
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });

                const response = await axios.post('http://localhost:5000/chat/imageupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setIsLoading(false);
                setChatHistory(prevChatHistory => [...prevChatHistory, { role: 'ai', content: response.data.response }]);
                setSelectedFiles([]);
                setUpdated(true);
            } else {
                const message = document.getElementById('message-input').value;
                document.getElementById('message-input').value = '';
                const chatHistoryString = chatHistory.map(chat => chat.content).join('\n');
                setIsLoading(true);
                
                setChatHistory(prevChatHistory => [...prevChatHistory, { role: 'User', content: message }]);

                const response = await axios.post('http://localhost:5000/chat/query', {
                    email: user.email,
                    chat: chatID,
                    query: message,
                    history: chatHistoryString
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setIsLoading(false);
                setChatHistory(prevChatHistory => [...prevChatHistory, { role: 'ai', content: response.data.response }]);
                setUpdated(true);
            }
        } catch (error) {
            console.error('Error sending message or images:', error);
        }
    };

    useEffect(()=>{
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    },[chatHistory, isLoading]);

    return (
        <div className={`w-full h-screen px-4 bg-slate-800 ${isMobile ? 'flex flex-col' : 'grid grid-cols-10'}`}>
            {user.chats.length === 0 ? 
            <>
            {isMobile &&
            <div className="px-2 pt-6 flex flex-row justify-between">
                <h1 className="text-lg font-bold text-stone-50">Saturday</h1>
                <button onClick={handleMenuOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1"/></svg>
                </button>
            </div>}
            <div className={`${isMobile ? 'overflow-y-scroll no-scrollbar' : 'col-span-10 grid grid-cols-10'}`}>
                <div className='col-span-5 p-4 flex'>
                    <div className='w-full bg-slate-600 my-auto rounded-md p-4 text-white'>
                        <h1 className='text-xl font-semibold mb-2'>Create a new chat</h1>
                        <p className='text-md mb-2'>Upload your PDF documents to create a new chat with Saturday. Saturday uses content from these documents to aid in answering your queries.</p>
                        <h3 className='text-lg font-semibold mb-2'>Steps to create a new chat</h3>
                        <ul className='list-disc pl-4'>
                            <li>Click the 'New Chat' button on the sidebar</li>
                            <li>Upload single or multiple PDF files</li>
                            <li>Enter the title and the description of the chat</li>
                            <li>Ask Saturday anything about the documents to start learning!</li>
                        </ul>
                    </div>
                </div>
                <div className='col-span-5 p-4 flex'>
                    <div className='w-full bg-slate-600 my-auto rounded-md p-4 text-white'>
                        <h1 className='text-lg font-semibold mb-2'>Query your documents</h1>
                        <p className='text-md mb-2'>Chat with your documents in a multi-modal manner! Provide text queries through the chat or upload images of model papers/question banks to generate answers to them automatically.</p>
                        <h3 className='text-lg font-semibold mb-2'>Steps to query with images</h3>
                        <ul className='list-disc pl-4'>
                            <li>Click the attach icon button on the chatbar</li>
                            <li>Upload an image of the QB or Question paper</li>
                            <li>Soak in the auto generated answers by Saturday</li>
                        </ul>
                    </div>
                </div>
                </div>
            </> :
            <>
            {isMobile &&
            <div className="px-2 pt-6 flex flex-row justify-between">
                <h1 className="text-lg font-bold text-stone-50">{chat ? chat.title : ""}</h1>
                <button onClick={handleMenuOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1"/></svg>
                </button>
            </div>
            }

            {!isMobile &&
            <div className='col-span-2 pr-4'>
                <div className="px-2 pt-6">
                    <h1 className="text-lg font-bold text-stone-50">{chat ? chat.title : ""}</h1>
                </div>
                <div className="px-2 pt-4 text-md font-bold text-stone-50 mb-2">Files</div>
                <div className="px-2 py-4 text-white text-sm font-semibold bg-slate-700 rounded">
                    {chat && chat.filenames.map((filename, index) => (
                        <p key={index}>{filename}</p>
                    ))}
                </div>
                <div className="px-2 pt-4 text-md font-bold text-stone-50 mb-2">Description</div>
                <div className="w-full h-64 pl-2 pr-6 py-2 text-white font-semibold text-lg overflow-y-scroll no-scrollbar bg-slate-700 rounded">
                    <p className='text-xs'>
                        {chat ? chat.description : ""}
                    </p>
                </div>
            </div>}

            <div ref={chatContainerRef} className={`flex flex-col flex-1 pt-6 col-span-8 overflow-y-scroll no-scrollbar`}>
                <div ref={chatContainerRef} className="h-full w-full flex flex-col flex-1 bg-slate-700 px-6 py-4 overflow-y-scroll no-scrollbar rounded-md">
                    <div className="w-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
                        {chatID === -1 ? null : chatHistory.map((chat, index) => (
                            <div key={index} className={`w-full flex ${chat.role === 'User' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-72 md:max-w-2xl mb-2 p-2 ${chat.role === 'User' ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'} rounded shadow`}>
                                    <ReactMarkdown className={""}>{chat.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="max-w-xl h-24 flex justify-center bg-slate-500 rounded shadow mb-2">
                                <div className="w-full animate-pulse p-2 flex flex-col gap-2">
                                    <div className="h-4 bg-slate-300 rounded-full w-[50%]"></div>
                                    <div className="h-4 bg-slate-300 rounded-full w-[65%]"></div>
                                    <div className="h-4 bg-slate-300 rounded-full w-[80%]"></div>
                                    <div className="h-4 bg-slate-300 rounded-full w-[70%]"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {!isMobile &&
                <div className="bg-slate-700 p-2 rounded-lg w-full mt-2 mb-2 flex items-center">
                    <div className="flex items-center">
                        {selectedFiles.map((file, index) => (
                            <img key={index} src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 mr-2 rounded-sm" style={{ width: '40px', height: '40px' }} />
                        ))}
                    </div>
                    <label htmlFor="file-image" className="bg-slate-600 text-white p-1 rounded-full ml-1 mr-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff7f7" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6z"></path></svg>
                    </label>
                    <input id="file-image" type="file" className="hidden" multiple onChange={handleFileChange} />
                    <TextareaAutosize
                        id="message-input"
                        className="flex-1 bg-slate-700 text-white outline-none rounded-md p-2 z-10 no-scrollbar"
                        placeholder="Type a message..."
                        minRows={1}
                        maxRows={5}
                        onKeyDown={handleEnter}
                        style={{ resize: 'none', outline: 'none' }}
                    />
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg ml-2 mr-2" onClick={handleSend}>Send</button>
                </div>}
            </div>
            {isMobile &&
            <div className="bg-slate-700 p-2 rounded-lg w-full mt-2 mb-2 flex items-center">
                    <div className="flex items-center">
                        {selectedFiles.map((file, index) => (
                            <img key={index} src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 mr-2 rounded-sm" style={{ width: '40px', height: '40px' }} />
                        ))}
                    </div>
                    <label htmlFor="file-image" className="bg-slate-600 text-white p-1 rounded-full ml-1 mr-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff7f7" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6z"></path></svg>
                    </label>
                    <input id="file-image" type="file" className="hidden" multiple onChange={handleFileChange} />
                    <TextareaAutosize
                        id="message-input"
                        className="flex-1 bg-slate-700 text-white outline-none rounded-md p-2 z-10 no-scrollbar"
                        placeholder="Type a message..."
                        minRows={1}
                        maxRows={5}
                        onKeyDown={handleEnter}
                        style={{ resize: 'none', outline: 'none' }}
                    />
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg ml-2 mr-2" onClick={handleSend}>Send</button>
                </div>
            }
            </>
            }
        </div>
    );
}

export default Chat;
