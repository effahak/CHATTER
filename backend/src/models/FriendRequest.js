import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

    // look into graphs as a data structure in dbs
}
);

const friendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default friendRequest;