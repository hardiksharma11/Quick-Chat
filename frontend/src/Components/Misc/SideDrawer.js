import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    MenuItem,
    Menu,
    Avatar,
    Drawer
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';


import ProfileModal from './ProfileModal'
import SearchUser from './SearchUser';
import Notify from './Notify';
import ChatContext from '../../Context/Chats/ChatContext';
import { getSender } from '../../config/ChatLogics';


export default function PrimarySearchAppBar() {

    const user = JSON.parse(localStorage.getItem('userInfo'));

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const [modal, setModal] = React.useState(false);
    const [drawer, setDrawer] = React.useState(false);

    const context = useContext(ChatContext);
    const { notification, setNotification, setSelectedChat } = context;

    const isMenuOpen = Boolean(anchorEl);


    const history = useHistory();

    //Handle logout

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        Notify("Logout Successfull", "success")
        history.push('/')
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //Responsiveness

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    //Handling the profile modal

    const closeModal = () => {
        setModal(false);
    }

    const renderModal = (

        <ProfileModal isOpen={modal} closeModal={closeModal} user={user} />
    );

    const handleModal = () => {
        handleMenuClose()
        setModal(true);
    }

    //Opening and closing the search drawer

    const searchDrawer = () => {
        setDrawer(true);
    }

    const closeDrawer = () => {
        setDrawer(false);
    }

    //Menu for notifications

    const open = Boolean(anchorEl2);
    const handleClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl2(null);
    };

    const handleNotification = (chat)=>{
        handleClose();
        setSelectedChat(chat);
    }

    //MUI

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu

            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}

        >
            <MenuItem onClick={handleModal}>Profile</MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </Menu>
    );


    return (
        <Box sx={{ flexGrow: 1 }} height='64px'>
            <AppBar position="static" sx={{ position: 'fixed', top: 0, background: 'linear-gradient(to right, #070356, #e7237d)' }} >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>


                    <Typography component={'span'} >
                        <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={searchDrawer}>
                            <SearchIcon />
                            <Typography component={'span'} >  Search User</Typography>
                        </Box>
                    </Typography>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                        ml={17}

                    >
                        <h2>Quick Talk</h2>
                    </Typography>
                    <Box />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

                        <IconButton

                            size="large"
                            aria-label="show new notifications"
                            color="inherit"
                            onClick={handleClick}
                        >
                            <Badge badgeContent={notification.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            id="notification-menu"
                            anchorEl={anchorEl2}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {notification.length === 0
                                ? <MenuItem>No new notifications</MenuItem>
                                : notification.map((item) => {
                                    return <MenuItem key={item._id} onClick={()=>handleNotification(item.chat)}>
                                        {item.chat.isGroupChat
                                            ? `New Message is ${item.chat.name}`
                                            : `New Message from ${getSender(user, item.chat.users)}`}
                                    </MenuItem>
                                }
                                )}
                        </Menu>

                        <Box>
                            <Avatar sx={{ cursor: 'pointer' }} src={`${user.pic}`} onClick={handleProfileMenuOpen} />
                        </Box>
                    </Box>

                </Toolbar>
            </AppBar>

            <Drawer open={drawer} onClose={closeDrawer}><SearchUser closeDrawer={closeDrawer} /></Drawer>
            {renderMenu}
            {renderModal}
        </Box>
    );
}