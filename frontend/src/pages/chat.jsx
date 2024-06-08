import React from 'react';

function Chat() {
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

                <div className="bg-gray-700 p-2 rounded-md w-3/5 mt-2 mb-2 flex items-center">
                    <input type="text" className="flex-1 border bg-slate-600 border-gray-400 rounded-md p-2" placeholder="Type a message..." />
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2">Send</button>
                    <label htmlFor="file-upload" className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2 cursor-pointer">Attach File</label>
                    <input id="file-upload" type="file" className="hidden" />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Chat;
