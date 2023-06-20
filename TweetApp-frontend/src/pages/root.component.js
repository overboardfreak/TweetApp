import React from 'react';
import Home from './home';
import { pages } from '../constants/strings';
import AllUsers from './all-users';
import UserProfile from './user';
import Notification from './notification';

export default function Root(props) {
  let component = null;
  switch (props.selectedPage) {
    case pages.HOME: {
      component = <Home />;
      break;
    }
    case pages.ALL_USERS: {
      component = <AllUsers />;
      break;
    }
    case pages.USER: {
      component = <UserProfile />;
      break;
    }
    case pages.NOTIFICATION: {
      component = <Notification />;
      break;
    }
    default:
      component = <Home />;
  }
  return (
    <div
      className={'w-100'}
      style={{ transition: '0.5s',marginTop: 60  }}>
      <div className={'container-fluid p-0 mx-0 h-100 w-100'}>
        <div className={'row h-100 mx-0'}>
          <div className={'col-12 h-100 p-0'}>
            {component}
          </div>
        </div>
      </div>
    </div>
  );
}
