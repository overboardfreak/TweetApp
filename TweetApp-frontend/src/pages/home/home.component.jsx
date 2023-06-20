import React, { useRef } from 'react';
import "./home.styles.css";
import imgProfileEmpty from '../../assets/images/defaultUser.png';
import { fetchAllTweets, postTweet, postReplyTweet, likeTweet } from './home.helper';


export default function Home(props) {
    React.useEffect(() => {
        initialise();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.global.selectedPage]);
    const [tweetMessage, setTweetMessage] = React.useState("")
    const [replyMessage, setReplyMessage] = React.useState("")
    const [allTweets, setAllTweets] = React.useState([])


    const initialise = async () => {
        try {
            props.showLoader("Fetching All Tweets")
            let allTweets = await fetchAllTweets();
            console.log("alltweets", allTweets)
            setAllTweets(allTweets);
            props.hideLoader();
        } catch (e) {
            props.hideLoader();
        }
    }

    const onTweetClick = async () => {
        try {
            props.showLoader("Posting Tweet")
            await postTweet(props.global.userData.loginId, tweetMessage);
            setTweetMessage("")
            let allTweets = await fetchAllTweets();
            // console.log("ontweetclick fetchAllTweets", allTweets)
            setAllTweets(allTweets);
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
            let userTweetId;
            let tweetId;
            const onReplyClick = async () => {
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
                    let allTweets = await fetchAllTweets();
                    setAllTweets(allTweets);
                    props.hideLoader();
                } catch (e) {
                    props.hideLoader();
                }
            }
            return (
                <div key={index} className="shadow" style={{ width: "60%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "flex", flexDirection: "column", borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgSrc} className="rounded-circle" height={40} width={40} style={{ marginRight: 20 }} />
                        <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 16, margin: 0 }}>@{tweet.userName} <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 12 }}>{diffDays} {units} ago</span></p>
                            <p style={{ borderWidth: 0, fontFamily: "OpenSans-Regular", fontSize: 16, textAlign: "justify", marginTop: 6, marginLeft: 2 }}>{tweet.userTweets}</p>
                        </div>

                    </div>
                    <div style={{ width: "100%" }}>

                        <div>
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
                                    return (
                                        <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 10, borderRadius: 10, borderWidth: 1, marginLeft: 30 }}>
                                            <img src={imgSrc} className="rounded-circle" height={30} width={30} style={{ marginRight: 20 }} />
                                            <div style={{ width: "100%", justifyContent: "flex-start", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                <p style={{ fontFamily: "Barlow-SemiBold", fontSize: 12, margin: 0 }}>@{reply.userName} <span style={{ color: "GrayText", fontFamily: "OpenSans-Regular", fontSize: 10, marginLeft: 5 }}>{diffDays} {units} ago</span></p>
                                                <p style={{ borderWidth: 0, marginLeft: 2 }}>{reply.text}</p>
                                            </div>

                                        </div>
                                    )
                                }
                                )}

                        </div>
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
                <div className="shadow" style={{ width: "60%", marginLeft: "auto", marginRight: "auto", alignItems: "flex-start", display: "inline-flex", flexDirection: "column", borderRadius: 10 }}>
                    <div style={{ alignItems: "flex-start", display: "inline-flex", width: "100%", padding: 20, borderRadius: 10, borderWidth: 1 }}>
                        <img src={imgProfileEmpty} className="rounded-circle" height={60} width={60} style={{ marginRight: 20 }} />
                        <textarea placeholder={"What's happening ?"} multiple={4} style={{ width: "80%", height: 50, borderWidth: 0, resize: "none", padding: 10 }} maxLength={144} value={tweetMessage} onChange={(e) => setTweetMessage(e.target.value)} />
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "flex-end", justifyContent: "flex-end", width: "100%" }}>
                        <button style={{ borderWidth: 0, backgroundColor: "#1DA1F2", color: "white", width: 100, padding: 10, borderRadius: 20, marginBottom: 20, marginRight: 30 }} onClick={onTweetClick}>Tweet</button>
                    </div>
                </div>
                <div>
                    {
                        generateTweets()
                    }
                </div>

            </div>
            <div id="footer" class="bg-light text-center text-lg-start">
                <div class="text-center p-3">
                    © 2022 Twitter, Inc.
                </div>                
            </div>
        </>
    )

}
