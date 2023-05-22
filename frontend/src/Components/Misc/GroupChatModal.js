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
import { set } from 'mongoose';

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

export default function GroupChatModal({ children }) {


  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const context = useContext(ChatContext);
  const { user, chats, setChats } = context



  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      Notify("User already added", "warning");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };



  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
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
    }
  };


  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };


  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {

      Notify("Please fill all the feilds", "warning");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();

      Notify("New Group Chat Created!", "success");
    } catch (error) {

      Notify("Failed to Create the Chat!", "error");
    }
  };


  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Group
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} width='100%'>
            <TextField fullWidth label="Group Name" variant="outlined" sx={{ mt: 2 }} onChange={(e) => setGroupChatName(e.target.value)} />
            <TextField fullWidth label="Add Members" variant="outlined" sx={{ mt: 2 }} onChange={(e) => handleSearch(e.target.value)} />
          </Typography>


          <Box width="100%" display="flex" flexWrap="wrap" marginY='5px'>
            {selectedUsers.map((u) => (
              <UserBadge
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserCard
                  key={user._id} 
                  id={user._id} 
                  name={user.name} 
                  email={user.email} 
                  pic={user.pic}
                  accessChat={() => handleGroup(user)}
                />
              ))
          )}

          <Button onClick={handleSubmit} colorScheme="blue" variant="contained" sx={{ marginTop: "8px" }} className='myButton'>
            Create Chat
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
