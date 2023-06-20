import React, { useRef } from 'react';
import "./notification.styles.css";
import imgProfileEmpty from '../../assets/images/defaultUser.png';
import { acceptFriendRequest, fetchFriendRequests, rejectFriendRequest } from './notification.helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Notification(props) {
    React.useEffect(() => {
        initialise();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.global.selectedPage]);
    const [allTweets, setAllTweets] = React.useState([])
    const [requestStatus, setRequestStatus] = React.useState([])
    const initialise = async () => {
        try {
            props.showLoader("Fetching Friend Request")
            let allTweets = await fetchFriendRequests();
            setAllTweets(allTweets.data);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }
    const generateTweets = () => {
        return allTweets.map((tweet, index) => {
            let imgSrc = imgProfileEmpty;
            
            const date1 = new Date();
            const date2 = new Date(tweet.postedOn);
            const diffTime = Math.abs(date2 - date1);
            let diffDays = Math.ceil(diffTime / (1000 * 60));
            let units = "mins"
            if (diffDays > 60) {
                diffDays = (diffDays / 60).toFixed();
                units = "hours"
                if (diffDays > 24) {
                    diffDays = (diffDays / 24).toFixed();
                    units = diffDays > 1 ? "days" : "day"
                }
            }
            const acceptRequest = async () => {
                try {
                    props.showLoader("Accept Friend Request")
                    await acceptFriendRequest(tweet._id);
                    toast.success("Request Accepted")
                    props.hideLoader();
                    let allTweets = await fetchFriendRequests();
                    setAllTweets(allTweets.data);
                } catch (e) {
                    props.hideLoader();
                }
            }

            const rejectRequest = async () => {
                try {
                    props.showLoader("Reject Friend Request")
                    await rejectFriendRequest(tweet._id);
                    toast.warn("Request Rejected")
                    props.hideLoader();
                    let allTweets = await fetchFriendRequests();
                    setAllTweets(allTweets.data);               
                } catch (e) {
                    props.hideLoader();
                }
            }
            return (
                <div className="shadow" style={{ width: "60%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgProfileEmpty} className="rounded-circle" height={65} width={65} style={{ marginRight: 20 }} />
                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "inline-flex", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ font: 'Segoe UI', display: "inline-flex", justifyContent: "space-between", width: "100%", fontSize: 23, textTransform: 'capitalize' }}>{tweet.senderFirstName} {tweet.senderLastName}</span>
                            <div style={{ alignItems: "flex-start", display: "inline-flex", width: "70%" }}>
                                <button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: 100,  borderRadius: 20, marginBottom: 20, marginRight: 30, padding: 5 }} onClick={acceptRequest}>Accept</button>
                                <button style={{ borderWidth: 0, backgroundColor: "#fc0349", color: "white", width: 100,  borderRadius: 20, marginBottom: 20, marginRight: 30, padding: 5 }} onClick={rejectRequest}>Reject</button>
                            </div>
                        </div>    
                        <div style={{ flexDirection: "row", display: "inline-flex", alignItems: "center", marginTop: -23, marginLeft: 1}}>
                            <p style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 13 }}>@{tweet.senderId}</p>
                        </div>                    
                        </div>           
                    </div>
                </div >
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
