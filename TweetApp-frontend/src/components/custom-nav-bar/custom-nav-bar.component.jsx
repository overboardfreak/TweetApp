import React from 'react';
import './custom-nav-bar.styles.css';
import imgTweetLogo from '../../assets/images/logo-white.png';
import imgUser from '../../assets/images/user.png'
import imgProfileEmpty from '../../assets/images/defaultUser.png';
import home from "../../assets/images/home.png";
import users from "../../assets/images/users.png";
import bell from "../../assets/images/bell.png"
import { pages } from '../../constants/strings';
import 'bootstrap/dist/js/bootstrap.bundle'
import { fetchLoggedInUserDetails, logOutCurrentUser } from './custom-nav-bar.helper';

export default function CustomNavBar(props) {

  const onLogout = async () => {
    try {
      await logOutCurrentUser();
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  React.useEffect(() => {
    const initialise = async () => {
      try {
        props.showLoader('Initialising Data');
        let userDetails = await fetchLoggedInUserDetails();
        props.updateUserData(userDetails);
        props.hideLoader();
      } catch (err) {
        console.log(err);
        props.hideLoader();
      }
    };
    initialise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onNavItemClick = target => {
    props.updateSelectedPage(target);
  };

  return (
    <div className="fixed-top" >
      <nav className="navbar navbar-expand-lg navbar-light  navbar_bg" style={{ paddingRight: 15 }}>
        <img src={imgTweetLogo} alt="gerdau-logo" height={30} width={30} style={{ alignContent: 'center', marginLeft: 10 }} onClick={() => onNavItemClick(pages.HOME)} />
        <p className="appName d-none d-lg-block d-xl-block" style={{ fontSize: 16, marginRight: 20 }}>|</p>

        <button className="navbar-toggler toggler_icon remove_button_styling" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon "></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item ">
              < img src={home} alt="gerdau-logo" height={30} width={30} style={{ color: "white", backgroundColor: "#3295d1" == pages.HOME && "#3295d1", marginRight: 50, marginLeft: 400 }} href="#" onClick={() => onNavItemClick(pages.HOME)} />
            </li>
            <li class="nav-item">
              <img src={imgUser} alt="gerdau-logo" height={30} width={30} style={{ color: "white", backgroundColor: "#3295d1" == pages.MY_TWEETS && "#3295d1", marginRight: 50 }} href="#" onClick={() => onNavItemClick(pages.USER)} />
            </li>
            <li class="nav-item">
              <img src={users} alt="gerdau-logo" height={30} width={30} style={{ color: "white", backgroundColor: "#3295d1" == pages.ALL_USERS && "#3295d1", marginRight: 50 }} href="#" onClick={() => onNavItemClick(pages.ALL_USERS)} />
            </li>
            <li class="nav-item">
              <img src={bell} alt="gerdau-logo" height={30} width={30} style={{ color: "white", backgroundColor: "#3295d1" == pages.NOTIFICATION && "#3295d1", marginRight: 50 }} href="#" onClick={() => onNavItemClick(pages.NOTIFICATION)} />
            </li>
          </ul>
          <p style={{ left: "auto", marginRight: 20, color: "white", marginBottom: -3 }}>Hi, {props.global.userData.firstName}</p>
          <button className="nav-link remove_button_styling" style={{ padding: 0, display: "inline-block", }} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img className="rounded-circle" alt="profile-pic" src={props.global.imageURL || imgProfileEmpty} height={40} width={40} />
          </button>
          <div className="w-md-100">
            <div className="dropdown-menu profile-menu-width" style={{ left: "auto", right: 20, backgroundColor: "#3295d1" }} id="dd" aria-labelledby="navbarDropdown">
              <p className="dd_sub_heading" href="#" style={{ color: "white" }} onClick={() => onNavItemClick(pages.USER)}>@{props.global.userData.loginId}</p>
              <div className="dropdown-divider" ></div>
              {/* <button style={{ color: "#ffffff"}} className="dropdown-item dd_page pt-1 pb-1" onClick={onLogout}>Log Out</button> */}
              <button style={{ borderWidth: 0, backgroundColor: "#3295d1", color: "white", padding: 5, width: 100 }} onClick={onLogout}>Log out</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
