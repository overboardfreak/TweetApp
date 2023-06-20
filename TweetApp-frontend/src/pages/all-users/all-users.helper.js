import { HttpGet, HttpPost } from "../../services/api-services";
import { BASE_URI, ALL_USERS, SENDREQUEST } from "../../constants/endpoints";

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

