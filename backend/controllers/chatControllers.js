const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')


const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.status(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }

        ]
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const newChat = await Chat.create(chatData);

            const chat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password");

            res.status(200).send(chat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

})


const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });

                res.status(200).send(result);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the details" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than two users are required to form a group chat");
    }

    users.push(req.user);
    //As user will also be a part of the group

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


const renameGroup = asyncHandler(async (req, res) => {

    const { chatId, chatName } = req.body;

    const updatedName = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }

    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!updatedName){
        res.status(400);
        throw new Error("Chat not found");
    }

    else{
        res.json(updatedName);
    }
})

const addToGroup= asyncHandler(async (req,res)=>{

    const {chatId,userId}=req.body;

    const added = await Chat.findByIdAndUpdate(chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added){
        res.status(400);
        throw new Error("Chat not found");
    }

    else{
        res.json(added);
    }
})
const removeFromGroup= asyncHandler(async (req,res)=>{

    const {chatId,userId}=req.body;

    const removed = await Chat.findByIdAndUpdate(chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(400);
        throw new Error("Chat not found");
    }

    else{
        res.json(removed);
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup ,addToGroup,removeFromGroup}