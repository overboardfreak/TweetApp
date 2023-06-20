
import React from 'react';
import "./reset-password.styles.css";
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import imgLogo from "../../assets/images/logo.png";
import { pages } from '../../constants/strings';
import { resetPassword } from './reset-password.helper';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword(props) {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [values, setValues] = React.useState({
        email: '',
        otp: '',
        password: '',
    });
    const handleChange = (prop) => (event) => {
        setErrorMessage("")
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onResetPasswordClick = async () => {
        try {
            props.showLoader("Resetting Password")
            await resetPassword(values);
            toast.success("Password Updated Sucessfully")
            props.updateSelectedPage(pages.LOGIN)
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
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { props.updateSelectedPage(pages.LOGIN) }}>
                        <img src={imgLogo} height={50} width={50} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                        <h2 style={{ fontFamily: "Barlow-Bold", marginBottom: 30 }}>Reset Password</h2>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth className="formControl">
                            <TextField label="Enter Login Id" variant="standard"
                                onChange={handleChange('email')}
                                error={errorMessage != ""} />
                        </FormControl>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth className="formControl">
                            <TextField label="OTP" variant="standard"
                                onChange={handleChange('otp')}
                                error={errorMessage != ""} />
                        </FormControl>
                    </div> 
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth>
                            <TextField label="Enter New Password" variant="standard"
                                type={values.showPassword ? 'text' : 'password'}
                                onChange={handleChange('password')}
                                error={errorMessage != ""}
                                helperText={errorMessage}
                                InputProps={{
                                    endAdornment:
                                        <>
                                            <InputAdornment position="end" >
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        </>
                                }} />
                        </FormControl>
                    </div>  
                    <div>
                        {
                            (values.email != "" && values.otp != "" && values.password) ?
                                <button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }} onClick={onResetPasswordClick}>Reset Password</button>
                                : <button style={{ borderWidth: 0, backgroundColor: "#b9dbf0", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }}>Reset Password</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )

}
