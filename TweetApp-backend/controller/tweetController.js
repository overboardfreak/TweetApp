const jwtDecode = require('jwt-decode');
const Tweet = require('../models/tweet')
const User = require("../models/user");
const util = require("../util");
var HashtagModel = require('../models/hashtag');
var findHashtags = require('find-hashtags');

//POST TWEET
module.exports.postTweet = async function (req, res) {

    const decodedToken = jwtDecode(req.headers['authorization']);
    // console.log("decoded token", decodedToken)
    const user = await User.findById(decodedToken.id)
    // console.log("user in tweet controller", user)
    let userIds = decodedToken.id
    let newTweet = new Tweet({
        userId: userIds,
        userName: user.loginId,
        userTweets: req.body.userTweets,
        postedOn: Date.now(),
    })

    newTweet.save(function (err, resp) {
            addHashtag({ tweetText: req.body.userTweets, tweet_id: resp.id })
            res.status(201).json({
                msg: 'Tweet Posted successfully',
            });
    });
}


//GET ALL TWEETS
module.exports.getTweet = async (req, res) => {
    await Tweet.find({})
        .then((result) => {
            res.status(200).json({
                tweetData: result,
            });
        });
}

//GET TWEET OF CURRENT USER
module.exports.getTweetCurrentUser = async (req, res) => {
    const decodedToken = jwtDecode(req.headers.authorization);
    await Tweet.find({
        userId: decodedToken.id,
    })
        .then((result) => {
            res.status(200).json({
                tweetData: result,
            });
        });
}

//GET SPECIFIC TWEET BY USER ID
module.exports.getTweetByUserId = async (req, res) => {
    const decodedToken = jwtDecode(req.headers['authorization']);
    // console.log("req>>>", req.params.id)
    const userIds = req.params.id
    await Tweet.find({})
        .then((result) => {
            // console.log("result", result)
            const filteredResult  = result.filter(ele => ele.userId == userIds)
            // console.log("filteredResult", filteredResult)
            res.status(200).json({
                tweetData: filteredResult,
            });
        });
}

//UPDATE SPECIFIC TWEET BY ID
module.exports.updateTweetById = async (req, res) => {
    await Tweet.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            userTweets: req.body.userTweets
        },
    })
        .then(() => {
            res.status(201).json({
                message: 'Tweet Updated Successfully',
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({
                error: err,
            });
        });
}

//Commenting on a tweet
module.exports.commentTweet = async (req, res) => {
    const decodedToken = await jwtDecode(req.headers['authorization']);
    let user = await User.findById(decodedToken.id);
    let loginId = user.loginId;
    let search = {
        _id: req.body.id
    }
    let update = {
        $push: {
            "comments": {
                text: req.body.text,
                user: decodedToken.id,
                userName: loginId,
                postedOn: Date.now()
            }
        },
    }
    Tweet.findOneAndUpdate(search, update, { safe: true, new: true, useFindAndModify: false }, function (err, result) {
        if (err) {
            res.status(400).json({
                success: false,
                msg: "Something went wrong",
                payload: err
            })
        } else {
            addHashtag({ tweetText: req.body.text, tweet_id: res.id }),
                res.status(201).json({
                    success: true,
                    msg: "Successfully commented on the tweet",
                    payload: result
                })
        }
    });
}

module.exports.deleteTweetById = async (req, res) => {
    await Tweet.findOneAndDelete({
        _id: req.params.id,
    })
        .then((result) => {
            if (result == null) {
                res.status(400).json({
                    error: `Tweet with id:${req.params.id} does not exist`,
                });
            } else {
                res.status(200).json({
                    message: 'Tweet deleted successfully',
                });
            }
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
}


//AddHashtag
addHashtag = function (req) {
    var hashtags = findHashtags(req.tweetText);
    const promises = hashtags.map(hashtag => {
        return new Promise((resolve, reject) => {
            HashtagModel.updateOne(
                {
                    "hashtag": hashtag
                },
                {
                    hashtag: hashtag,
                    $push: {
                        "tweets": req.tweet_id
                    }
                },
                {
                    upsert: true
                },

                function (err, res) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                }
            )
        })
    })
    Promise.all(promises)
        .then((result) => {
            return
        })
        .catch(err => {
        })
}

