const jwtDecode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const FriendRequest = require('../models/friendRequest')
const LoginAttempt = require('../models/loginAttempt')


const util = require("../util");
const otpGenerator = require('otp-generator')

module.exports.signup = async (req, res) => {

  let otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

  const {
   firstName,
   lastName,
   email,
   loginId,
   password,
   contactNo,
  } = req.body;
  const active = false //TODO: take decision whether to set true or false here
  const profileStatus = "public";
  try {
    const user = await User.create({
        firstName,
        lastName,
        email,
        loginId,
        password,
        contactNo,
        otp,
        active,
        profileStatus,
    });
    res.status(201).json({
      user,
      message: "Registration Sucessful",
    });
  } catch (err) {
    const errors = util.handleUserErrors(err);
    res.status(403).json({
      errors,
    });
  }
};

module.exports.login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  try { 
    let currentUser = await User.find({email:email})
    // console.log('currentUser :>> ', currentUser[0]._id);
    let failedLoginCount = await LoginAttempt.find({userId:currentUser[0]._id})
    // console.log("failed attempt", failedLoginCount)
    if(failedLoginCount.length != 0  && failedLoginCount[0].failedLoginAttempt >= 3){
      throw new Error('Maximum login attempt limit has been reached');
    }
    const user = await User.login(email, password);
    // console.log("user in login>>>", user) 
    const token = util.createToken(user._id);
    // console.log("token in login func>>>", token)
    User.findOneAndUpdate( 
      {_id: user._id},  
      {  
          $set: {active : true}
      },
      {
          returnNewDocument: true
      }
  , function( error, result){
    if(error){
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  // console.log("result in login", result)
  });
    res.cookie("token", token, { httpOnly: true});
    // res.json({
    //   token : `Bearer ${token}`
    // })
    res.status(200).json({   
      user: user._id,
      message: "Login Successful",
      token, 
    });
  } catch (err) {
      console.log("error", err)
    // console.log("user in login>>>", email)
    let unAuthorizedUser = await User.find({email:email})
    let unAuthorizedUserId = unAuthorizedUser[0]._id.valueOf()
    // console.log('unAuthorizedUser :>> ', unAuthorizedUserId);
    let currentFailedCount =  await LoginAttempt.find({userId:unAuthorizedUserId})
    // console.log('currentFailedCount :>> ', currentFailedCount);
    if(currentFailedCount.length ==0) {
      const newLoginAttempt = new LoginAttempt({
        userId: unAuthorizedUserId,
        failedLoginAttempt: 1
      })
         await newLoginAttempt.save()
    }else{
      let newFailedAttempt = currentFailedCount[0].failedLoginAttempt + 1 
      // console.log("new failed count", newFailedAttempt)
      let result = await LoginAttempt.updateOne({
        userId: unAuthorizedUser
      }, {
          $set: {
            failedLoginAttempt: newFailedAttempt
          }
      })
      // console.log('result :>> ', result);
     
    }
    const errors = util.handleUserErrors(err);
    res.status(401).json({
      errors,
    });
  }
};

module.exports.forgetPassword = async (req, res) => {
  const {
    email
  } = req.body;

  try {
    const user = await User.forgetPassword(email);
    res.status(200).json({
      user: user._id,
      message: "Email has been sent"
    });
  } catch (err) {
    const errors = util.handleUserErrors(err);
    res.status(404).json({
      message: "User not found"
    });
  }
};


module.exports.resetPassword = async (req, res) => {
  const {
    email,
    otp, 
    newPassword
  } = req.body;

  try {
    const user = await User.resetPassword(email, otp, newPassword);
    res.status(200).json({
      message: "Password has been reset"
    });
  } catch (err) {
    const errors = util.handleUserErrors(err);
    res.status(503).json({
      message: err.message,
    });
  }
};

// User logout
module.exports.logout = async (req, res) => { 
  const decodedToken = await jwtDecode(req.headers['authorization']);
  // console.log("decodedToken in logout>>>", decodedToken)

  const user = await User.findById(decodedToken.id)
  // console.log("user in logout1>>>", user)

  if (user) {

    User.findOneAndUpdate(
      {_id: decodedToken.id}, 
      { 
          $set: {active : false}
      },
      {
          returnNewDocument: true
      }
  , function( error, result){
  if(error){
    res.status(500).json({
      message: "Something went wrong",
    });
  }
  // console.log("result", result)
  });
  }else {
    res.status(404).json({
      message: "user not found",
    });
  }
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.status(200).json({
    message: "Logout Successful",
  });
};

