import { HttpPost } from "../../services/api-services";
import { BASE_URI, RESET } from "../../constants/endpoints";

export const resetPassword = async (values) => {
    try {
        let apiUrl = BASE_URI + RESET;
        let response = await HttpPost(apiUrl, {
                email: values.email,
                otp: values.otp,
                newPassword: values.password,
        })
        if(response.data.statusMessage == "USER NOT FOUND"){
            throw "User does not exist"
        }
    } catch (e) {
        throw e;
    }
}

