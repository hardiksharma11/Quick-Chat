import React from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserBadge = ({ user, handleFunction, admin }) => {
    return (

        <Box bgcolor='#2525a5' color='white' margin="2px" borderRadius="50px">
            <Box display='flex' justifyContent='center' alignItems='center' paddingX='7px'>
                {user.name}
                {admin &&  admin._id === user._id && <span> (Admin)</span> }

                <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleFunction} />
            </Box>
        </Box>
    );
};

export default UserBadge;
