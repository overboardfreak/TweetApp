import { HttpGet } from "../../services/api-services";
import { BASE_URI, GETUSERBYID, GET_USER, SENDREQUEST, REQUESTRESPONSE } from "../../constants/endpoints";

export const fetchFriendRequests = async () => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI + SENDREQUEST;
        let headers = {
          "Authorization": credentials
        }
        let response = await HttpGet(apiUrl, {}, headers);
        return response;
    } catch (e) {
        throw e;
    }
}

export const acceptFriendRequest = async (requestId) => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI +  REQUESTRESPONSE + '/' + requestId + '/do=accept';
        let headers = {
            "Authorization": credentials
        }
        let response = await HttpGet(apiUrl, {}, headers)

        return response;
    } catch (e) {
        throw e;
    }
}

export const rejectFriendRequest = async (requestId) => {
    try {
        let credentials = localStorage.getItem("token");
        let apiUrl = BASE_URI +  REQUESTRESPONSE + '/' + requestId + '/do=reject';
        let headers = {
            "Authorization": credentials
        }
        let response = await HttpGet(apiUrl, {}, headers)

        return response;
    } catch (e) {
        throw e;
    }
}
