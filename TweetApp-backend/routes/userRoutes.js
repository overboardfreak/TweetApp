const { Router } = require("express");
const userController = require("../controller/userController");
const {requireAuth} = require('../middleware/auth');

const router = Router();

// user routes
router.post("/api/v1/tweetapp/user/signup", userController.signup);
router.post("/api/v1/tweetapp/user/signin", userController.login);
router.get("/api/v1/tweetapp/user/logout", requireAuth, userController.logout);
router.put("/api/v1/tweetapp/user/update", requireAuth, userController.updateUser);
router.get("/api/v1/tweetapp/user/id/:id", requireAuth, userController.getUserById);
router.get("/api/v1/tweetapp/user/userprofile/:status", requireAuth, userController.updateProfileStatus);
// router.put('/passwordChange', requireAuth, userController.changePassword);
router.post("/api/v1/tweetapp/user/forgetPassword", userController.forgetPassword);
router.post("/api/v1/tweetapp/user/resetPassword", userController.resetPassword);
router.get("/api/v1/tweetapp/user/getUser", requireAuth, userController.getUser);
router.get("/api/v1/tweetapp/user/getAllUsers", requireAuth, userController.getAllUsers);

//Friend Request
router.post("/api/v1/tweetapp/user/friend_request/:userId/send", userController.sendFriendRequest);
router.get('/api/v1/tweetapp/user/friend_request/:requestId/?do=accept',userController.acceptFriendRequest);
router.get('/api/v1/tweetapp/user/friend_request/:requestId/?do=reject',userController.declineFriendRequest);
router.get("/api/v1/tweetapp/user/friend_request", requireAuth, userController.getRequests);

module.exports = router;
