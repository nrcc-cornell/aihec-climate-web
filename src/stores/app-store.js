///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import { observable, computed, action } from 'mobx';
import axios from 'axios';
import moment from 'moment';

import us_aiannh_pilot from '../assets/us_aiannh_pilot.json';

const protocol = window.location.protocol;

const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

export class AppStore {
    ///////////////////////////////////////////////////////
    /// Pages on the site
    /// which page is active?
    /// possibilities are 'home','about','tool'
    ///////////////////////////////////////////////////////
    @observable activePage = 'home';
    @action setActivePage = (i) => {
        if (i===0) {
            this.activePage = 'home'
        } else if (i===1) {
            this.activePage = 'about'
        } else {
            this.activePage = 'tools'
            //if (this.getToolName==='climview') { this.wxgraph_downloadData() }
        }
    };
    @computed get getActivePage() { return this.activePage };
    @computed get getActiveTabIndex() {
        let tabIndex = null;
        if (this.getActivePage==='home') {
            tabIndex = 0;
        } else if (this.getActivePage==='about') {
            tabIndex = 1;
        } else if (this.getActivePage==='tools') {
            tabIndex = 2;
        } else {
        }
        return tabIndex
    };
    @computed get homeIsSelected() { return this.getActivePage==='home' };
    @computed get aboutIsSelected() { return this.getActivePage==='about' };
    @computed get toolIsSelected() { return this.getActivePage==='tools' };

    toolNameArray = ['climview','tool2','tool3']
    @observable toolName = this.toolNameArray[0]
    // set toolName from tool card
    @action setToolName = (n) => {
            this.toolName = n
        };
    // set toolName from select menu
    @action setSelectedToolName = (e) => {
            if (this.getToolName !== e.target.value) {
                this.toolName = e.target.value;
                //if (this.getToolName==='climview') { this.wxgraph_downloadData() }
            }
        };
    @computed get getToolName() { return this.toolName };

    getToolInfo = (name) => {
            let title, tagline, thumbnail, url, onclick
            //let pathToImages = './thumbnails/'
            if (name==='climview') {
                title = 'Climate Viewer'
                tagline = 'Data observed near your nation over the past century.'
                url = '/tools/climate-viewer'
            } else if (name==='tool2') {
                title = 'Tool 2'
                tagline = 'Recent observations at weather stations on/near your nation.'
                url = '/tools/tool2'
            } else if (name==='tool3') {
                title = 'Tool 3'
                tagline = 'Climate model projections for your nation through the year 2100.'
                url = '/tools/tool3'
            } else {
            }
            onclick = () => {this.setActivePage(2); this.setToolName(name)}
            return {'name':name, 'title':title, 'tagline':tagline, 'thumbnail':thumbnail, 'url':url, 'onclick':onclick}
        };

    //@computed get getNationGeojson() { console.log(us_aiannh_pilot); return us_aiannh_pilot };
    @computed get getNationGeojson() { return us_aiannh_pilot };

    /// manage currently active nation
    // get currently selected nation object (for nation select and nation picker)
    @observable nation = {"name":"Pine Ridge Reservation","ll":["43.3449996","-102.0818655"],"llbounds":[[-103.001027,42.987359],[-101.227336,43.796737]]}
    @action setNation = (l) => {
        if (this.getNation.name !== l.toString()) {
            this.nation = this.getNations.find(obj => obj.name === l);
            localStorage.setItem("TRIBAL-CLIMATE-TOOLS.nation",l)
        };
    }
    // set nation from select menu
    @action setSelectedNation = (t) => {
            if (this.getNation.name !== t.value) {
                this.nation = this.getNations.find(obj => obj.name.toString() === t.value);
                localStorage.setItem("TRIBAL-CLIMATE-TOOLS.nation",t.value)
            }
            if (this.getShowModalMap) { this.setShowModalMap(false) };
        };
    @computed get getNation() { return this.nation };

    // manage list of all nations
    @computed get getNations() {
        let nationsObject = this.getNationGeojson
        let nations = nationsObject['features'].map( function(item) {
          let i;
          let coords,thisLatArray,thisLonArray,wLon,eLon,nLat,sLat,extCoords;
          let allLon=[];
          let allLat=[];
          coords = item.geometry.coordinates
          for (i=0; i<coords.length; i++) {
            thisLonArray = coords[i].map(function(c) { return c[0]; })
            thisLatArray = coords[i].map(function(c) { return c[1]; })
            allLon.push( ...thisLonArray )
            allLat.push( ...thisLatArray )
          };
          wLon = Math.min.apply(null, allLon);
          eLon = Math.max.apply(null, allLon);
          nLat = Math.max.apply(null, allLat);
          sLat = Math.min.apply(null, allLat);
          // extCoords hold the extreme [[SW],[NE]] coordinates that define a bounding box containing nation
          extCoords = [[wLon,sLat],[eLon,nLat]]
          return {'name':item.properties.NAMELSAD,'ll':[item.properties.INTPTLAT,item.properties.INTPTLON],'llbounds':extCoords};
        });
        return nations
    };

