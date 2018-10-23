import React from 'react';
import { connect } from 'react-redux';
import { startOAuthFlow } from '../actions/auth';


const mapStateToProps = () => ({

});

const mapDispatchToProps = dispatch => ({
  startOAuth() {
    return () => {
      dispatch(startOAuthFlow());
    };
  },
});


const AuthButton = ({ startOAuth }) => (
  <div>
    <button onClick={startOAuth()}>
      YNAB Login
    </button>
  </div>
);


export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);
