import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import Notify from './Notify';
import axios from 'axios';
import ChatContext from '../../Context/Chats/ChatContext';
import UserBadge from './UserBadge';
import UserCard from './UserCard';
import VisibilityIcon from '@mui/icons-material/Visibility';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function UpdateGroupChatModal({ children }) {

    const context = useContext(ChatContext);
    const { selectedChat, setSelectedChat, user,fetchAgain,setFetchAgain } = context;
    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const [open, setOpen] = useState(false);

    


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {

            Notify("Failed to Load the Search Results", "error");
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/renamegroup`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            console.log(data._id);
            // setSelectedChat("");
            setSelectedChat(data);
            Notify("Group Renamed Successfully", "success");
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {

            Notify(error.message, "error");
            console.log(error);
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {

            Notify("User Already in group!", "error");
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {

            Notify("Only admins can add someone!", "error");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            // setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {

            Notify("Failed to Add the User", "error");
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {

            Notify("Only admins can remove someone!", "error");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            // setFetchAgain(!fetchAgain);
            // fetchMessages();
            setLoading(false);
        } catch (error) {

            Notify("Failed to Remove the User", "error");
            setLoading(false);
        }
        setGroupChatName("");
    };


    return (
        <div>
            <Button onClick={handleOpen}>
            <VisibilityIcon />
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Group Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} width="100%">
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <TextField
                                fullWidth
                                label="Group Name"
                                variant="outlined"
                                
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                
                            />
                            <Button onClick={handleRename} className='myButton' colorScheme="blue" variant="contained" sx={{paddingY:'3px',marginLeft:'10px',width:'auto'}}>
                                Rename Group
                            </Button>
                        </Box>
                        <TextField fullWidth label="Add Members" variant="outlined" sx={{ mt: 2 }} onChange={(e) => handleSearch(e.target.value)} />
                    </Typography>

                    <Typography variant="h6">Current Members:</Typography>
                    <Box width="100%" display="flex" flexWrap="wrap" marginY="5px">
                        {selectedChat.users.map((member) => (
                            <UserBadge key={member._id} user={member} handleFunction={() => handleRemove(member)} admin={selectedChat.groupAdmin} />
                        ))}
                    </Box>

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {(searchResult.length > 0) && <Typography variant="h6">Search Results:</Typography>}
                            {searchResult?.slice(0, 4).map((user) => (
                                <UserCard
                                    key={user._id}
                                    id={user._id}
                                    name={user.name}
                                    email={user.email}
                                    pic={user.pic}
                                    accessChat={() => handleAddUser(user)}
                                />
                            ))}
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
