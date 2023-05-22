import React from 'react'
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import SideDrawer from '../Components/Misc/SideDrawer';
import MyChats from '../Components/Misc/MyChats';
import ChatBox from '../Components/Misc/ChatBox';


const ChatPage = () => {

    const user = localStorage.getItem('userInfo');
    const history = useHistory();

    return (
        <div style={{ width: "100%" }}>
            {!user && history.push('/')}
            <SideDrawer />

            <Box display='flex' justifyContent='space-between' width='100%' height='86vh' paddingY='10px'>


                <MyChats />

                <ChatBox />

            </Box>

        </div>
    )
}

export default ChatPage