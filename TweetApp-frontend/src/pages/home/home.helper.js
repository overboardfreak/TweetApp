import { HttpGet, HttpPost } from "../../services/api-services";
import { BASE_URI, BASE_TWEET_URL, ALL_TWEETS, GET_USER, MYTWEET, REPLY } from "../../constants/endpoints";

export const fetchLoggedInUserDetails = async () => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI + GET_USER;
        let headers = {
          "Authorization": credentials
        }
        let response = await HttpGet(apiUrl, {}, headers);
        return response;
    } catch (e) {
        throw e;
    }
}
export const getAllTweets = async () => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI + ALL_TWEETS;
        let headers = {
            "Authorization": credentials
        }
        let response = await HttpGet(apiUrl, {}, headers)
        return response.data.tweetData;
    } catch (e) {
        throw e;
    }
}

export const fetchAllTweets = async () => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI + ALL_TWEETS;
        let headers = {
            "Authorization": credentials
        }
        let result = await HttpGet(apiUrl, {}, headers);
        let response = result.data.tweetData.reverse();
        return response;
    } catch (e) {
        throw e;
    }
}

export const postTweet = async (loginId, tweetMessage) => {
    try {
        let credentials = localStorage.getItem("token");
        // console.log("credentials", credentials)
        let headers = {
            "Authorization": credentials
        }
        let apiUrl = BASE_URI + BASE_TWEET_URL ;
        await HttpPost(apiUrl, {
                userTweets: tweetMessage,
        }, headers)
    } catch (e) {
        throw e;
    }
}
export const postReplyTweet = async (data) => {
    try {
        let credentials = localStorage.getItem("token");
        let headers = {
            "Authorization": credentials
        }

        let apiUrl = BASE_URI + REPLY;
        let response = await HttpPost(apiUrl, data, headers);
        return response;
    } catch (e) {
        throw e;
    }
}

export const likeTweet = async (data) => {
    try {
        let credentials = "Bearer " + localStorage.getItem("token");
        let headers = {
            "Authorization": credentials
        }
        let apiUrl = BASE_URI + BASE_TWEET_URL + "/like" ;
        await HttpPost(apiUrl, data, headers)
    } catch (e) {
        throw e;
    }
}

