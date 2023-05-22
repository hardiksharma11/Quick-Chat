import React, { useContext } from 'react'
import ChatContext from '../Context/Chats/ChatContext';
import { Avatar, Box, Tooltip } from '@mui/material';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';

const ScrollableChatFeed = ({ messages }) => {
    const context = useContext(ChatContext);
    const { user } = context;

    return (
        <Box>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                                    <Avatar
                                        sx={{marginTop:'7px',cursor:'pointer',marginRight:'1%'}}
                                        alt={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <div
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "rgb(183 194 255)" : "rgb(214 165 247)"
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                borderRadius: `${m.sender._id === user._id ? "20px 0px 20px 20px" : "20px 20px 20px 0px"}`,
                                padding: "5px 15px",
                                maxWidth: "60%",
                                wordWrap: 'break-word'
                            }}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}
        </Box>
    )
}

export default ScrollableChatFeed
