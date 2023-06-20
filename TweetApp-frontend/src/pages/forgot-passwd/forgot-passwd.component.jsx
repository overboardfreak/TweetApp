
import React from 'react';
import "./forgot-passwd.styles.css";
import FormControl from '@material-ui/core/FormControl';
import imgLogo from "../../assets/images/logo.png";
import { pages } from '../../constants/strings';
import { forgotPassword } from './forgot-passwd.helper';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword(props) {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [values, setValues] = React.useState({
        email: '',
    });
    const handleChange = (prop) => (event) => {
        setErrorMessage("")
        setValues({ ...values, [prop]: event.target.value });
    };

    const onForgotPasswordClick = async () => {
        try {
            props.showLoader("Resetting Password")
            await forgotPassword(values);
            toast.success("OTP has been sent to the registered email")
            props.updateSelectedPage(pages.RESET)
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
            setErrorMessage("No user exists with login Id as " + values.email)
        }
    }

    return (
        <>
            <div className={"d-flex h-100 justify-content-center "}>
                <div style={{ width: "30%", maxWidth: 400 }}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { props.updateSelectedPage(pages.RESET) }}>
                        <img src={imgLogo} height={50} width={50} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                        <h2 style={{ fontFamily: "Barlow-Bold", marginBottom: 30 }}>Forgot Password</h2>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth className="formControl">
                            <TextField label="Enter Login Id" variant="standard"
                                onChange={handleChange('email')}
                                error={errorMessage != ""} />
                        </FormControl>
                    </div>  
                    <div>
                        {
                            (values.email != "") ?
                                <button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }} onClick={onForgotPasswordClick}>Reset Password</button>
                                : <button style={{ borderWidth: 0, backgroundColor: "#b9dbf0", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }}>Reset Password</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )

}
