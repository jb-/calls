import {Component} from 'react';
import axios from 'axios';

export default class Data extends Component {
  componentDidMount() {
    const res = axios.get('../static/calls')
      .then(res => {
        const {data} = res;
        console.log(data);
      });
  }
  render() {
    return <div className="data"></div>;
  }
}

