import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

function Chat() {
  const ChatHistory = [
    ["user", "can you answer my questions"],
    ["ai", "yes I can answer questions based on the uploaded files. Please list out the questions or add a question paper using the attachment button"],
    ["user", "answer the question in 1 to 5 sentences"],
    ["ai", "sure. here's your answer"],
  ];

  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [chatHistory, setChatHistory] = useState(ChatHistory); // added a state for chat history

  const getResponseFromChatHistory = (userMessage) => {
    // Implement logic to dynamically answer from chat history
    // For example, you can use a switch statement to match the user's message with a pre-defined response
    switch (userMessage) {
      case "can you answer my questions":
        return "yes I can answer questions based on the uploaded files. Please list out the questions or add a question paper using the attachment button";
      case "answer the question in 1 to 5 sentences":
        return "sure. here's your answer";
      default:
        return "I'm not sure I understand. Can you please rephrase your question?";
    }
  };

  const handleSendMessage = () => {
    console.log(`User message: ${userMessage}`);
    const aiReply = getResponseFromChatHistory(userMessage);
    setAiResponse(aiReply);
    setUserMessage(''); // clear the text box
    setChatHistory([...chatHistory, ["user", userMessage], ["ai", aiReply]]); // update chat history
  };

  return (
    <div className='w-full h-full px-4 bg-slate-800'>
      <div className="flex flex-col h-full w-full">
        <div className="p-4">
          <h1 className="text-lg font-bold text-stone-50">Chat</h1>
        </div>
        <div className='flex-1 flex flex-col items-center justify-between'>
          <div className="w-4/5 bg-slate-700 flex-1 p-4 overflow-y-auto rounded-md">
            {chatHistory.map((message, index) => (
              <div key={index} className={`bg-${message[0] === 'ai' ? 'blue-500' : 'red-500'} text-white py-2 px-4 rounded-lg ${message[0] === 'ai' ? 'self-end' : 'self-start'} max-w-sm`}>
                {message[1]}
              </div>
            ))}
          </div>

          <div className="bg-slate-700 p-2 rounded-lg w-3/5 mt-2 mb-2 flex items-center">
            <label htmlFor="file-upload" className="bg-slate-600 text-white py-2 px-4 rounded-full ml-2 cursor-pointer">
              <span className="icon-[ion--attach]" style={{ width: '24px', height: '24px', color: '#fff' }} />
            </label>
            <input id="file-upload" type="file" className="hidden" />
            <TextareaAutosize 
              className="flex-1 bg-slate-700 text-white outline-none rounded-md p-2 z-10 no-scrollbar"
              placeholder="Type a message..."
              minRows={1}
              maxRows={5}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button 
              className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-2 mr-2" 
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;