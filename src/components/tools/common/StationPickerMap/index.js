///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import axios from 'axios';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Map, GeoJSON, CircleMarker, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';

// start: added code to work with markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// end: code to work with markers

const styles = theme => ({
  wrapper: {
    //margin: theme.spacing(1),
    position: 'relative',
  },
  mapProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1000,
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
});

const protocol = window.location.protocol;
const mapContainer = 'map-container';
const zoomLevel = 6;
const minZoomLevel = 4;
const maxZoomLevel = 16;
var app;
var history;

@inject('store') @observer
class StationPickerMap extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            stations: null,
            station: app.getDefaultStationFromNation.name
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleStationClick = this.handleStationClick.bind(this);
        // CONUS
        this.maxBounds = [
            [24.9493, -125.0011],
            [49.5904, -66.9326]
        ];
        this.mapCenter = [38.0, -95.7];
        this.zoomLevel = 6;
        this.minZoomLevel = 3;
        this.maxZoomLevel = 16;
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.map = this.mapInstance.leafletElement
      this.getStations()
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleStationClick = (s) => {
        this.setState({ station: s.name })
        app.climview_loadData(1,0,s.uid);
    }

    getBoundingBox = () => {
        let sLat = parseFloat(app.getNation.ll[0]) - 2.
        let nLat = parseFloat(app.getNation.ll[0]) + 2.
        let wLon = parseFloat(app.getNation.ll[1]) - 2.
        let eLon = parseFloat(app.getNation.ll[1]) + 2.
        return [wLon.toString(),sLat.toString(),eLon.toString(),nLat.toString()].join(',')
    }

    getStations = () => {
        // first, get list of current stations
        let params = {
            "meta":"name,ll,uid",
            "elems":"maxt,mint,pcpn",
            "output":"json",
            "sdate":"1940-01-01",
            "edate":"1949-12-31",
            //"bbox":"-104,40,-100,45"
            "bbox":this.getBoundingBox()
        }
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnMeta`, params)
          .then(res => {
            console.log('SUCCESS downloading STATIONS IN BBOX from ACIS');
            console.log(res);
            let uidList = res.data.meta.map((s,i) => (s.uid.toString()))
            // get long-term stations
            this.getStationsLongTerm(uidList.join(","));
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    getStationsLongTerm = (sList) => {
        // string with list of stations
        // e.g. "1234,5432,11256"
        let params = {
            "meta":"name,ll,uid",
            "elems":"maxt,mint,pcpn",
            "output":"json",
            "sdate":"2019-04-01",
            "edate":"2019-06-01",
            "uids":sList
        }
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnMeta`, params)
          .then(res => {
            console.log('SUCCESS downloading LONG-TERM STATIONS from ACIS');
            console.log(res);
            this.setState({stations:res.data.meta})
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    render() {

        const { classes } = this.props;

        let centerLat = (app.getNation) ? app.getNation.ll[0] : 0.0
        let centerLon = (app.getNation) ? app.getNation.ll[1] : 0.0

        return (
              <div className={classes.wrapper}>
                    <Map
                        ref={e => { this.mapInstance = e }}
                        center={[centerLat,centerLon]}
                        zoomControl={false}
                        zoom={this.zoomLevel}
                        minZoom={this.minZoomLevel}
                        maxZoom={this.maxZoomLevel}
                        attributionControl={false}
                        className={mapContainer}
                        style={{
                            height: '200px',
                            width: '200px',
                        }}
                    >
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON
                            data={app.getNationGeojson}
                            style={app.nationFeatureStyle_selected}
                        />
                        {this.state.stations &&
                          this.state.stations.map((s,i) => (
                            <CircleMarker
                              key={i+"marker"}
                              center={[s.ll[1],s.ll[0]]}
                              radius={3}
                              color={(s.name===this.state.station) ? "red" : "black"}
                              onClick={() => {this.handleStationClick(s)}}
                            >
                            </CircleMarker>
                          ))
                        }
                        <ZoomControl position="topleft" />
                    </Map>
                    {!this.state.stations && <CircularProgress size={64} className={classes.mapProgress} />}
              </div>
        );

    }
}

export default withRouter(withStyles(styles)(StationPickerMap));
