import React from 'react';
import { connect } from 'react-redux';
import { startOAuthFlow, authStarted } from '../actions/auth';


const mapStateToProps = () => ({

});

const mapDispatchToProps = dispatch => ({
  startOAuth: () => {
    return () => {
      dispatch(authStarted());
      dispatch(startOAuthFlow());
    };
  },
});


const AuthButton = ({ startOAuth }) => (
  <div className="ynab-auth-button" onClick={startOAuth()}>
    LOG IN
  </div>
);


export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);
