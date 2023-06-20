import React, { useState } from 'react';
import "./user.styles.css";
import imgProfileEmpty from '../../assets/images/defaultUser.png';
import imgReply from '../../assets/images/reply.png';
import imgEmail from '../../assets/images/email.png';
import followersLogo from '../../assets/images/followersLogo.jpg'
import imgBlueLogo from '../../assets/images/logo-blue.png'
import { fetchLoggedInUserDetails, postReplyTweet } from '../home/home.helper';
import { fetchMyTweets, updateStatus } from './user.helper'

export default function UserProfile(props) {
    React.useEffect(() => {
        initialise();
        initialiseTweets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.global.selectedPage]);
    const [currentUser, setCurrentUser] = React.useState([])
    const [allTweets, setAllTweets] = React.useState([])
    const [replyMessage, setReplyMessage] = React.useState("")
    const [unit, setUnit] = useState("Public");
    const initialise = async () => {
        try {
            props.showLoader("Fetching Current User")
            let currentUser = await fetchLoggedInUserDetails();
            setCurrentUser(currentUser.data[0]);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }
    const updateProfileStatus = async () => {
        if (unit === "Public") {
            setUnit("Private");            
            await updateStatus(unit);
            console.log(unit);
        } else {
            setUnit("Public");
            await updateStatus(unit);
            console.log(unit);
        }
        // try {
        //     props.showLoader("Updating Profile Status")
        //     await updateStatus();
        //     await initialise();
        //     props.hideLoader();
        // } catch (e) {
        //     props.hideLoader();
        // }
    }
    const initialiseTweets = async () => {
        try {
            props.showLoader("Fetching My Tweets")
            let allTweets = await fetchMyTweets();
            setAllTweets(allTweets);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }
    const generateTweets = () => {
        return allTweets.map((tweet, index) => {
            let imgSrc = imgProfileEmpty;

            let userTweetId;
            let tweetId;
            const onReplyClick = () => {
                let tweets = [...allTweets];
                userTweetId = tweet.userId;
                tweetId = tweet._id;
                tweets[index].comments = !tweets[index].comments;
                setAllTweets(tweets);
                onReplyTweet();
            }
            // let replyMessage = "";
            // const onChangeText = (e) => {
            //     replyMessage = e.target.value
            // }

            const onReplyTweet = async () => {
                try {
                    props.showLoader("Posting Reply Tweet")
                    tweetId = tweet._id;
                    await postReplyTweet({
                        id: tweetId,
                        text: replyMessage,

                    });
                    setReplyMessage("")
                    let allTweets = await fetchMyTweets();
                    setAllTweets(allTweets);
                    props.hideLoader();
                } catch (e) {
                    props.hideLoader();
                }
            }
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
            let replies = [];
            if (tweet.comments) {
                replies = tweet.comments.text;
            }
            return (
                <div className="shadow" style={{ width: "70%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgSrc} className="rounded-circle" height={40} width={40} style={{ marginRight: 20 }} />
                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 16, margin: 0 }}>{tweet.userName} <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 12 }}>{diffDays} {units} ago</span></p>
                            <p style={{ borderWidth: 0, fontFamily: "OpenSans-Regular", fontSize: 16, textAlign: "justify" }}>{tweet.userTweets}</p>
                        </div>
                    </div>
                    <div style={{ width: "100%" }}>

                        {
                            tweet.comments.map((reply, rIndex) => {
                                let imgSrc = imgProfileEmpty;
                                const replydate1 = new Date();
                                const replydate2 = new Date(reply.postedOn);
                                const replydiffTime = Math.abs(replydate2 - replydate1);
                                let replydiffDays = Math.ceil(replydiffTime / (1000 * 60));
                                let units = "mins"
                                if (replydiffDays > 60) {
                                    replydiffDays = (replydiffDays / 60).toFixed();
                                    units = "hours"
                                    if (replydiffDays > 24) {
                                        replydiffDays = (replydiffDays / 24).toFixed();
                                        units = "days"
                                    }
                                }
                                console.log("currenctUser--->", currentUser)
                                return (
                                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 10, borderRadius: 10, borderWidth: 1, marginLeft: 30 }}>
                                        <img src={imgSrc} className="rounded-circle" height={30} width={30} style={{ marginRight: 20 }} />
                                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 12, margin: 0 }}>@{tweet.userName} <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 10, marginLeft: 5 }}>{diffDays} {units} ago</span></p>
                                            <p style={{ borderWidth: 0, marginLeft: 2 }}>{reply.text}</p>
                                        </div>

                                    </div>
                                )
                            })}
                        <div className="shadow" style={{ alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, margin: 30, marginTop: 0, }}>
                            <p style={{ marginLeft: 20, marginTop: 20, fontSize: 12, fontFamily: "OpenSans-Regular" }}>You are replying to <span style={{ color: "#1DA1F2", fontSize: 13 }}>@{tweet.userName}</span> </p>
                            <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", borderRadius: 10, borderWidth: 1, marginLeft: 30 }}>
                                <img src={imgProfileEmpty} className="rounded-circle" height={30} width={30} style={{ marginRight: 20 }} />
                                <textarea placeholder={"Tweet your reply"} multiple={4} style={{ width: "80%", height: 50, borderWidth: 0, resize: "none", padding: 10, fontSize: 16 }} maxLength={144} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
                                <button style={{ borderWidth: 0, marginTop: 10, backgroundColor: "#1DA1F2", color: "white", width: 100, padding: 5, borderRadius: 20, marginBottom: 20, marginRight: 60 }} onClick={onReplyTweet}>Tweet</button>
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
                <div className="shadow" style={{ width: "70%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "inline-flex", flexDirection: "column", borderRadius: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgProfileEmpty} className="rounded-circle" height={230} width={230} style={{ marginRight: 20 }} />
                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <div style={{ display: "inline-flex", justifyContent: "space-between", width: "100%" }}>
                                <span style={{ font: 'Segoe UI', display: "inline-flex", fontWeight: "bold", justifyContent: "space-between", width: "100%", fontSize: 45, textTransform: 'capitalize', marginTop: 30 }}>{currentUser.firstName} {currentUser.lastName}</span>
                                {/* <React.Fragment>
                                    <ToggleSwitch label="Status" style = {{ fontFamily: "Segoe UI"}} onClick = {updateProfileStatus}/>
                                </React.Fragment> */}
                                <button className="temp" style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: 100, height: 40  ,padding: 5, borderRadius: 20, marginBottom: 20, marginRight: 30 }} onClick={updateProfileStatus}>
                                    {unit}
                                </button>
                            </div>

                            <div style={{ flexDirection: "row", display: "inline-flex", alignItems: "center", marginTop: 3, marginLeft: 2 }}>
                                <p style={{ color: "GrayText", fontWeight: "bold", fontFamily: "OpenSans-Regular", marginRight: -8 }}>@{currentUser.loginId}</p>
                                <p className="appName d-none d-lg-block d-xl-block" style={{ fontSize: 16, color: "black", marginBottom: 14 }}>|</p>
                                <img src={imgEmail} height={20} width={20} style={{ marginBottom: 14, marginLeft: 9, marginRight: 7 }} />
                                <p style={{ marginRight: 10, marginBottom: 18 }}>{currentUser.email} </p>
                            </div>

                            <div style={{ flexDirection: "row", display: "inline-flex", alignItems: "center" }}>
                                <img src={followersLogo} height={20} width={20} style={{ marginRight: 5 }} />
                                <p style={{ marginRight: 10, marginBottom: 0, fontSize: 18 }}>{currentUser?.friends?.length} </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p style={{ font: 'Segoe UI', fontWeight: "bold", justifyContent: "space-between", width: "110%", fontSize: 20, marginLeft: -420, marginTop: 25 }}>My Tweets < img height={26} width={26} style={{ marginLeft: 10 }} src={imgBlueLogo} /></p>
                </div>
                <div>
                    {
                        generateTweets()
                    }
                </div>

            </div>
        </>
    )

}
