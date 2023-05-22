const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {

        var message = await Message.create(newMessage);

        message = await (
            await message.populate("sender", "name pic")
          ).populate({
            path: "chat",
            select: "name pic email",
            model: "Chat",
            populate: { path: "users", select: "name pic email", model: "User" },
          });


            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            res.json(message);

    } catch (error) {
            res.sendStatus(400);
            throw new Error(error.message);
    }
})

const allMessages = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;

    if(!chatId) return res.sendStatus(400);

    try {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat");
            
        res.json(messages);
    } catch (error) {
        res.sendStatus(400);
        throw new Error(error.message);
    }
})

module.exports = { sendMessage, allMessages };