import { HttpGet, HttpPost, HttpPut } from "../../services/api-services";
import { BASE_URI, ALL_USERS, SENDREQUEST, MYTWEET, UPDATEUSER } from "../../constants/endpoints";

export const fetchAllUsers = async () => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI +  ALL_USERS;
        let headers = {
            "Authorization": credentials
        }
        let response = await HttpGet(apiUrl, {}, headers)

        return response.data.UserData;
    } catch (e) {
        throw e;
    }
}
export const updateStatus = async(status) => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI + UPDATEUSER + '/' + status;
        let headers = {
            "Authorization": credentials
        }
        console.log("API", apiUrl);
        let response = await HttpGet(apiUrl, {}, headers)
        // let response = result.data.tweetData.reverse();
        return response;
    } catch (e) {
        throw e;
    }
}

export const fetchMyTweets = async () => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI + MYTWEET
        let headers = {
            "Authorization": credentials
        }
        let result = await HttpGet(apiUrl, {}, headers)
        let response = result.data.tweetData.reverse();
        return response;
    } catch (e) {
        throw e;
    }
}

export const sendFriendRequest = async (userId) => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI +  SENDREQUEST + '/' + userId + '/send';
        let headers = {
            "Authorization": credentials
        }
        let response = await HttpPost(apiUrl, {}, headers)

        return response.data.message;
    } catch (e) {
        throw e;
    }
}
