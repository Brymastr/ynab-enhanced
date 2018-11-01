import React, { Component } from 'react';
import './App.css';
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

        {this.props.user.id !== undefined ?
          <Main></Main>
          :
          <Landing></Landing>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
