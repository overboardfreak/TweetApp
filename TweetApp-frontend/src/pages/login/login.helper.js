import { HttpPost } from "../../services/api-services";
import { BASE_URI, LOGIN } from "../../constants/endpoints";

export const authenticate = async (values) => {
    try {
        let apiUrl = BASE_URI + LOGIN;
        let response = await HttpPost(apiUrl, {email: values.email, password: values.password})
        return response.data.token;
    } catch (e) { 
        throw e;
    }
}

