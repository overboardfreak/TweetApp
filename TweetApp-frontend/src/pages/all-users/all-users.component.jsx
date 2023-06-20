import React, { useRef } from 'react';
import "./all-users.styles.css";
import imgProfileEmpty from '../../assets/images/defaultUser.png';
import imgEmail from '../../assets/images/email.png';
import { pages } from '../../constants/strings';
import followersLogo from '../../assets/images/followersLogo.jpg';
import { fetchAllUsers, sendFriendRequest } from './all-users.helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyTweets(props) {
    React.useEffect(() => {
        initialise();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.global.selectedPage]);
    const [allUsers, setAllUsers] = React.useState([])
    const [requestData, sendReq] = React.useState([])
    const [status, setStatus] = React.useState('Follow')
    const initialise = async () => {
        try {
            props.showLoader("Fetching All Users")
            let allUsers = await fetchAllUsers();
            setAllUsers(allUsers);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }
    const generateTweets = () => {

        return allUsers.map((tweet, index) => {
            let imgSrc = imgProfileEmpty;  
            const sendRequest = async() => {                
                try {                    
                    props.showLoader("Send Friend Request")
                    await sendFriendRequest(tweet._id)
                    .then((res) => updateFollowStatus(res))                   
                    toast.success("Follow Request Sent Sucessfully")                    
                    props.updateSelectedPage(pages.ALL_USERS);
                    props.hideLoader();
                } catch (e) {
                    props.hideLoader();
                }
            }
            const updateFollowStatus = async(result) => {
                if(result === "Friend Request Sent" || result === "Friend Request already send") {
                    setStatus('Pending');
                } else if(result === "You cannot send friend request to yourself") {
                    setStatus('Follow');
                } else if(result === "Already Friends") {
                    setStatus('Following');
                }
            }

            return (
                <div key = {index} className="shadow" style={{ width: "60%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgSrc} className="rounded-circle" height={40} width={40} style={{ marginRight: 20 }} />
                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <div style={{ display: "inline-flex", justifyContent: "space-between", width: "100%" }}>
                                <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 16, margin: 0 }}>@{tweet.loginId}</p>
                            </div>
                            <div style={{ flexDirection: "row", display: "inline-flex", alignItems: "center", marginTop: 3, marginLeft: 2}}>
                            <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 14, textTransform: 'capitalize' }}>{tweet.firstName} {tweet.lastName}</span>
                            </div>
                            <div style={{ flexDirection: "row", display: "inline-flex", alignItems: "center", marginTop: 3, marginLeft: 2}}>
                            <img src={imgEmail} height={20} width={20} style={{ marginRight: 5 }} />
                            <p style={{ marginRight: 10, marginBottom: 0 }}>{tweet.email} </p>
                            </div>
                            <div style={{ flexDirection: "row", display: "inline-flex", alignItems: "center", marginTop: 10 }}>
                                <img src={followersLogo} height={20} width={20} style={{ marginRight: 5 }} />
                                <p style={{ marginRight: 10, marginBottom: 0 }}>{tweet.friends.length} </p>
                                {tweet.friends.length > 0 ?"Following" :<button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: 80, padding: 3, borderRadius: 20, marginRight: 40 }} onClick={sendRequest}>{status}</button>}
                            </div>
                        </div>            
                    </div>      
                    </div>
            )
        })
    }
    return (
        <>
            <div className={"h-100"}>
                <div>
                    {
                        generateTweets()
                    }
                </div>

            </div>
        </>
    )

}
