import React, { useContext, useEffect, useState } from 'react';
import ChatContext from '../../Context/Chats/ChatContext';
import { getSender } from '../../config/ChatLogics';
import Notify from './Notify';
import axios from 'axios';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupChatModal from './GroupChatModal';

import "./scrollbar.css"

const MyChats = () => {
  const context = useContext(ChatContext);
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchAgain } = context;

  const [loggedUser, setLoggedUser] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.get(`/api/chat`, config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error);
      return Notify('Failed to load the chats', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  return (

    <Box
      display={{ xs: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection="column"
      alignItems="center"
      px={3}
      pb={3}
      bgcolor="white"
      width={{ xs: '100%', md: '30%' }}
      borderRadius="10px"
      borderwidth="1px"
      marginLeft='10px'
    >
      <Box
        
        p={3}
        fontSize={{ base: '28px', md: '30px' }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        bgcolor='lightgray'
        borderRadius="10px 10px 0 0"
      >
        <h3>
          My Chats
        </h3>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            endIcon={<AddIcon />}
            variant='contained'
            className="myButton"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bgcolor="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="4px"
        sx={{ overflowY: "scroll" }}
        className="scrollbar"
      >
        {loading? <CircularProgress /> : null}
        {chats ? (
          <Stack spacing={1}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                bgcolor={selectedChat === chat ? '#071856c9' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="8px"
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#071856c9', color: 'white' } }}
              >
                <div>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </div>
              </Box>
            ))}
          </Stack>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>

  );
};

export default MyChats;