    @computed get getDefaultStationFromNation() {
        let stns = {
            "Flathead Reservation": {"uid":"12082","name":"POLSON KERR DAM","network":"other"},
            "L'Anse Reservation": {"uid":"29678","name":"HANCOCK HOUGHTON COUNTY AP","network":"other"},
            "Pine Ridge Reservation": {"uid":"16756","name":"COTTONWOOD 2 E","network":"other"},
            "Tohono O'odham Nation Reservation": {"uid":"1274","name":"KITT PEAK","network":"other"},
            "Navajo Nation Reservation": {"uid":"171","name":"CANYON DE CHELLY","network":"other"},
            "Fort Belknap Reservation": {"uid":"12221","name":"CHINOOK","network":"other"},
            "Leech Lake Reservation": {"uid":"10561","name":"LEECH LAKE","network":"other"},
            "Crow Reservation": {"uid":"11733","name":"BUSBY","network":"other"},
            "Spirit Lake Reservation": {"uid":"13595","name":"MC HENRY 3W","network":"other"},
            "Menominee Reservation": {"uid":"19892","name":"SHAWANO 2SSW","network":"other"},
            "Fond du Lac Reservation": {"uid":"10517","name":"CLOQUET","network":"other"},
            "Lummi Reservation": {"uid":"26258","name":"CLEARBROOK","network":"other"},
            "Standing Rock Reservation": {"uid":"16965","name":"POLLOCK","network":"other"},
            "Turtle Mountain Reservation": {"uid":"13691","name":"WILLOW CITY","network":"other"},
            "Blackfeet Indian Reservation": {"uid":"12237","name":"CUT BANK AIRPORT","network":"other"},
            "Winnebago Reservation": {"uid":"6939","name":"SIOUX CITY AP","network":"other"},
            "Barrow ANVSA": {"uid":"21127","name":"BARROW WSO AP","network":"other"},
            "Creek OTSA": {"uid":"14134","name":"TULSA INTL AIRPORT","network":"other"},
        }
        return stns[this.getNation.name]
    };

    nationFeatureStyle = (feature) => {
            return {
                weight: 2,
                opacity: 0.2,
                color: 'black',
                dashArray: '1',
                fillColor: 'brown',
                fillOpacity: 0.5,
            };
        }

    nationFeatureStyle_selected = (feature) => {
        if (feature.properties.NAMELSAD===this.getNation.name) {
            return {
                weight: 2,
                opacity: 0.2,
                color: 'black',
                dashArray: '1',
                fillColor: 'brown',
                fillOpacity: 0.5,
            };
        } else {
            return {
                weight: 2,
                opacity: 0.0,
                color: 'black',
                dashArray: '1',
                fillColor: 'brown',
                fillOpacity: 0.0,
            };
        }
    }

    ///////////////////////////////////////////////////////
    /// Tool: Climate Viewer
    ///////////////////////////////////////////////////////
    @computed get wxgraph_getVarUnits() {
        let varUnits = {}
        varUnits = {
            avgt : '°F',
            maxt : '°F',
            mint : '°F',
            pcpn : 'inches',
            snow : 'inches',
        };
        return varUnits
    }

    @computed get wxgraph_getVarLabels() {
        return {
          avgt : 'Ave Air Temperature',
          maxt : 'Max Air Temperature',
          mint : 'Min Air Temperature',
          pcpn : 'Total Precipitation',
          snow : 'Total Snowfall',
        };
    }

    getVarMinor = (vType,network) => {
        let vN = 0
        if (vType==='temp' && network==='scan') { vN=23 }
        if (vType==='pcpn' && network==='scan') { vN=22 }
        if (vType==='temp' && network==='tscan') { vN=24 }
        if (vType==='pcpn' && network==='tscan') { vN=23 }
        return vN
    }

    //////////////////////////////////
    // PAST DATA
    //////////////////////////////////

    // store downloaded past data
    @observable past_data = null;


