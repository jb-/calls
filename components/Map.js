import {OverlayView, withScriptjs, withGoogleMap, GoogleMap, Marker, Rectangle }
  from "react-google-maps";
import Geohash from 'latlon-geohash';
import React, {Component} from 'react';
import map from 'lodash/fp/map';
import flow from 'lodash/fp/flow';
import mapValues from 'lodash/fp/mapValues';
import keyBy from 'lodash/fp/keyBy';
import keys from 'lodash/fp/keys';
import reduce from 'lodash/fp/reduce';
import filter from 'lodash/fp/filter';
import maxBy from 'lodash/fp/maxBy';
import minBy from 'lodash/fp/minBy';
import _ from 'lodash';

const mapStyle = require('../static/mapStyle.json');


class Map extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  _probability(geohash) {
    return reduce((sum, call) => {
      return call.success === "t" ? sum + 1 : sum;
    }, 0)(geohash) / geohash.length;
  }
  _renderTiles(calls) {    
    const hashes = flow(
      map(call => {
        return {
          success: call.success,
          geohash: call.geohash,
          time: call.time
        }
      }),
      reduce((result, value) => {
        (result[value.geohash] || (result[value.geohash] = []))
          .push({time: value.time, success: value.success, geohash: value.geohash});
        return result;
      }, {}),
      map((value) => {
        return {
          geohash: value[0]['geohash'],
          probability: this._probability(value), 
          trial: value.length
        }
      }),
      filter(values => values.trial > 1)
    )(calls);
    const {trial : maxTrial} = maxBy(hash => hash.trial)(hashes);

    return (
      <div>
        {map(hash => {
          let preBounds = Geohash.bounds(hash.geohash);
          let postBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(preBounds.sw.lat, preBounds.sw.lon),
            new google.maps.LatLng(preBounds.ne.lat, preBounds.ne.lon)
            
          );
          let prob = hash.probability;
          // console.log(postBounds);
          return (
            <Rectangle className="tiles"
              bounds={postBounds}
              key={hash.geohash}
              options={{style : {
                // strokeColor: '#3333AA',
                strokeOpacity: 0,
                strokeWeight: 0,
                fillColor: 'rgb( 255, 0, 0 )',
                fillOpacity: Math.log(hash.trial)/Math.log(maxTrial)
              }}}/> 
          );
        }
        )(hashes)}
      </div>
    );
  }

  render() {
    return (
      <GoogleMap
        defaultZoom={9}
        defaultCenter={{ lat: 0, lng: 0 }}
        center={this.props.center}
        defaultOptions={{styles: mapStyle}}
      >
        <OverlayView 
          mapPaneName={OverlayView.OVERLAY_LAYER}
          ref="overlay"
          position={this.props.center}>
          {this._renderTiles(this.props.calls)}
        </OverlayView>
      </GoogleMap>
    );
  }
}


export default withScriptjs(withGoogleMap(Map));
