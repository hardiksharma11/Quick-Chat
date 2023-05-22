import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ChatContext from './ChatContext';

const ChatState = (props) => {
    const history = useHistory();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    const [fetchAgain, setFetchAgain] = useState(false);

    const [notification, setNotification] = useState([]);

    useEffect(() => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // console.log(userInfo);
            setUser(userInfo);

            if (!userInfo) {
                history.push('/');
            }
        } catch (error) {
            history.push('/');
        }
    }, [history]);

    return (
        <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,fetchAgain,setFetchAgain,notification,setNotification }}>
            {props.children}
        </ChatContext.Provider>
    );
};

export default ChatState;
