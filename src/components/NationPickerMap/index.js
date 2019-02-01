///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
//import Control from 'react-leaflet-control';
//import { Map, GeoJSON, LayersControl, TileLayer } from 'react-leaflet';
//import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
//import LegendControl from '../LegendControl';

// Styles
import '../../styles/NationPickerMap.css';

import NationPickerLegend from '../../components/NationPickerLegend';

const mapContainer = 'map-container';
//const maxBounds = [
//    [24.9493, -125.0011],
//    [49.5904, -66.9326]
//];
const maxBounds = [
    [24.95, -166.0],
    [71.30, -66.94]
];
//const mapCenter = [37.0, -95.7];
const mapCenter = [51.0, -114.0];
const zoomLevel = 3;
const minZoomLevel = 3;
const maxZoomLevel = 16;
var app;

@inject('store') @observer
class NationPickerMap extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        return (
            <div className="NationPickerMap">
                    <Map
                        center={mapCenter}
                        bounds={maxBounds}
                        zoom={zoomLevel}
                        minZoom={minZoomLevel}
                        maxZoom={maxZoomLevel}
                        attributionControl={true}
                        className={mapContainer}
                        style={{
                            height:this.state.height-160,
                            width:this.state.width-80,
                        }}
                    >
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            data={app.getNationGeojson}
                            style={app.nationFeatureStyle}
                            onEachFeature={app.nationOnEachFeature}
                        />
                        <NationPickerLegend/>
                    </Map>
            </div>
        );
    }
}

export default NationPickerMap;
