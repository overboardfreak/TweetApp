
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FailedLoginAttemptSchema = new Schema(
  {userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  failedLoginAttempt:{
    type: Number,
    default: 0
      }
  }
)

module.exports = mongoose.model('loginAttempt', FailedLoginAttemptSchema)