    @action updatePastData = (d) => {
            let newData = {}
            newData = {}
            newData['stn'] = d['stn']
            newData['date'] = d['date']
            newData['avgt'] = d['avgt']
            newData['maxt'] = d['maxt']
            newData['mint'] = d['mint']
            newData['pcpn'] = d['pcpn']
            newData['avgt_normal'] = d['avgt_normal']
            newData['maxt_normal'] = d['maxt_normal']
            newData['mint_normal'] = d['mint_normal']
            newData['pcpn_normal'] = d['pcpn_normal']
            this.past_data = newData
        }
    @action emptyPastData = () => {
            if (this.getPastData) { this.past_data = null }
            let data = {}
            data['stn'] = []
            data['date'] = []
            data['avgt'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            data['avgt_normal'] = []
            data['maxt_normal'] = []
            data['mint_normal'] = []
            data['pcpn_normal'] = []
            this.past_data = data
        }
    @computed get getPastData() {
            return this.past_data
        }

    // Check if a past data is loading
    @computed get isPastLoading() {
        if (!this.getLoaderPast) {
            return false;
        } else {
            return true;
        }
    }

    // Logic for displaying spinner (past)
    @observable loader_past=false;
    @action updateLoaderPast = (l) => {
            this.loader_past = l;
        }
    @computed get getLoaderPast() {
            return this.loader_past
        }

    // Past data download - download data using parameters
    @action loadPastData = (uid,network,timescale,season,month) => {
        //console.log("Call loadPastData")
        if (this.getLoaderPast === false) { this.updateLoaderPast(true); }
        this.emptyPastData()
        let params={}
        // month numbers. For seasons, the last month is given (needed for ACIS query).
        let monthNum = {
          'jan':'01','feb':'02','mar':'03','apr':'04','may':'05','jun':'06',
          'jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12',
          'djf':'02','mam':'05','jja':'08','son':'11'
        }
        // get var minors for ACIS calls
        let vN_temp = this.getVarMinor('temp',network)
        let vN_pcpn = this.getVarMinor('pcpn',network)
        if (timescale==='monthly') {
          params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"1850-"+monthNum[month],
            "edate":"por",
            "elems":[
                {"name":"avgt","vN":vN_temp,"interval":[1,0],"duration":1,"reduce":"mean","maxmissing":"3"},
                {"name":"maxt","vN":vN_temp,"interval":[1,0],"duration":1,"reduce":"mean","maxmissing":"3"},
                {"name":"mint","vN":vN_temp,"interval":[1,0],"duration":1,"reduce":"mean","maxmissing":"3"},
                {"name":"pcpn","vN":vN_pcpn,"interval":[1,0],"duration":1,"reduce":"sum","maxmissing":"3"},
                {"name":"avgt","vN":vN_temp,"interval":[1,0],"duration":1,"reduce":"mean","normal":"1"},
                {"name":"maxt","vN":vN_temp,"interval":[1,0],"duration":1,"reduce":"mean","normal":"1"},
                {"name":"mint","vN":vN_temp,"interval":[1,0],"duration":1,"reduce":"mean","normal":"1"},
                {"name":"pcpn","vN":vN_pcpn,"interval":[1,0],"duration":1,"reduce":"sum","normal":"1"},
              ]
            }
        } else if (timescale==='seasonal') {
          params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"1850-"+monthNum[season],
            "edate":"por",
            "elems":[
                {"name":"avgt","vN":vN_temp,"interval":[1,0],"duration":3,"reduce":"mean","maxmissing":"10"},
                {"name":"maxt","vN":vN_temp,"interval":[1,0],"duration":3,"reduce":"mean","maxmissing":"10"},
                {"name":"mint","vN":vN_temp,"interval":[1,0],"duration":3,"reduce":"mean","maxmissing":"10"},
                {"name":"pcpn","vN":vN_pcpn,"interval":[1,0],"duration":3,"reduce":"sum","maxmissing":"10"},
                {"name":"avgt","vN":vN_temp,"interval":[1,0],"duration":3,"reduce":"mean","normal":"1"},
                {"name":"maxt","vN":vN_temp,"interval":[1,0],"duration":3,"reduce":"mean","normal":"1"},
                {"name":"mint","vN":vN_temp,"interval":[1,0],"duration":3,"reduce":"mean","normal":"1"},
                {"name":"pcpn","vN":vN_pcpn,"interval":[1,0],"duration":3,"reduce":"sum","normal":"1"},
              ]
            }
        } else {
          params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"por",
            "edate":"por",
            "elems":[
                {"name":"avgt","vN":vN_temp,"interval":[1],"duration":1,"reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"maxt","vN":vN_temp,"interval":[1],"duration":1,"reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"mint","vN":vN_temp,"interval":[1],"duration":1,"reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"pcpn","vN":vN_pcpn,"interval":[1],"duration":1,"reduce":{"reduce":"sum"},"maxmissing":10},
                {"name":"avgt","vN":vN_temp,"interval":[1],"duration":1,"reduce":{"reduce":"mean"},"normal":"1"},
                {"name":"maxt","vN":vN_temp,"interval":[1],"duration":1,"reduce":{"reduce":"mean"},"normal":"1"},
                {"name":"mint","vN":vN_temp,"interval":[1],"duration":1,"reduce":{"reduce":"mean"},"normal":"1"},
                {"name":"pcpn","vN":vN_pcpn,"interval":[1],"duration":1,"reduce":{"reduce":"sum"},"normal":"1"},
              ]
            }
        }
        //console.log('PAST PARAMS');
        //console.log(params);
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParamsPast(uid))
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            //console.log('SUCCESS downloading PAST DATA from ACIS');
            //console.log(res);
            let i
            let stnValue,dateValue,avgtValue,maxtValue,mintValue,pcpnValue,avgtNormal,maxtNormal,mintNormal,pcpnNormal
            let data = {}
            data['stn'] = []
            data['date'] = []
            data['avgt'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            data['avgt_normal'] = []
            data['maxt_normal'] = []
            data['mint_normal'] = []
            data['pcpn_normal'] = []
            let validDataFound=false
            for (i=0; i<res.data.data.length; i++) {
                stnValue = res.data.meta.name+', '+res.data.meta.state
                //dateValue = Date.UTC(res.data.data[i][0].slice(0,4),res.data.data[i][0].slice(5)-1,1)
                dateValue = (res.data.data[i][0].length===4) ? Date.UTC(res.data.data[i][0],0,1) : Date.UTC(res.data.data[i][0].slice(0,4),res.data.data[i][0].slice(5)-1,1)
                avgtValue = (res.data.data[i][1]==='M') ? null : parseFloat(res.data.data[i][1])
                maxtValue = (res.data.data[i][2]==='M') ? null : parseFloat(res.data.data[i][2])
                mintValue = (res.data.data[i][3]==='M') ? null : parseFloat(res.data.data[i][3])
                pcpnValue = (res.data.data[i][4]==='M') ? null : ((res.data.data[i][4]==='T') ? 0.00 : parseFloat(res.data.data[i][4]))
                avgtNormal= (res.data.data[i][5]==='M') ? null : parseFloat(res.data.data[i][5])
                maxtNormal = (res.data.data[i][6]==='M') ? null : parseFloat(res.data.data[i][6])
                mintNormal = (res.data.data[i][7]==='M') ? null : parseFloat(res.data.data[i][7])
                pcpnNormal = (res.data.data[i][8]==='M') ? null : ((res.data.data[i][8]==='T') ? 0.00 : parseFloat(res.data.data[i][8]))
                if ((avgtValue || maxtValue || mintValue || pcpnValue) && (avgtNormal || maxtNormal || mintNormal || pcpnNormal)) { validDataFound=true }
                if (validDataFound) {
                    data['stn'].push(stnValue)
                    data['date'].push(dateValue)
                    data['avgt'].push(avgtValue)
                    data['maxt'].push(maxtValue)
                    data['mint'].push(mintValue)
                    data['pcpn'].push(pcpnValue)
                    data['avgt_normal'].push(avgtNormal)
                    data['maxt_normal'].push(maxtNormal)
                    data['mint_normal'].push(mintNormal)
                    data['pcpn_normal'].push(pcpnNormal)
                }
            }
            this.updatePastData(data);
            if (this.getLoaderPast === true) { this.updateLoaderPast(false); }
            //console.log(this.getPastData);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
            if (this.getLoaderPast === true) { this.updateLoaderPast(false); }
          });
    }

    //////////////////////////////////
    // CURRENT DATA
    //////////////////////////////////

    // store downloaded present data
    // these contain the obs and normals
    @observable present_data = null;
    @action updatePresentData = (d) => {
            let newData = {}
            newData = {}
            newData['stn'] = d['stn']
            newData['obs'] = {}
            newData['normal'] = {}
            newData['obs']['date'] = d['date']
            newData['obs']['maxt'] = d['maxt_obs']
            newData['obs']['mint'] = d['mint_obs']
            newData['normal']['date'] = d['date']
            newData['normal']['maxt'] = d['maxt_normal']
            newData['normal']['mint'] = d['mint_normal']
            this.present_data = newData
        }
    @action emptyPresentData = () => {
            if (this.getPresentData) { this.present_data = null }
            let data = {}
            data['date'] = []
            data['maxt'] = []
            data['mint'] = []
            this.present_data = {
                    'stn' : "",
                    'obs' : data,
                    'normal' : data,
                };
        }
    @computed get getPresentData() {
            return this.present_data
        }

    // store downloaded present precip data
    // these contain the obs and normals for precipitation
    @observable present_precip_data = null;
    @action updatePresentPrecip = (d) => {
            let newData = {}
            newData = {}
            newData['stn'] = d['stn']
            newData['obs'] = {}
            newData['normal'] = {}
            newData['flag'] = {}
            newData['obs']['date'] = d['date']
            newData['obs']['pcpn'] = d['pcpn_obs']
            newData['normal']['date'] = d['date']
            newData['normal']['pcpn'] = d['pcpn_normal']
            newData['flag']['date'] = d['date']
            newData['flag']['pcpn'] = d['pcpn_flag']
            this.present_precip_data = newData
        }
    @action emptyPresentPrecip = () => {
            if (this.getPresentPrecip) { this.present_precip_data = null }
            let data = {}
            data['date'] = []
            data['pcpn'] = []
            this.present_precip_data = {
                    'stn' : "",
                    'obs' : data,
                    'normal' : data,
                    'flag' : data,
                };
        }
    @computed get getPresentPrecip() {
            return this.present_precip_data
        }

    // store downloaded present extreme data
    // these contain the obs and normals
    @observable present_extremes = null;
    @action updatePresentExtremes = (d) => {
            let newData = {}
            newData = {}
            newData['stn'] = d['stn']
            newData['extreme'] = {}
            newData['extreme']['date'] = d['date']
            newData['extreme']['maxt'] = d['maxt_extreme']
            newData['extreme']['mint'] = d['mint_extreme']
            this.present_extremes = newData
        }
    @action emptyPresentExtremes = () => {
            if (this.getPresentExtremes) { this.present_extremes = null }
            let data = {}
            data['date'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            this.present_extremes = {
                    'stn' : "",
                    'extreme' : data,
                };
        }
    @computed get getPresentExtremes() {
            return this.present_extremes
        }

    // Check if a present data is loading
    @computed get isPresentLoading() {
        if (this.getPresentData && this.getPresentPrecip && this.getPresentExtremes) {
            if (!this.getLoaderPresent &&
                !this.getLoaderPresentPrecip &&
                !this.getLoaderPresentExtremes) {
                    return false;
            } else {
                    return true;
            }
        } else {
            return true;
        }
    }

    // Logic for displaying spinner (present)
    @observable loader_present=false;
    @action updateLoaderPresent = (l) => {
            this.loader_present = l;
        }
    @computed get getLoaderPresent() {
            return this.loader_present
        }

    // Logic for displaying spinner (present)
    @observable loader_present_precip=false;
    @action updateLoaderPresentPrecip = (l) => {
            this.loader_present_precip = l;
        }
    @computed get getLoaderPresentPrecip() {
            return this.loader_present_precip
        }

    // Logic for displaying spinner (present)
    @observable loader_present_extremes=false;
    @action updateLoaderPresentExtremes = (l) => {
            this.loader_present_extremes = l;
        }
    @computed get getLoaderPresentExtremes() {
            return this.loader_present_extremes
        }

    // Present data download - download data using parameters
    @action loadPresentData = (uid,network) => {
        //console.log("Call loadPresentData")
        if (this.getLoaderPresent === false) { this.updateLoaderPresent(true); }
        this.emptyPresentData()
        let startdate = moment();
        startdate = startdate.subtract(90, "days");
        startdate = startdate.format("YYYY-MM-DD");
        let enddate = moment()
        enddate = enddate.format("YYYY-MM-DD")
        // get var minors for ACIS calls
        let vN_temp = this.getVarMinor('temp',network)
        let params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":startdate,
            "edate":enddate,
            "elems": [
                {"name":"maxt","vN":vN_temp},
                {"name":"mint","vN":vN_temp},
                {"name":"maxt","vN":vN_temp,"normal":"1"},
                {"name":"mint","vN":vN_temp,"normal":"1"},
              ]
          }
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, params)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            //console.log('SUCCESS downloading PRESENT DATA from ACIS');
            //console.log(res);
            if (!res.data.hasOwnProperty('error')) {
              let i,thisDate
              let maxtObsValue,mintObsValue,maxtNormalValue,mintNormalValue
              let data = {}
              data['stn'] = res.data.meta.name+', '+res.data.meta.state
              data['date'] = []
              data['maxt_obs'] = []
              data['mint_obs'] = []
              data['maxt_normal'] = []
              data['mint_normal'] = []
              for (i=0; i<res.data.data.length; i++) {
                thisDate = res.data.data[i][0];
                maxtObsValue = (res.data.data[i][1]==='M') ? null : parseFloat(res.data.data[i][1])
                mintObsValue = (res.data.data[i][2]==='M') ? null : parseFloat(res.data.data[i][2])
                maxtNormalValue = (res.data.data[i][3]==='M') ? null : parseFloat(res.data.data[i][3])
                mintNormalValue = (res.data.data[i][4]==='M') ? null : parseFloat(res.data.data[i][4])
                data['date'].push(Date.UTC( thisDate.substr(0,4), thisDate.substr(5,2)-1, thisDate.substr(8,2) ))
                data['maxt_obs'].push(maxtObsValue)
                data['mint_obs'].push(mintObsValue)
                data['maxt_normal'].push(maxtNormalValue)
                data['mint_normal'].push(mintNormalValue)
              }
              this.updatePresentData(data);
              //console.log(this.getPresentData);
            }
            if (this.getLoaderPresent === true) { this.updateLoaderPresent(false); }
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
            if (this.getLoaderPresent === true) { this.updateLoaderPresent(false); }
          });
    }

    // Present precipitation download - download data using parameters
    @action loadPresentPrecip = (uid,network) => {
        //console.log("Call loadPresentPrecip")
        if (this.getLoaderPresentPrecip === false) { this.updateLoaderPresentPrecip(true); }
        this.emptyPresentPrecip()
        let enddate = moment()
        enddate = enddate.format("YYYY-MM-DD")
        let startdate = enddate.split('-')[0]+'-01-01'
        // get var minors for ACIS calls
        let vN_pcpn = this.getVarMinor('pcpn',network)
        let params = {
            "uid": uid,
            "meta":"name,state",
            //"sdate":"2019-01-01",
            //"edate":"2019-06-13",
            "sdate":startdate,
            "edate":enddate,
            "elems":[
                {"name":"pcpn","vN":vN_pcpn,"interval":[0,0,1],"duration":"ytd","reduce":"sum"},
                {"name":"pcpn","vN":vN_pcpn,"interval":[0,0,1],"duration":"ytd","reduce":"sum","normal":"1"},
                {"name":"pcpn","vN":vN_pcpn,"add":"f"}
              ]
          }
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, params)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            //console.log('SUCCESS downloading PRESENT PRECIP from ACIS');
            //console.log(res);
            if (!res.data.hasOwnProperty('error')) {
              let i,thisDate
              let pcpnObsValue,pcpnNormalValue,pcpnFlagValue
              let data = {}
              data['stn'] = res.data.meta.name+', '+res.data.meta.state
              data['date'] = []
              data['pcpn_obs'] = []
              data['pcpn_normal'] = []
              data['pcpn_flag'] = []
              for (i=0; i<res.data.data.length; i++) {
                thisDate = res.data.data[i][0];
                pcpnObsValue = (res.data.data[i][1]==='M') ? null : ((res.data.data[i][1]==='T') ? 0.00 : parseFloat(res.data.data[i][1]))
                pcpnNormalValue = (res.data.data[i][2]==='M') ? null : ((res.data.data[i][2]==='T') ? 0.00 : parseFloat(res.data.data[i][2]))
                pcpnFlagValue = res.data.data[i][3][1]
                data['date'].push(Date.UTC( thisDate.substr(0,4), thisDate.substr(5,2)-1, thisDate.substr(8,2) ))
                data['pcpn_obs'].push(pcpnObsValue)
                data['pcpn_normal'].push(pcpnNormalValue)
                data['pcpn_flag'].push(pcpnFlagValue)
              }
              this.updatePresentPrecip(data);
            }
            if (this.getLoaderPresentPrecip === true) { this.updateLoaderPresentPrecip(false); }
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
            if (this.getLoaderPresentPrecip === true) { this.updateLoaderPresentPrecip(false); }
          });
    }

    // Present extremes download - download data using parameters
    @action loadPresentExtremes = (uid,network) => {
        //console.log("Call loadPresentExtremes")
        if (this.getLoaderPresentExtremes === false) { this.updateLoaderPresentExtremes(true); }
        this.emptyPresentExtremes()
        // get var minors for ACIS calls
        let vN_temp = this.getVarMinor('temp',network)
        let params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"por",
            "edate":"por",
            "elems":[
                {"name":"maxt","vN":vN_temp,"interval":[0,0,1],"duration":1,"smry":{"add":"date","reduce":"max"},"smry_only":"1","groupby":"year"},
                {"name":"mint","vN":vN_temp,"interval":[0,0,1],"duration":1,"smry":{"add":"date","reduce":"min"},"smry_only":"1","groupby":"year"}
              ]
          }
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParamsPresentExtremes)
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            //console.log('SUCCESS downloading PRESENT EXTREMES from ACIS');
            //console.log(res);
            if (!res.data.hasOwnProperty('error')) {
              let i,startDate,thisDate,thisDateMoment,lastYear,thisYear,extremeDate,todayDate
              let maxtExtremeValue,mintExtremeValue
              let data = {}
              // today's date as MM-DD
              todayDate=moment().format('MM-DD')
              startDate=moment().format('YYYY-MM-DD')
              startDate=moment(startDate,'YYYY-MM-DD')
              startDate = startDate.subtract(90, "days");
              // this year as YYYY string
              thisYear=moment().format('YYYY')
              // last year as YYYY string
              lastYear=parseInt(thisYear,10) - 1
              lastYear=lastYear.toString()
              data['stn'] = res.data.meta.name+', '+res.data.meta.state
              data['date'] = []
              data['maxt_extreme'] = []
              data['mint_extreme'] = []
              // max temperature extremes
              for (i=0; i<res.data.smry[0].length; i++) {
                extremeDate = res.data.smry[0][i][1];
                // this date as 'MM-DD'
                thisDate = extremeDate.slice(-5);
                maxtExtremeValue = (res.data.smry[0][i][0]==='M') ? null : parseFloat(res.data.smry[0][i][0])
                mintExtremeValue = (res.data.smry[1][i][0]==='M') ? null : parseFloat(res.data.smry[1][i][0])
                if (thisDate <= todayDate) {
                    thisDateMoment = moment(thisYear+thisDate.substr(0,2)+thisDate.substr(3,2),'YYYYMMDD' );
                } else {
                    thisDateMoment = moment( lastYear+thisDate.substr(0,2)+thisDate.substr(3,2),'YYYYMMDD' );
                }
                if (thisDateMoment >= startDate) {
                    data['date'].push(Date.UTC(thisDateMoment.year(), thisDateMoment.month(), thisDateMoment.date()))
                    data['maxt_extreme'].push(maxtExtremeValue)
                    data['mint_extreme'].push(mintExtremeValue)
                }
              }
              this.updatePresentExtremes(data);
            }
            if (this.getLoaderPresentExtremes === true) { this.updateLoaderPresentExtremes(false); }
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
            if (this.getLoaderPresentExtremes === true) { this.updateLoaderPresentExtremes(false); }
          });
    }

    //////////////////////////////////
    // PROJECTIONS
    //////////////////////////////////

    // store downloaded livneh data
    @observable livneh_data = null;
    @action updateLivnehData = (d) => {
            this.livneh_data = d;
            //console.log(this.getLivnehData);
        }
    @action emptyLivnehData = (d) => {
            if (this.getLivnehData) { this.livneh_data = null }
            let data = {}
            data['years'] = []
            data['avgt'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            this.livneh_data = data
        }
    @computed get getLivnehData() {
            return this.livneh_data
        }

    // store downloaded projection data
    @observable projection_data = null;
    @action updateProjectionData = (d,re,scen) => {
            let newData = {}
            newData[scen] = {}
            newData[scen][re] = {}
            newData[scen][re]['years'] = d['years']
            newData[scen][re]['avgt'] = d['avgt']
            newData[scen][re]['maxt'] = d['maxt']
            newData[scen][re]['mint'] = d['mint']
            newData[scen][re]['pcpn'] = d['pcpn']
            this.projection_data[scen][re] = newData[scen][re]
        }
    @action emptyProjectionData = (d) => {
            if (this.getProjectionData) { this.projection_data = null }
            let data = {}
            data['years'] = []
            data['avgt'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            this.projection_data = {
                    'rcp45' : {
                        'mean' : data,
                        'max' : data,
                        'min' : data,
                        },
                    'rcp85' : {
                        'mean' : data,
                        'max' : data,
                        'min' : data,
                        },
                };
        }
    @computed get getProjectionData() {
            return this.projection_data
        }

    // store downloaded projection data
    @observable projection_data_AK = null;
    @action updateProjectionDataAK = (d,m,scen) => {
            let newData = {}
            newData[scen] = {}
            newData[scen][m] = {}
            newData[scen][m]['years'] = d['years']
            newData[scen][m]['avgt'] = d['avgt']
            newData[scen][m]['maxt'] = d['maxt']
            newData[scen][m]['mint'] = d['mint']
            newData[scen][m]['pcpn'] = d['pcpn']
            this.projection_data_AK[scen][m] = newData[scen][m]
        }
    @action emptyProjectionDataAK = (d) => {
            if (this.getProjectionDataAK) { this.projection_data_AK = null }
            let data = {}
            data['years'] = []
            data['avgt'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            this.projection_data_AK = {
                    'rcp45' : {
                        'gfdl-cm3' : data,
                        'ncar-ccsm4' : data,
                        },
                    'rcp85' : {
                        'gfdl-cm3' : data,
                        'ncar-ccsm4' : data,
                        },
                };
        }
    @computed get getProjectionDataAK() {
            return this.projection_data_AK
        }

    // Logic for displaying spinner (projections)
    @observable loader_projections=false;
    @action updateLoaderProjections = (l) => {
            this.loader_projections = l;
        }
    @computed get getLoaderProjections() {
            return this.loader_projections
        }

    // Logic for displaying spinner (projections)
    @observable loader_projections_AK=false;
    @action updateLoaderProjectionsAK = (l) => {
            this.loader_projections_AK = l;
        }
    @computed get getLoaderProjectionsAK() {
            return this.loader_projections_AK
        }

    // Check if a projection is loading
    @computed get isProjectionLoading() {
      if (parseFloat(this.getNation.ll[0]) < 51.0) {

        if (this.getProjectionData) {
            if (this.getProjectionData.rcp85.mean.years.length > 0 &&
                this.getProjectionData.rcp85.min.years.length > 0 &&
                this.getProjectionData.rcp85.max.years.length > 0 &&
                this.getProjectionData.rcp45.mean.years.length > 0 &&
                this.getProjectionData.rcp45.min.years.length > 0 &&
                this.getProjectionData.rcp45.max.years.length > 0 &&
                !this.getLoaderProjections) {
                    return false;
            } else {
                    return true;
            }
        } else {
            return true;
        }

      } else {

        if (this.getProjectionDataAK) {
            if (this.getProjectionDataAK['rcp85']['gfdl-cm3'].years.length > 0 &&
                this.getProjectionDataAK['rcp85']['ncar-ccsm4'].years.length > 0 &&
                !this.getLoaderProjectionsAK) {
                    return false;
            } else {
                    return true;
            }
        } else {
            return true;
        }

      }
    }

    // Check if a projection is loading for AK
    @computed get isProjectionLoadingAK() {
        if (this.getProjectionDataAK) {
            if (this.getProjectionDataAK['rcp85']['gfdl-cm3'].years.length > 0 &&
                this.getProjectionDataAK['rcp85']['ncar-ccsm4'].years.length > 0 &&
                !this.getLoaderProjectionsAK) {
                    return false;
            } else {
                    return true;
            }
        } else {
            return true;
        }
    }

  @action loadProjections_1980_2100 = (scen,re,timescale,season,month) => {

    if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
    let varReduce = ''
    if (re==='mean') { varReduce = 'wMean' }
    if (re==='max') { varReduce = 'allMax' }
    if (re==='min') { varReduce = 'allMin' }

    let params={}

    //calculate bounding box from center point of nation
    let wLon = parseFloat(this.getNation.ll[1]) - 0.50
    let eLon = parseFloat(this.getNation.ll[1]) + 0.50
    let nLat = parseFloat(this.getNation.ll[0]) + 0.50
    let sLat = parseFloat(this.getNation.ll[0]) - 0.50

    // month numbers. For seasons, the last month is given (needed for ACIS query).
    let monthNum = {
      'jan':'01','feb':'02','mar':'03','apr':'04','may':'05','jun':'06',
      'jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12',
      'djf':'02','mam':'05','jja':'08','son':'11'
    }

    if (timescale==='monthly') {
        params = {
          "grid": "loca:"+varReduce+":"+scen,
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980-"+monthNum[month],
          "edate": "2099-"+monthNum[month],
          "elems": [
            { "name":"avgt","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"maxt","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"mint","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"pcpn","interval":[1,0],"duration":1,"reduce":"sum" }
          ]
        };
    } else if (timescale==='seasonal') {
        params = {
          "grid": "loca:"+varReduce+":"+scen,
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980-"+monthNum[season],
          "edate": "2099-"+monthNum[season],
          "elems": [
            {"elem":{"name":"avgt","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"maxt","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"mint","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"pcpn","interval":[0,1],"duration":1,"reduce":"sum"},"interval":[1,0],"duration":3,"reduce":"sum"}
          ]
        };
    } else {
        params = {
          "grid": "loca:"+varReduce+":"+scen,
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980",
          "edate": "2099",
          "elems": [
            { "name":"avgt","interval":[1],"duration":1,"reduce":"mean" },
            { "name":"maxt","interval":[1],"duration":1,"reduce":"mean" },
            { "name":"mint","interval":[1],"duration":1,"reduce":"mean" },
            { "name":"pcpn","interval":[1],"duration":1,"reduce":"sum" }
          ]
        };
    }

    //console.log('loading projections: params');
    //console.log(params);

    return axios
      .post(`${protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        //console.log('successful download of projection data : ' + scen + ' ' + re + ' 1980-2100');
        let i
        let data = {}
        let arrFlat
        data['years'] = []
        data['avgt'] = []
        data['maxt'] = []
        data['mint'] = []
        data['pcpn'] = []
        for (i=0; i<res.data.data.length; i++) {
            if (timescale==='annual') {
                data['years'].push(Date.UTC(res.data.data[i][0],0,1))
            } else {
                data['years'].push(Date.UTC(res.data.data[i][0].split('-')[0],0,1))
            }

            // when averaging over bounding box
            // for each variable, we 1)flatten array and 2)average all values
            arrFlat = [].concat.apply([], res.data.data[i][1]);
            data['avgt'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][2]);
            data['maxt'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][3]);
            data['mint'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][4]);
            data['pcpn'].push(arrAvg(arrFlat))
        }
        this.updateProjectionData(data,re,scen);
        if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
      })
      .catch(err => {
        console.log("Failed to load projection data 1980-2100 ", err);
      });
  }

  @action loadProjectionsAK_1980_2100 = (scen,model,timescale,season,month) => {

    if (this.getLoaderProjectionsAK === false) { this.updateLoaderProjectionsAK(true); }

    let params={}

    //calculate bounding box from center point of nation
    let wLon = parseFloat(this.getNation.ll[1]) - 0.50
    let eLon = parseFloat(this.getNation.ll[1]) + 0.50
    let nLat = parseFloat(this.getNation.ll[0]) + 0.50
    let sLat = parseFloat(this.getNation.ll[0]) - 0.50

    // month numbers. For seasons, the last month is given (needed for ACIS query).
    let monthNum = {
      'jan':'01','feb':'02','mar':'03','apr':'04','may':'05','jun':'06',
      'jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12',
      'djf':'02','mam':'05','jja':'08','son':'11'
    }

    if (timescale==='monthly') {
        params = {
          "grid": "snap:"+model+":"+scen,
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980-"+monthNum[month],
          "edate": "2099-"+monthNum[month],
          "elems": [
            { "name":"avgt","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"maxt","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"mint","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"pcpn","interval":[1,0],"duration":1,"reduce":"sum" }
          ]
        };
    } else if (timescale==='seasonal') {
        params = {
          "grid": "snap:"+model+":"+scen,
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980-"+monthNum[season],
          "edate": "2099-"+monthNum[season],
          "elems": [
            {"elem":{"name":"avgt","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"maxt","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"mint","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"pcpn","interval":[0,1],"duration":1,"reduce":"sum"},"interval":[1,0],"duration":3,"reduce":"sum"}
          ]
        };
    } else {
        params = {
          "grid": "snap:"+model+":"+scen,
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980",
          "edate": "2099",
          "elems": [
            { "name":"avgt","interval":[1],"duration":1,"reduce":"mean" },
            { "name":"maxt","interval":[1],"duration":1,"reduce":"mean" },
            { "name":"mint","interval":[1],"duration":1,"reduce":"mean" },
            { "name":"pcpn","interval":[1],"duration":1,"reduce":"sum" }
          ]
        };
    }

    //console.log('loading AK projections: params');
    //console.log(params);

    return axios
      .post(`${protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        //console.log('successful download of projection data : ' + scen + ' ' + model + ' 1980-2100');
        let i
        let data = {}
        let arrFlat
        data['years'] = []
        data['avgt'] = []
        data['maxt'] = []
        data['mint'] = []
        data['pcpn'] = []
        for (i=0; i<res.data.data.length; i++) {
            if (timescale==='annual') {
                data['years'].push(Date.UTC(res.data.data[i][0],0,1))
            } else {
                data['years'].push(Date.UTC(res.data.data[i][0].split('-')[0],0,1))
            }

            // when averaging over bounding box
            // for each variable, we 1)flatten array and 2)average all values
            arrFlat = [].concat.apply([], res.data.data[i][1]);
            data['avgt'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][2]);
            data['maxt'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][3]);
            data['mint'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][4]);
            data['pcpn'].push(arrAvg(arrFlat))
        }
        this.updateProjectionDataAK(data,model,scen);
        if (this.getLoaderProjectionsAK === true) { this.updateLoaderProjectionsAK(false); }
      })
      .catch(err => {
        console.log("Failed to load AK projection data 1980-2100 ", err);
      });
  }

  @action loadLivnehData = (timescale,season,month) => {

    if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }

    let params={}

    //calculate bounding box from center point of nation
    let wLon = parseFloat(this.getNation.ll[1]) - 0.50
    let eLon = parseFloat(this.getNation.ll[1]) + 0.50
    let nLat = parseFloat(this.getNation.ll[0]) + 0.50
    let sLat = parseFloat(this.getNation.ll[0]) - 0.50

    // month numbers. For seasons, the last month is given (needed for ACIS query).
    let monthNum = {
      'jan':'01','feb':'02','mar':'03','apr':'04','may':'05','jun':'06',
      'jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12',
      'djf':'02','mam':'05','jja':'08','son':'11'
    }

    // FOR ANNUAL REQUESTS
    if (timescale==='monthly') {
        params = {
          "grid": "livneh",
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980-"+monthNum[month],
          "edate": "2013-"+monthNum[month],
          "elems": [
            { "name":"avgt","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"maxt","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"mint","interval":[1,0],"duration":1,"reduce":"mean" },
            { "name":"pcpn","interval":[1,0],"duration":1,"reduce":"sum" },
          ]
        };
    } else if (timescale==='seasonal') {
        params = {
          "grid": "livneh",
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980-"+monthNum[season],
          "edate": "2013-"+monthNum[season],
          "elems": [
            {"elem":{"name":"avgt","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"maxt","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"mint","interval":[0,1],"duration":1,"reduce":"mean"},"interval":[1,0],"duration":3,"reduce":"mean"},
            {"elem":{"name":"pcpn","interval":[0,1],"duration":1,"reduce":"sum"},"interval":[1,0],"duration":3,"reduce":"sum"}
          ]
        };
    } else {
        params = {
          "grid": "livneh",
          "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
          "sdate": "1980",
          "edate": "2013",
          "elems": [
            { "name":"avgt","interval":"yly","duration":1,"reduce":"mean" },
            { "name":"maxt","interval":"yly","duration":1,"reduce":"mean" },
            { "name":"mint","interval":"yly","duration":1,"reduce":"mean" },
            { "name":"pcpn","interval":"yly","duration":1,"reduce":"sum" },
          ]
        };
    }

    return axios
      //.post("http://grid2.rcc-acis.org/GridData", params)
      .post(`${protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        //console.log('successful download of livneh data 1980-2013');
        let i
        let data = {}
        let arrFlat
        data['years'] = []
        data['avgt'] = []
        data['maxt'] = []
        data['mint'] = []
        data['pcpn'] = []
        for (i=0; i<res.data.data.length; i++) {
            if (timescale==='annual') {
                data['years'].push(Date.UTC(res.data.data[i][0],0,1))
            } else {
                data['years'].push(Date.UTC(res.data.data[i][0].split('-')[0],0,1))
            }

            // when I was testing with state averages
            //data['avgt'].push(res.data.data[i][1][params['state']])
            //data['maxt'].push(res.data.data[i][2][params['state']])
            //data['mint'].push(res.data.data[i][3][params['state']])
            //data['pcpn'].push(res.data.data[i][4][params['state']])

            // when I was testing with single grid
            //data['avgt'].push(res.data.data[i][1])
            //data['maxt'].push(res.data.data[i][2])
            //data['mint'].push(res.data.data[i][3])
            //data['pcpn'].push(res.data.data[i][4])

            // when averaging over bounding box
            // for each variable, we 1)flatten array and 2)average all values
            arrFlat = [].concat.apply([], res.data.data[i][1]);
            data['avgt'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][2]);
            data['maxt'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][3]);
            data['mint'].push(arrAvg(arrFlat))
            arrFlat = [].concat.apply([], res.data.data[i][4]);
            data['pcpn'].push(arrAvg(arrFlat))
        }
        this.updateLivnehData(data);
        if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
      })
      .catch(err => {
        console.log("Failed to load livneh data 1980-2013 ", err);
      });
  }

    @action loadProjections = (timescale,season,month) => {
        this.emptyProjectionData()
        this.emptyLivnehData()
        this.loadLivnehData(timescale,season,month);
        this.loadProjections_1980_2100('rcp85','mean',timescale,season,month);
        this.loadProjections_1980_2100('rcp85','max',timescale,season,month);
        this.loadProjections_1980_2100('rcp85','min',timescale,season,month);
        this.loadProjections_1980_2100('rcp45','mean',timescale,season,month);
        this.loadProjections_1980_2100('rcp45','max',timescale,season,month);
        this.loadProjections_1980_2100('rcp45','min',timescale,season,month);
    }

    @action loadProjectionsAK = (timescale,season,month) => {
        this.emptyProjectionDataAK()
        this.loadProjectionsAK_1980_2100('rcp85','gfdl-cm3',timescale,season,month);
        this.loadProjectionsAK_1980_2100('rcp85','ncar-ccsm4',timescale,season,month);
        // rcp45 unavailable for snap grids
    }

    @action climview_loadData = (getObs,getProj,uid,network,timescale,season,month) => {
        // getObs: boolean, whether to load observations
        // getProj: boolean, whether to load projections
        if (getObs) {this.loadPastData(uid,network,timescale,season,month)};
        if (getObs) {this.loadPresentData(uid,network)};
        if (getObs) {this.loadPresentPrecip(uid,network)};
        if (getObs) {this.loadPresentExtremes(uid,network)};
        if (getProj) {
            if (parseFloat(this.getNation.ll[0])<51.0) {this.loadProjections(timescale,season,month)};
            if (parseFloat(this.getNation.ll[0])>=51.0) {this.loadProjectionsAK(timescale,season,month)};
        }
    }

    // run these on initial load
    constructor() {
        //this.downloadStationInfo()
        if (localStorage.getItem("TRIBAL-CLIMATE-TOOLS.nation")) {
            this.setNation(localStorage.getItem("TRIBAL-CLIMATE-TOOLS.nation"))
        } else {
            this.setNation("Pine Ridge Reservation")
        }
    }

}
