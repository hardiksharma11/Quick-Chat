import React, { useState, useContext } from 'react'
import TextField from '@mui/material/TextField';
import { Typography, Container, Button, Stack, Skeleton, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios'
import UserCard from './UserCard';
import ChatContext from '../../Context/Chats/ChatContext';
import Notify from './Notify';
import ChatLoading from './ChatLoading';


const SearchUser = (props) => {

    const context = useContext(ChatContext);
    const { user, chats, setChats, selectedChat, setSelectedChat } = context


    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);

    const handleSearch = async () => {

        if (!search) {
            alert("Please enter something");
            return
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data)
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            alert("Error Ocurred. Try again");
            console.log(error);
        }
    }


    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post(`/api/chat/`, { userId }, config);
            // console.log(data)

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setLoadingChat(false);
            setSelectedChat(data);
            props.closeDrawer();

        } catch (error) {
            setLoadingChat(false);
            return Notify(`${error.message}`, "error");
        }
    }

    return (
        <div className='scrollbar searchUser'>
            <Container >

                <Box sx={{ padding: '2px', margin: '10px' }}>
                    <h2>Search User</h2>
                </Box>

                <Box pb={2} mt={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box width='100%'>
                        <TextField
                            placeholder='Search by name or email'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Box>
                    <Box ml={1}>
                        <Button
                            onClick={handleSearch}
                            variant="contained"
                            className='myButton'
                            sx={{ height: '55px' }}
                        >
                            Go
                        </Button>
                    </Box>

                </Box>

                {loadingChat ? <CircularProgress /> :
                    <Box>
                        {loading ? <ChatLoading /> :
                            <Box mt={1}>
                                <Stack mt={1}>
                                    {searchResult.map((user) => {
                                        return <UserCard key={user._id} id={user._id} name={user.name} email={user.email} pic={user.pic} accessChat={accessChat} />
                                    })}
                                </Stack>
                            </Box>
                        }


                    </Box>}


            </Container>
        </div>
    )
}

export default SearchUser
