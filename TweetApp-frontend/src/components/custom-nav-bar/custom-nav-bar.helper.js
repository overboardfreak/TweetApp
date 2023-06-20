import { HttpGet } from "../../services/api-services";
import { BASE_URI, GET_USER, LOGOUT } from "../../constants/endpoints";

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

export const logOutCurrentUser = async () => {
  try {
    let credentials = localStorage.getItem("token");
    let apiUrl = BASE_URI + LOGOUT;
    let headers = {
      "Authorization": credentials
    }
    let response = await HttpGet(apiUrl, {}, headers);
    return response;
  } catch (e) {
    throw e;
  }
}
