import {Component} from 'react';
import D3 from '../components/D';

export default class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      radius: 400
    }
  }

  handleClick() {
    this.setState({
      radius: Math.random() * 400
    });
  }

  render() {
    return (
      <div onClick={this.handleClick.bind(this)}>
        <D3 width="800" radius={this.state.radius} text="label"/>
      </div>
    );
  }
}

