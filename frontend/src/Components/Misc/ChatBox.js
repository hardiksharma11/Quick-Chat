import { Box } from '@mui/material'
import React,{useContext} from 'react'
import ChatContext from '../../Context/Chats/ChatContext';
import Chat from '../Chat';

const ChatBox = () => {

  const context = useContext(ChatContext);
  const { selectedChat } = context;

  return (

    <Box
      display={{ xs: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      px={{ xs: 0, md: 3 }}
      pb={{ xs: 0, md: 3 }}
      bgcolor="white"
      width={{ xs: "100%", md: "68%" }}
      borderRadius="10px"
      borderwidth="1px"
      marginLeft={{xs:0,md:'10px'}}
      marginRight={{xs:0,md:'10px'}}
    >
      
      <Chat />
    </Box>
  )
}

export default ChatBox
