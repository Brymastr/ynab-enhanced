import React, { Component } from 'react';
import './App.css';
import AuthButton from '../components/AuthButton';
import Landing from '../components/Landing';
import Main from '../components/Main';
import { connect } from 'react-redux';
import { appLoaded } from '../actions/app';


const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({

});


class App extends Component {

  componentWillMount() {
    appLoaded();
  }

  render() {
    return (
      <div className="App">

        {Object.keys(this.props.user).length > 0 ?
          <Main></Main>
          :
          <Landing></Landing>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
