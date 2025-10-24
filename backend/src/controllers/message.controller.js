import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { sendMessageEmail } from "../emails/sendChatEmail.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("--password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in getAllContacts controller: ", error);
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId }, //i sent message and other received
        { senderId: userToChatId, receiverId: myId }, //other sent message and i received
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in getMessagesById controller: ", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = await Message({
      senderId: req.user._id,
      receiverId,
      text,
      image: imageURL,
    });
    //use socket.io to send message in real time

<<<<<<< HEAD
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

=======
>>>>>>> origin/socketio-integration
    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in sendMEssage controller: ", error);
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    //get all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    //get sender id and receiver ids of messages
    const ChatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    //after getting the messages id, use them to get the actual users
    const ChatPartners = await User.find({
      _id: { $in: ChatPartnerIds },
    }).select("-password");
    res.status(200).json(ChatPartners);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in getChatPartners controller: ", error);
  }
};
