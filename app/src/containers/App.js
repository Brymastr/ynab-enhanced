import React, { Component } from 'react';
import './App.css';
import AuthButton from '../components/AuthButton';

class App extends Component {

  state = {};

  async getData() {
    const response = await fetch('http://localhost:4000/');
    return await response.text();
  }

  async componentWillMount() {
    const data = await this.getData();

    this.setState({
      data
    });
  }

  render() {
    return (
      <div>
        {this.state.data}
        <AuthButton></AuthButton>
      </div>
    );
  }
}

export default App;
