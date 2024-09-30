import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import axios from 'axios'

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const { user, userlogin, userlogout } = useAuth();
    const [updated, setUpdated] = useState(false);
    const [chatID, setChatID] = useState(1); 
    const [chat, setChat] = useState(user ? user.chats[chatID-1] : []);
    const [chatHistory, setChatHistory] = useState([]);

    const updateChat = async () => {
        if(updated){
            try{
                const response = await axios.post('https://saturday-3fw7.onrender.com/chat/updatechat', {
                    email: user.email,
                    chat: chatID,
                    history: chatHistory
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);
                const newUser = await axios.post('https://saturday-3fw7.onrender.com/auth/refresh', {
                    email: user.email
                })
                await userlogin(newUser.data);
                setUpdated(false);
            } catch (error) {
                console.error('Error updating chat:', error);
            }
            setUpdated(false);
        }

        if(user.chats.length>0){
            setChat(user.chats[chatID-1])
            setChatHistory(user.chats[chatID-1].history)
        }
    }

    useEffect(() => {
        if(user && user.email.length>0 && user.chats.length>0){
            setChat(user.chats[chatID-1])
            setChatHistory(user.chats[chatID-1].history)
        }
    }, [chatID, user]);

    return (
        <ChatContext.Provider value={{ updateChat, chatID, setChatID, chat, setChat, chatHistory, setChatHistory, updated, setUpdated }}>
            {children}
        </ChatContext.Provider>
    );
}