import React from 'react';
import "./login.styles.css";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import imgLogo from "../../assets/images/logo.png";
import { pages } from '../../constants/strings';
import TextField from '@material-ui/core/TextField';
import { authenticate } from './login.helper';

export default function Login(props) {
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        showPassword: false,
    });
    const [errorMessage, setErrorMessage] = React.useState("");
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
    const onForgotPasswordClick = () => {
        props.updateSelectedPage(pages.FORGOT_PASSWORD)
    }
    const onRegisterClick = () => {
        props.updateSelectedPage(pages.REGISTER)
    }
    const onLoginClick = async () => {
        try {
            props.showLoader("Logging in")
            let token = await authenticate(values);
            await localStorage.setItem("isAuthenticated", true);
            await localStorage.setItem("token", token);
            await localStorage.setItem("loginId", values.email);
            props.updateSelectedPage(pages.HOME)
            props.hideLoader();
        } catch (e) {
            setErrorMessage("Incorrect Credentials")
            props.hideLoader();
        }
    }
    return (
        <>
            <div className={"d-flex h-100 justify-content-center align-items-center"}>
                <div style={{ width: "100%", maxWidth: 400 }}>
                    <div>
                        <img src={imgLogo} height={200} width={200} />
                    </div>
                    <div>
                        <h2 style={{ fontFamily: "Barlow-Bold", marginBottom: 20 }}>Log in to Tweet App</h2>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth className="formControl">
                            <TextField label="Email ID" variant="outlined"
                                onChange={handleChange('email')}
                                error={errorMessage != ""} />
                        </FormControl>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth>
                            <TextField label="Password" variant="outlined"
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
                            (values.email != "" && values.password != "") ?
                                <button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }} onClick={onLoginClick}>Log in</button>
                                : <button style={{ borderWidth: 0, backgroundColor: "#b9dbf0", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }}>Log in</button>
                        }
                    </div>
                    <div>
                        <a style={{ cursor: "pointer", marginRight: 10, color: "#1DA1F2" }} className="loginLink" onClick={onForgotPasswordClick}>Forgot Password?</a>
                        <a style={{ cursor: "pointer", color: "#1DA1F2" }} className="loginLink" onClick={onRegisterClick}>Sign Up for TweetApp</a>
                    </div>
                </div>
            </div>
        </>
    )

}
