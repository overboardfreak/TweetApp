import { connect } from 'react-redux';

import UserProfile from './user.component';
import { showLoader, hideLoader, updateSelectedPage } from '../../redux/actions/global.actions';

const mapStateToProps = (state, ownProps) => ({
    global: state.globalReducer,
});

const mapDispatchToProps = dispatch => ({
    showLoader: (value) => dispatch(showLoader(value)),
    updateSelectedPage: (value) => dispatch(updateSelectedPage(value)),
    hideLoader: () => dispatch(hideLoader()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);