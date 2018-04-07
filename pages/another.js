import {Component} from 'react';
import MyMap from '../components/MyMap';

export default class Another extends Component  {
  render() {
    return (
      <div>
         <MyMap isMarkerShown={false}
          googleMapURL=
             "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          />
      </div>
    )
  }
};

