import { HttpPost } from "../../services/api-services";
import { BASE_URI, REGISTER } from "../../constants/endpoints";

export const register = async (values) => {
    try {
        let apiUrl = BASE_URI + REGISTER;
        await HttpPost(apiUrl, {
                loginId: values.loginId,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                contactNo: values.contactNo
        })
    } catch (e) {
        throw e;
    }
}

