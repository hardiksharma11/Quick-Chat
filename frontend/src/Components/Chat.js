import React, { useState, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import ProfileModal from './Misc/ProfileModal';
import ChatContext from '../Context/Chats/ChatContext';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getFullSender, getSender } from '../config/ChatLogics';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateGroupChatModal from './Misc/UpdateGroupChatModal';
import Notify from './Misc/Notify';
import axios from 'axios';
import ScrollableChatFeed from './ScrollableChatFeed';
import typingGif from '../Animations/typingGif.gif'
import "./Misc/scrollbar.css"

import io from "socket.io-client";


const HOST = process.env.REACT_APP_HOST;
var socket, selectedChatCompare;

const Chat = () => {
  const context = useContext(ChatContext);
  const { selectedChat, user, setSelectedChat,notification,setNotification , fetchAgain,setFetchAgain} = context;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = React.useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);

  const chatFeedRef = useRef(null);
  const scrollToBottom = () => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  };



  const closeModal = () => {
    setModal(false);
  };

  const handleModal = () => {
    setModal(true);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };


      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log(messages);

      socket.emit("join chat", selectedChat._id);

    } catch (error) {

      Notify("Failed to Load the Messages", "error");
    }
    setLoading(false);
  };


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {

      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setMessages([...messages, data]);

        socket.emit("new message", data);
        // console.log(messages)
      } catch (error) {

        Notify("Failed to send the Message", "error");
      }
    }
  };


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(HOST);
    socket.emit("setup", user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [])

  // console.log(notification);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        //give notification

        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved, ...notification ]);
          setFetchAgain(!fetchAgain);
        }
      }

      else {
        setMessages([...messages, newMessageRecieved]);
      }
    })
  })

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const typingTimeoutRef = useRef(null);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 2000);
  };




  return (
    <>
      {modal && (
        <ProfileModal
          isOpen={modal}
          closeModal={closeModal}
          user={getFullSender(user, selectedChat.users)}
        />
      )}
      {selectedChat ? (
        <>
          <Typography
            variant={{ xs: 'h5', md: 'h4' }}

            style={{
              margin: '0.5%',
              paddingLeft: '5%',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '2.5rem',
            }}
          >
            <Button
              sx={{ display: { sm: 'flex', md: 'none' } }}
              onClick={() => setSelectedChat(null)}
            >
              <ArrowBackIcon />
            </Button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <Button>
                    <VisibilityIcon onClick={handleModal} />
                  </Button>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal />
                </>
              ))}
          </Typography>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='flex-end'
            bgcolor="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="10px"
            overflow='hidden'
          // className='chatWallpaper'
          >
            {loading ? (
              <CircularProgress
                size="60px"
              />
            ) : (
              <>
                <Box
                  display='flex'
                  flexDirection='column'
                  className='scrollbar'
                  sx={{ scrollBehavior: 'smooth' }}
                  ref={chatFeedRef}
                >
                  <ScrollableChatFeed messages={messages} />

                </Box>
                <Box>
                {isTyping ? <img src={typingGif} height='60px' width='110px' /> : <></>}

                </Box>
              </>
            )}
            <Box onKeyDown={sendMessage} p={2}>

              <TextField
              autoComplete='off'
                fullWidth
                onChange={typingHandler}
                value={newMessage}
                sx={{ backgroundColor: "#E0E0E9"}} />
              
            </Box>
          </Box>

        </>
      ) : (
        <Box height='100%' width='100%' display='flex' justifyContent='center' alignItems='center'>
          <Typography
            variant="h5"
            style={{ color: '#767171', fontSize: '2.1rem' }}
          >
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Chat;
