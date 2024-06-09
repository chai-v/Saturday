import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

function Chat() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleSend = async () => {
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });

            axios.post('http://localhost:5000/chat/imageupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Response:', response.data); // Log the response data
            })
            .catch(error => {
                console.error('Error:', error); // Log any errors
            });

            // Optional: Clear selected files after sending
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error sending images:', error);
        }
    };

    return (
        <div className='w-full h-full px-4 bg-slate-800'>
            <div className="flex flex-col h-full w-full">
                <div className="p-4">
                    <h1 className="text-lg font-bold text-stone-50">Chat</h1>
                </div>
                <div className='flex-1 flex flex-col items-center justify-between'>
                    <div className="w-4/5 bg-slate-700 flex-1 p-4 overflow-y-auto rounded-md">
                        <div className="flex flex-col gap-2">
                            <div className="bg-blue-500 text-white py-2 px-4 rounded-lg self-start max-w-sm">Hello!</div>
                            <div className="bg-blue-500 text-white py-2 px-4 rounded-lg self-end max-w-sm">Hi!</div>
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