module.exports.updateProfileStatus = async (req,res) => {
  try {
    const decodedToken = await jwtDecode(req.headers['authorization']);
    User.findOneAndUpdate({
      _id: decodedToken.id,
    }, {
      $set: {
        profileStatus: req.params.status,
      },
    })
      .then(() => {
        res.status(200).json({
          message: "Profile Status Updated Successfully",
        });
      })
  } catch(err) {
    
  }
}

// Update an user
module.exports.updateUser = async (req, res) => {
  const decodedToken = await jwtDecode(req.headers['authorization']);
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(403).json({
        error: "password is required",
      });
    }
      User.findOneAndUpdate({
      _id: decodedToken.id,
    }, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        loginId: req.body.loginId,
        password: hash,
        contactNo: req.body.contactNo,
      },
    })
      .then(() => {
        res.status(200).json({
          message: "Updated Successfully",
        });
      })
  });
};

// // Change password
// module.exports.changePassword = async (req, res) => {
//   // try{
//   const decodedToken = await jwtDecode(req.cookies.jwt);
//   bcrypt.hash(req.body.password, 10, (err, hash) => {
//     if (err) {
//       return res.status(403).json({
//         error: "password is required",
//       });
//     }
//     User.findOneAndUpdate({
//       _id: decodedToken.id,
//     }, {
//       $set: {
//         password: hash,
//       },
//     })
//       .then(() => {
//         res.status(200).json({
//           message: "Password Changed Successfully",
//         });
//       });
//   });
// };

// Retrive user
module.exports.getUser = async (req, res) => {
  const decodedToken = jwtDecode(req.headers.authorization);
  await User.find({
    _id: decodedToken.id,
  })
    .then((result) => {
      res.status(200).json(result);
    });
};

// Retrive user by id
module.exports.getUserById = async (req, res) => {
  const userIds = req.params.id
  await User.find({})
      .then((result) => {
          // console.log("result", result)
          const filteredResult  = result.filter(ele => ele._id == userIds)
          // console.log("filteredResult", filteredResult)
          res.status(200).json({
              userData: filteredResult,
          });
      });
};



//GET ALL Users
module.exports.getAllUsers = async (req, res) => {
  const decodedToken = await jwtDecode(req.headers['authorization']);
  let data = [];
  await User.find({})
      .then((result) => {
        for (const user of result) {
          if(user.id !== decodedToken.id) {
            data.push(user);
          }
        }
          res.status(200).json({
              UserData: data,
          });
      });
}

// // Deleting a user
// module.exports.deleteUser = async (req, res) => {
//   const decodedToken = jwtDecode(req.cookies.jwt);
//   await User.deleteOne({
//     _id: decodedToken.id,
//   })
//     .then(() => {
//       res.cookie("jwt", "", {
//         maxAge: 1,
//       });
//       res.status(200).json({
//         message: "User deleted",
//       });
//     });
// };


