const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FriendRequestSchema = new Schema(
  {
    senderUserId: {
      type: String,
      ref: 'user',
    },
    senderId: {
      type: String,
      ref: 'user',
    },
    senderFirstName: {
      type: String,
      ref: 'user',
    },
    senderLastName: {
      type: String,
      ref: 'user',
    },
    receiverId: {
      type: String,
      ref: 'user',
    },
    requestStatus: {
      type: String,
    }
  },
  { timestamps: true },
)

module.exports = mongoose.model('friendRequest', FriendRequestSchema)
