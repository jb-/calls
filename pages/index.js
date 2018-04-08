import {Component} from 'react';
import Map from '../components/Map';
import axios from 'axios';
import split from 'lodash/fp/split';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import max from 'lodash/fp/max';
import min from 'lodash/fp/min';
import mean from 'lodash/fp/mean';
import filter from 'lodash/fp/filter';
import drop from 'lodash/fp/drop';
import range from 'lodash/fp/range';
import isNumber from 'lodash/fp/isNumber';
import Geohash from 'latlon-geohash';

export default class Index extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      calls: [],
      center: {
        lng: 0,
        lat: 0
      },
      time: 0
    }
    this.options = range(0, 24);
  }

  _getData(path, time) {
    return axios.get(path)
      .then(res => {
        const {data} = res;
        return flow(
          this._reformat,
          this._center
        )(data, time);
      })
      .then(data => {
        this.setState(data);
      }) 
      .catch(err => console.error(err));
  }

  _reformat(data, time) { 
    return {
      calls : flow(
        split('\n'),
        drop(1),
        map(line=>{
          let splitted = line.split(',');
          return {
            time: +splitted[0],
            lng: +splitted[1],
            lat: +splitted[2],
            success: splitted[3]
          };
        }),
        filter(obj => {
          return obj.time < (time+1) * 10000 && isNumber(obj.lng) && obj.success;
        }),
        map(obj => {
          return {
            ...obj,
            geohash : Geohash.encode(obj.lat, obj.lng, 6)
          };
        })
      )(data),
      time : time
    };
  }

  _center(data) {
    const {calls, time} = data;
    const lngs =
      map(call => call['lng'])(calls);
    const lats =
      map(call => call['lat'])(calls);
    const meanLng = mean([min(lngs), max(lngs)]);
    const meanLat = mean([min(lats), max(lats)]);
    return {
      ...data,
      center: {
        lng: meanLng,
        lat: meanLat
      },
      time : +time
    }
  }

  componentWillMount() {
    this._getData('../static/calls', 0);
  }
  componentDidMount() {
  }

  _onChanged(event) {
    this._getData('../static/calls', event.target.value);
  }

  render() {

    return (
      <div>
        <select style={{height: '30px', width: '600px', margin:'20px'}}
          value={this.state.time} onChange={this._onChanged.bind(this)} >
          {map(option => (<option key={option} value={option}>{option}</option>))(this.options)}
        </select>
        <Map 
          googleMapURL
          ="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyD5x1txyDwyKoh9i3oD8b_MmzXgbxmYrjA"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `800px` }} />}
          mapElement={<div style={{ height: `100%` }}/>} 
          center={this.state.center}
          calls={this.state.calls}
        />
      </div>
    );
  }
};