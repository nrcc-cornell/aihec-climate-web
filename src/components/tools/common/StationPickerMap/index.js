///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import axios from 'axios';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Map, GeoJSON, CircleMarker, TileLayer, ZoomControl } from 'react-leaflet';

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
var app;

@inject('store') @observer
class StationPickerMap extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
            stations_temp_past: null,
            stations_temp_present: null,
            stations_precip_past: null,
            stations_precip_present: null,
        };
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
        //this.stations = {'temp': {'past':null, 'present':null}, 'precip': {'past':null, 'present':null}}
        this.getStations('temp')
        this.getStations('precip')
    }

    componentDidMount() {
      this.map = this.mapInstance.leafletElement
    }

    //componentWillUnmount() {
    //   this._isMounted = false;
    //}

    handleStationClick = (s) => {
        this.props.onchange_station(s);
    }

    getBoundingBox = () => {
        let sLat = parseFloat(this.props.selected_nation.ll[0]) - 2.
        let nLat = parseFloat(this.props.selected_nation.ll[0]) + 2.
        let wLon = parseFloat(this.props.selected_nation.ll[1]) - 2.
        let eLon = parseFloat(this.props.selected_nation.ll[1]) + 2.
        return [wLon.toString(),sLat.toString(),eLon.toString(),nLat.toString()].join(',')
    }

    getStations = (v) => {
        // v: variable name ('temp' or 'precip')
        // first, get list of current stations
        let params = {
            "meta":"name,ll,uid",
            "elems":(v==='temp') ? 'avgt' : 'pcpn',
            "output":"json",
            "sdate":this.props.period[0],
            "edate":this.props.period[1],
            "bbox":this.props.bounds
        }
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnMeta`, params)
          .then(res => {
            console.log('SUCCESS downloading STATIONS IN BBOX from ACIS');
            console.log(res);
            let uidList = res.data.meta.map((s,i) => (s.uid.toString()))
            if (v==='temp') {
              this.setState({ stations_temp_present: res.data.meta });
            } else {
              this.setState({ stations_precip_present: res.data.meta });
            }
            // get long-term stations
            this.getStationsLongTerm(v,uidList.join(","))
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    getStationsLongTerm = (v,sList) => {
        // v: variable name ('temp' or 'precip')
        // sList: string with list of stations
        //        e.g. "1234,5432,11256"
        let params = {
            "meta":"name,ll,uid",
            "elems":(v==='temp') ? 'avgt' : 'pcpn',
            "output":"json",
            "sdate":"1850-01-01",
            "edate":"1960-01-01",
            "uids":sList
        }
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnMeta`, params)
          .then(res => {
            console.log('SUCCESS downloading LONG-TERM STATIONS from ACIS');
            console.log(res);
            if (v==='temp') {
              this.setState({ stations_temp_past: res.data.meta });
            } else {
              this.setState({ stations_precip_past: res.data.meta });
            }
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    render() {

        const { classes } = this.props;

        let centerLat = (this.props.selected_nation) ? this.props.selected_nation.ll[0] : 0.0
        let centerLon = (this.props.selected_nation) ? this.props.selected_nation.ll[1] : 0.0

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
                        {['avgt','maxt','mint','temp'].includes(this.props.selected_variable) && this.props.selected_view==='present' && this.state.stations_temp_present &&
                          this.state.stations_temp_present.map((s,i) => (
                            <CircleMarker
                              key={i+"marker"}
                              center={[s.ll[1],s.ll[0]]}
                              radius={3}
                              color={(s.name===this.props.selected_station.name) ? "red" : "black"}
                              onClick={() => {this.handleStationClick(s)}}
                            >
                            </CircleMarker>
                          ))
                        }
                        {['avgt','maxt','mint','temp'].includes(this.props.selected_variable) && this.props.selected_view==='past' && this.state.stations_temp_past &&
                          this.state.stations_temp_past.map((s,i) => (
                            <CircleMarker
                              key={i+"marker"}
                              center={[s.ll[1],s.ll[0]]}
                              radius={3}
                              color={(s.name===this.props.selected_station.name) ? "red" : "black"}
                              onClick={() => {this.handleStationClick(s)}}
                            >
                            </CircleMarker>
                          ))
                        }
                        {['pcpn','precip'].includes(this.props.selected_variable) && this.props.selected_view==='present' && this.state.stations_precip_present &&
                          this.state.stations_precip_present.map((s,i) => (
                            <CircleMarker
                              key={i+"marker"}
                              center={[s.ll[1],s.ll[0]]}
                              radius={3}
                              color={(s.name===this.props.selected_station.name) ? "red" : "black"}
                              onClick={() => {this.handleStationClick(s)}}
                            >
                            </CircleMarker>
                          ))
                        }
                        {['pcpn','precip'].includes(this.props.selected_variable) && this.props.selected_view==='past' && this.state.stations_precip_past &&
                          this.state.stations_precip_past.map((s,i) => (
                            <CircleMarker
                              key={i+"marker"}
                              center={[s.ll[1],s.ll[0]]}
                              radius={3}
                              color={(s.name===this.props.selected_station.name) ? "red" : "black"}
                              onClick={() => {this.handleStationClick(s)}}
                            >
                            </CircleMarker>
                          ))
                        }
                        <ZoomControl position="topleft" />
                    </Map>
                    {['avgt','maxt','mint','temp'].includes(this.props.selected_variable) && this.props.selected_view==='past' && !this.state.stations_temp_past &&
                      <CircularProgress size={64} className={classes.mapProgress} />
                    }
                    {['avgt','maxt','mint','temp'].includes(this.props.selected_variable) && this.props.selected_view==='present' && !this.state.stations_temp_present &&
                      <CircularProgress size={64} className={classes.mapProgress} />
                    }
                    {['pcpn','precip'].includes(this.props.selected_variable) && this.props.selected_view==='present' && !this.state.stations_precip_present &&
                      <CircularProgress size={64} className={classes.mapProgress} />
                    }
                    {['pcpn','precip'].includes(this.props.selected_variable) && this.props.selected_view==='past' && !this.state.stations_precip_past &&
                      <CircularProgress size={64} className={classes.mapProgress} />
                    }
              </div>
        );

    }
}

StationPickerMap.propTypes = {
  type: PropTypes.string.isRequired,
  period: PropTypes.array.isRequired,
  bounds: PropTypes.string.isRequired,
  selected_nation: PropTypes.object.isRequired,
  selected_variable: PropTypes.string.isRequired,
  selected_view: PropTypes.string.isRequired,
  selected_station: PropTypes.object.isRequired,
  onchange_station: PropTypes.func.isRequired,
}

export default withRouter(withStyles(styles)(StationPickerMap));
