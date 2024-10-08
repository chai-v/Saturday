import React, {useState} from "react";
import axios from 'axios';
import { useAuth } from "../../utils/UserContext";
import { useChat } from "../../utils/ChatContext";

const Modal = ({isMobile, handleOpen}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    const {user, userlogin} = useAuth();
    const {chat, chatID, setChat, setChatID} = useChat();

    const handleModalOpen = () => {
        handleOpen();
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    }

    const handleSubmit = async () => {
        setIsLoading(true); 
        const formData = new FormData();
        formData.append('email', user.email); 
        formData.append('title', document.getElementById('title').value);
        const names = [];
        selectedFiles.forEach((file) => {
          names.push(file.name)
        });
        formData.append('filenames', names);
        formData.append('description', document.getElementById('description').value);
        selectedFiles.forEach((file) => {
          formData.append('pdfPaths', file);
        });
      
        try {
          const response = await axios.post('https://saturday-3fw7.onrender.com/fileupload', formData);
          const newUser = await axios.post('https://saturday-3fw7.onrender.com/auth/refresh', {
            email: user.email
          })
          await userlogin(newUser.data);
          handleOpen();
          setChatID(1);
          setChat(user.chats[chatID-1])
          console.log(response.data);
        } catch (error) {
          console.error('Error uploading files:', error);
        } finally {
          setIsLoading(false); // End loading
        }
      };

    return(
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
            <div className={`relative ${isMobile ? 'w-10/12': 'w-1/2'}  bg-slate-800 rounded shadow-md`}>
                {isLoading && 
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                }
                <div className="p-6">
                  <h2 className="text-white text-xl font-bold mb-4">Upload Files</h2>
                  <form>
                      <input className="block w-full text-sm text-white border border-gray-600 rounded cursor-pointer bg-slate-900 dark:text-white focus:outline-none dark:bg-slate-700 dark:border-gray-600 dark:placeholder-white" id="file_input" type="file" onChange={handleFileChange}/>
                      <div className="mb-4 mt-4">
                          <label className="block text-white">Title</label>
                          <input id="title" type="text" name="details" className="w-full p-2 border bg-slate-900 border-gray-600 rounded mt-1 text-white" required />
                      </div>
                      <div className="mb-4">
                          <label className="block text-white">Description</label>
                          <input id="description" type="text" name="details" className="w-full p-2 border bg-slate-900 border-gray-600 rounded mt-1 text-white" required />
                      </div>
                      <div className="flex justify-end">
                          <button type="button" className="bg-slate-500 text-white px-4 py-2 rounded mr-2" onClick={handleModalOpen}>Cancel</button>
                          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                      </div>
                  </form>
                </div>
            </div>
        </div>
    )
}

export default Modal;