module.exports.sendFriendRequest = async (req, res) => {

  const decodedToken = await jwtDecode(req.headers['authorization']);

  const currentUser = await User.findById(decodedToken.id)
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (currentUser._id == req.params.userId) {
      return res
        .status(400)
        .json({ error: 'You cannot send friend request to yourself' })
    }

    if (user.friends.includes(currentUser._id)) {
      return res.status(400).json({ error: 'Already Friends' })
    }

    const friendRequest = await FriendRequest.findOne({
      sender: currentUser._id,
      receiver: req.params.userId,
    })

    if (friendRequest && friendRequest.receiverId === req.params.userId && friendRequest.senderUserId === decodedToken.id) {
      return res.status(400).json({ error: 'Friend Request already send' })
    }

    const totalFriendRequestbySender = await FriendRequest.find({ 
      sender: currentUser._id,
    })
    let count = 0;
    for(let i=0;i<totalFriendRequestbySender.length;i++){
      if(totalFriendRequestbySender[i].requestStatus === "Pending")
      {
        count ++;
      }
    }

    if(count > 5){
      return res.status(400).json({ error: 'You have reached the limit of maximum pending requests' })
    }

    const newFriendRequest = new FriendRequest({
      senderUserId: currentUser._id,
      senderId: currentUser.loginId,
      senderFirstName: currentUser.firstName,
      senderLastName: currentUser.lastName,
      receiverId: req.params.userId,
      requestStatus: "Pending"
    })

    const save = await newFriendRequest.save()

    const friend = await FriendRequest.findById(save.id).populate('receiverId')


    res
      .status(200)
      .json({ message: 'Friend Request Sent'})
  } catch (err) {
    // console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}

module.exports.getRequests = async (req, res) => {
    try {
      const decodedToken = jwtDecode(req.headers.authorization);
      await FriendRequest.find({
        receiverId: decodedToken.id,
      })
        .then((result) => {
          res.status(200).json(result);
        });

    } catch (err) {
      return res.status(500).json({error:"Something went wrong"});
    }
}



module.exports.acceptFriendRequest = async (req, res) => {
  try {
    const decodedToken = await jwtDecode(req.headers['authorization']);
    const currentUser = await User.findById(decodedToken.id)
    const friendsRequest = await FriendRequest.findById(req.params.requestId)
    if (!friendsRequest) {
      return res
        .status(404)
        .json({ error: 'Request already accepted or not sent yet' })
    }

    if (friendsRequest.receiverId !== currentUser.id) {
      return res
        .status(404)
        .json({ error: 'You cannot accept this friend request' })
    }

    const sender = await User.findById(friendsRequest.senderUserId)
    if (sender.friends.includes(friendsRequest.receiverId)) {
      return res.status(400).json({ error: 'already in your friend lists' })
    }

    if (friendsRequest.requestStatus === "Rejected") {
      return res
        .status(404)
        .json({ error: 'Request already declined' })
    }

    sender.friends.push(currentUser._id)
    await sender.save() 

    // const currentUser = await User.findById(currentUser._id)
    if (currentUser.friends.includes(friendsRequest.senderUserId)) {
      return res.status(400).json({ error: 'already  friend ' })
    }

    if (friendsRequest.senderUserId.toString() === sender._id.toString() &&  friendsRequest.receiverId.toString() === currentUser._id.toString()) {
      if(friendsRequest.requestStatus === "Rejected")
      return res.status(400).json({ error: 'You have already rejected the request...' })
    }

    currentUser.friends.push(friendsRequest.senderUserId)
    await currentUser.save() //

    // const chunkData = FilterUserData(sender)
    // we won't delete just update the status
    // await FriendRequest.deleteOne({ _id: req.params.requestId })


    FriendRequest.findOneAndUpdate(
      {_id: req.params.requestId}, 
      { 
          $set: {requestStatus : "Accepted"}
      },
      {
          returnNewDocument: true
      }
  , function( error, result){
    if(error){
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  // console.log("result in login", result)
  });

  await FriendRequest.deleteOne({ id: friendsRequest.id })
    res
      .status(200)
      .json({ message: 'Friend Request Accepted'})
  } catch (err) {
    // console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}


module.exports.declineFriendRequest = async (req, res) => {
  try {
    const decodedToken = await jwtDecode(req.headers['authorization']);
    const currentUser = await User.findById(decodedToken.id)
    const friendsRequest = await FriendRequest.findById(
      req.params.requestId,
    ).populate('senderUserId')
    if (friendsRequest.receiverId !== currentUser.id) {
      return res
        .status(404)
        .json({ error: 'You cannot reject this friend request' })
    }
    if (!friendsRequest) {
      return res
        .status(404)
        .json({ error: 'Request already declined or not sended yet' })
    }

    if (friendsRequest.requestStatus === "Rejected") {
      return res
        .status(404)
        .json({ error: 'Request already declined' })
    }

    if (friendsRequest.requestStatus === "Accepted") {
      return res
        .status(404)
        .json({ error: 'Request already Accepted' })
    }

    FriendRequest.findOneAndUpdate(
      {_id: req.params.requestId}, 
      { 
          $set: {requestStatus : "Rejected"}
      },
      {
          returnNewDocument: true
      }
  , function( error, result){
    if(error){
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  // console.log("result in login", result)
  });
    await FriendRequest.deleteOne({ id: friendsRequest.id })
    res.status(200).json({ message: 'Friend Request Declined' })

  } catch (err) {
    // console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}