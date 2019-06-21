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

    //@computed get getNationGeojson() { return us_aiannh_pilot };
    @computed get getNationGeojson() { console.log(us_aiannh_pilot); return us_aiannh_pilot };

    /// manage currently active nation
    // get currently selected nation object (for nation select and nation picker)
    @observable nation = {"name":"Pine Ridge Reservation","ll":["43.3449996","-102.0818655"],"llbounds":[[-103.001027,42.987359],[-101.227336,43.796737]]}
    @action setNation = (l) => {
        if (this.getNation.name !== l.toString()) {
            this.nation = this.getNations.find(obj => obj.name === l);
            //if (this.toolIsSelected && this.getToolName==='climview') { this.wxgraph_downloadData() }
        };
    }
    // set nation from select menu
    @action setSelectedNation = (t) => {
            if (this.getNation.name !== t.value) {
                this.nation = this.getNations.find(obj => obj.name.toString() === t.value);
                //if (this.toolIsSelected && this.getToolName==='climview') { this.wxgraph_downloadData() }
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
            "Flathead Reservation": {"uid":"12082","name":"POLSON KERR DAM"},
            "L'Anse Reservation": {"uid":"29678","name":"HANCOCK HOUGHTON COUNTY AP"},
            "Pine Ridge Reservation": {"uid":"16756","name":"COTTONWOOD 2 E"},
            "Tohono O'odham Nation Reservation": {"uid":"1274","name":"KITT PEAK"},
            "Navajo Nation Reservation": {"uid":"171","name":"CANYON DE CHELLY"},
            "Fort Belknap Reservation": {"uid":"12221","name":"CHINOOK"},
            "Leech Lake Reservation": {"uid":"10561","name":"LEECH LAKE"},
            "Crow Reservation": {"uid":"11733","name":"BUSBY"},
            "Spirit Lake Reservation": {"uid":"13595","name":"MC HENRY 3W"},
            "Menominee Reservation": {"uid":"19892","name":"SHAWANO 2SSW"},
            "Fond du Lac Reservation": {"uid":"10517","name":"CLOQUET"},
            "Lummi Reservation": {"uid":"26258","name":"CLEARBROOK"},
            "Standing Rock Reservation": {"uid":"16965","name":"POLLOCK"},
            "Turtle Mountain Reservation": {"uid":"13691","name":"WILLOW CITY"},
            "Blackfeet Indian Reservation": {"uid":"12237","name":"CUT BANK AIRPORT"},
            "Winnebago Reservation": {"uid":"6939","name":"SIOUX CITY AP"},
            "Barrow ANVSA": {"uid":"21127","name":"BARROW WSO AP"},
            "Creek OTSA": {"uid":"14134","name":"TULSA INTL AIRPORT"},
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
    /// chart details
    /// which time range is selected?
    /// past : observed annual values through last year
    /// present : two months of daily observed data and normals
    /// future: model projections from next year through 2100
    @observable chart_view='present';
    @action setChartView = (v) => {
        this.chart_view = v;
    };
    @computed get getChartView() { return this.chart_view };
    @computed get chartViewIsPast() { return this.getChartView==='past' };
    @computed get chartViewIsPresent() { return this.getChartView==='present' };
    @computed get chartViewIsFuture() { return this.getChartView==='future' };

    /// which variable is active?
    /// possibilities are 'avgt','mint','maxt','pcpn','snow'
    @observable wxgraph_var = 'avgt';
    @action wxgraph_setVar = (v) => {
        this.wxgraph_var = v;
    };
    @action wxgraph_setVarFromRadioGroup = (e) => {
        let t = e.target.value;
        // has the var changed?
        let changed = (this.wxgraph_getVar===t) ? false : true
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_var = t;
            //this.wxgraph_downloadData()
        }
    }
    @action wxgraph_setVarFromInput = (e) => {
        let t = e.target.value;
        // has the var changed?
        let changed = (this.wxgraph_getVar===t) ? false : true
        // only update and download data if time frame has changed
        if (changed===true) {
            this.wxgraph_var = t;
            //this.wxgraph_downloadData()
        }
    }
    @computed get wxgraph_getVar() { return this.wxgraph_var };

    /// which output type is active?
    @observable outputType = 'chart';
    @action setOutputType = (changeEvent) => {
        console.log('Changing output type to ', changeEvent.target.value)
        this.outputType = changeEvent.target.value
    }
    // set outputType from select menu
    @action setSelectedOutputType = (t) => {
            if (this.getOutputType !== t) {
                this.outputType = t.value;
            }
        };
    @computed get getOutputType() { return this.outputType };

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
            this.past_data = data
        }
    @computed get getPastData() {
            return this.past_data
        }

    // Check if a past data is loading
    @computed get isPastLoading() {
        if (this.getPastData) {
            if (this.getPastData.date.length > 0 &&
                !this.getLoaderPast) {
                    return false;
            } else {
                    return true;
            }
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
    @action loadPastData = (uid) => {
        console.log("Call loadPastData")
        if (this.getLoaderPast === false) { this.updateLoaderPast(true); }
        this.emptyPastData()
        let params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"por",
            "edate":"por",
            "elems":[
                {"name":"avgt","interval":[1],"duration":1,"reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"maxt","interval":[1],"duration":1,"reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"mint","interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"pcpn","interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10},
              ]
          }
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParamsPast(uid))
          .post(`${protocol}//data.rcc-acis.org/StnData`, params)
          .then(res => {
            console.log('SUCCESS downloading PAST DATA from ACIS');
            //let i,thisDate
            //let stnValue,dateValue,avgtValue,maxtValue,mintValue,pcpnValue,snowValue
            let i
            let stnValue,dateValue,avgtValue,maxtValue,mintValue,pcpnValue
            let data = {}
            data['stn'] = []
            data['date'] = []
            data['avgt'] = []
            data['maxt'] = []
            data['mint'] = []
            data['pcpn'] = []
            for (i=0; i<res.data.data.length; i++) {
                stnValue = res.data.meta.name+', '+res.data.meta.state
                dateValue = Date.UTC(res.data.data[i][0],0,1)
                avgtValue = (res.data.data[i][1]==='M') ? null : parseFloat(res.data.data[i][1])
                maxtValue = (res.data.data[i][2]==='M') ? null : parseFloat(res.data.data[i][2])
                mintValue = (res.data.data[i][3]==='M') ? null : parseFloat(res.data.data[i][3])
                pcpnValue = (res.data.data[i][4]==='M') ? null : ((res.data.data[i][4]==='T') ? 0.00 : parseFloat(res.data.data[i][4]))
                data['stn'].push(stnValue)
                data['date'].push(dateValue)
                data['avgt'].push(avgtValue)
                data['maxt'].push(maxtValue)
                data['mint'].push(mintValue)
                data['pcpn'].push(pcpnValue)
            }
            this.updatePastData(data);
            console.log(this.getPastData);
            if (this.getLoaderPast === true) { this.updateLoaderPast(false); }
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
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
            newData['obs']['date'] = d['date']
            newData['obs']['pcpn'] = d['pcpn_obs']
            newData['normal']['date'] = d['date']
            newData['normal']['pcpn'] = d['pcpn_normal']
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
    @action loadPresentData = (uid) => {
        console.log("Call loadPresentData")
        if (this.getLoaderPresent === false) { this.updateLoaderPresent(true); }
        this.emptyPresentData()
        let startdate = moment();
        startdate = startdate.subtract(90, "days");
        startdate = startdate.format("YYYY-MM-DD");
        let enddate = moment()
        enddate = enddate.format("YYYY-MM-DD")
        let params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":startdate,
            "edate":enddate,
            "elems": [
                {"name":"maxt"},
                {"name":"mint"},
                {"name":"maxt","normal":"1"},
                {"name":"mint","normal":"1"},
              ]
          }
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnData`, params)
          .then(res => {
            console.log('SUCCESS downloading PRESENT DATA from ACIS');
            console.log(res);
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
          });
    }

    // Present precipitation download - download data using parameters
    @action loadPresentPrecip = (uid) => {
        console.log("Call loadPresentPrecip")
        if (this.getLoaderPresentPrecip === false) { this.updateLoaderPresentPrecip(true); }
        this.emptyPresentPrecip()
        let params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"2019-01-01",
            "edate":"2019-06-13",
            "elems":[
                {"name":"pcpn","interval":[0,0,1],"duration":"ytd","reduce":"sum"},
                {"name":"pcpn","interval":[0,0,1],"duration":"ytd","reduce":"sum","normal":"1"}
              ]
          }
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnData`, params)
          .then(res => {
            console.log('SUCCESS downloading PRESENT PRECIP from ACIS');
            console.log(res);
            if (!res.data.hasOwnProperty('error')) {
              let i,thisDate
              let pcpnObsValue,pcpnNormalValue
              let data = {}
              data['stn'] = res.data.meta.name+', '+res.data.meta.state
              data['date'] = []
              data['pcpn_obs'] = []
              data['pcpn_normal'] = []
              for (i=0; i<res.data.data.length; i++) {
                thisDate = res.data.data[i][0];
                pcpnObsValue = (res.data.data[i][1]==='M') ? null : ((res.data.data[i][1]==='T') ? 0.00 : parseFloat(res.data.data[i][1]))
                pcpnNormalValue = (res.data.data[i][2]==='M') ? null : ((res.data.data[i][2]==='T') ? 0.00 : parseFloat(res.data.data[i][2]))
                data['date'].push(Date.UTC( thisDate.substr(0,4), thisDate.substr(5,2)-1, thisDate.substr(8,2) ))
                data['pcpn_obs'].push(pcpnObsValue)
                data['pcpn_normal'].push(pcpnNormalValue)
              }
              this.updatePresentPrecip(data);
            }
            if (this.getLoaderPresentPrecip === true) { this.updateLoaderPresentPrecip(false); }
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    // Present extremes download - download data using parameters
    @action loadPresentExtremes = (uid) => {
        console.log("Call loadPresentExtremes")
        if (this.getLoaderPresentExtremes === false) { this.updateLoaderPresentExtremes(true); }
        this.emptyPresentExtremes()
        let params = {
            "uid": uid,
            "meta":"name,state",
            "sdate":"por",
            "edate":"por",
            "elems":[
                {"name":"maxt","interval":[0,0,1],"duration":1,"smry":{"add":"date","reduce":"max"},"smry_only":"1","groupby":"year"},
                {"name":"mint","interval":[0,0,1],"duration":1,"smry":{"add":"date","reduce":"min"},"smry_only":"1","groupby":"year"}
              ]
          }
        return axios
          //.post(`${protocol}//data.rcc-acis.org/StnData`, this.getAcisParamsPresentExtremes)
          .post(`${protocol}//data.rcc-acis.org/StnData`, params)
          .then(res => {
            console.log('SUCCESS downloading PRESENT EXTREMES from ACIS');
            console.log(res);
            if (!res.data.hasOwnProperty('error')) {
              let i,startDate,thisDate,thisDateDT,lastYear,thisYear,extremeDate,todayDate
              let maxtExtremeValue,mintExtremeValue
              let data = {}
              // today's date as MM-DD
              todayDate=moment().format('MM-DD')
              startDate=moment()
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
                    thisDateDT = Date.UTC( thisYear, thisDate.substr(0,2)-1, thisDate.substr(3,2) );
                } else {
                    thisDateDT = Date.UTC( lastYear, thisDate.substr(0,2)-1, thisDate.substr(3,2) );
                }
                if (thisDateDT >= startDate) {
                    data['date'].push(thisDateDT)
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
          });
    }

    //////////////////////////////////
    // PROJECTIONS
    //////////////////////////////////

    @observable state_id = 'NY';
    @action updateStateId = (id) => {
            this.stateId = id
        }
    @computed get getStateId() {
            return this.state_id
        }

    // model scenario management
    // 'rcp85' : High emissions scenario, RCP 8.5
    // 'rcp45' : Low emissions scenario, RCP 4.5
    @observable model_scenario = 'rcp85';
    @action setModelScenario = (changeEvent) => {
        console.log('Changing model scenario to ', changeEvent.target.value)
        this.model_scenario = changeEvent.target.value
    }
    @computed get getModelScenario() { return this.model_scenario };

    // store downloaded livneh data
    @observable livneh_data = null;
    @action updateLivnehData = (d) => {
            this.livneh_data = d;
            console.log(this.getLivnehData);
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

    // Logic for displaying spinner (projections)
    @observable loader_projections=false;
    @action updateLoaderProjections = (l) => {
            this.loader_projections = l;
        }
    @computed get getLoaderProjections() {
            return this.loader_projections
        }

    // Check if a projection is loading
    @computed get isProjectionLoading() {
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
    }

  @action loadProjections_2000_2100 = (id,scen,re) => {

    if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
    let varReduce = ''
    if (re==='mean') { varReduce = 'wMean' }
    if (re==='max') { varReduce = 'allMax' }
    if (re==='min') { varReduce = 'allMin' }

    //calculate bounding box from center point of nation
    let wLon = parseFloat(this.getNation.ll[1]) - 0.50
    let eLon = parseFloat(this.getNation.ll[1]) + 0.50
    let nLat = parseFloat(this.getNation.ll[0]) + 0.50
    let sLat = parseFloat(this.getNation.ll[0]) - 0.50

    const params = {
      "grid": "loca:"+varReduce+":"+scen,
      // bounding box over entire selected nation
      //"bbox":this.getNation.llbounds[0][0].toString()+','+this.getNation.llbounds[0][1].toString()+','+this.getNation.llbounds[1][0].toString()+','+this.getNation.llbounds[1][1].toString(),
      // limit bounding box to 1x1 degree, using interior point as center of bounding box
      "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
      "sdate": "2000",
      "edate": "2099",
      "elems": [
        { "name":"avgt","interval":[1],"duration":1,"reduce":"mean" },
        { "name":"maxt","interval":[1],"duration":1,"reduce":"mean" },
        { "name":"mint","interval":[1],"duration":1,"reduce":"mean" },
        { "name":"pcpn","interval":[1],"duration":1,"reduce":"sum" }
      ]
    };

    console.log('loading projections: params');
    console.log(params);

    return axios
      .post(`${protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        console.log('successful download of projection data : ' + scen + ' ' + re + ' 2000-2100');
        let i
        let data = {}
        let arrFlat
        data['years'] = []
        data['avgt'] = []
        data['maxt'] = []
        data['mint'] = []
        data['pcpn'] = []
        for (i=0; i<res.data.data.length; i++) {
            data['years'].push(Date.UTC(res.data.data[i][0],0,1))

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
        this.updateProjectionData(data,re,scen);
        if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
      })
      .catch(err => {
        console.log("Failed to load projection data 2000-2100 ", err);
      });
  }

  @action loadLivnehData = (id) => {

    if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }

    //calculate bounding box from center point of nation
    let wLon = parseFloat(this.getNation.ll[1]) - 0.50
    let eLon = parseFloat(this.getNation.ll[1]) + 0.50
    let nLat = parseFloat(this.getNation.ll[0]) + 0.50
    let sLat = parseFloat(this.getNation.ll[0]) - 0.50

    // FOR ANNUAL REQUESTS
    const params = {
      "grid": "livneh",
      //"state":id,
      //"loc":this.getNation.ll[1].toString()+','+this.getNation.ll[0].toString(),
      // bounding box over entire selected nation
      //"bbox":this.getNation.llbounds[0][0].toString()+','+this.getNation.llbounds[0][1].toString()+','+this.getNation.llbounds[1][0].toString()+','+this.getNation.llbounds[1][1].toString(),
      // limit bounding box to 1x1 degree, using interior point as center of bounding box
      "bbox":wLon.toString()+','+sLat.toString()+','+eLon.toString()+','+nLat.toString(),
      "sdate": "2000",
      "edate": "2013",
      "elems": [
        //{ "name":"avgt","interval":"yly","duration":1,"reduce":"mean","area_reduce":"state_mean" },
        //{ "name":"maxt","interval":"yly","duration":1,"reduce":"mean","area_reduce":"state_mean" },
        //{ "name":"mint","interval":"yly","duration":1,"reduce":"mean","area_reduce":"state_mean" },
        //{ "name":"pcpn","interval":"yly","duration":1,"reduce":"sum","area_reduce":"state_mean" },
        { "name":"avgt","interval":"yly","duration":1,"reduce":"mean" },
        { "name":"maxt","interval":"yly","duration":1,"reduce":"mean" },
        { "name":"mint","interval":"yly","duration":1,"reduce":"mean" },
        { "name":"pcpn","interval":"yly","duration":1,"reduce":"sum" },
      ]
    };

    return axios
      //.post("http://grid2.rcc-acis.org/GridData", params)
      .post(`${protocol}//grid2.rcc-acis.org/GridData`, params)
      .then(res => {
        console.log('successful download of livneh data 2000-2013');
        let i
        let data = {}
        let arrFlat
        data['years'] = []
        data['avgt'] = []
        data['maxt'] = []
        data['mint'] = []
        data['pcpn'] = []
        for (i=0; i<res.data.data.length; i++) {
            //data['years'].push(res.data.data[i][0])
            data['years'].push(Date.UTC(res.data.data[i][0],0,1))

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
        console.log("Failed to load livneh data 2000-2013 ", err);
      });
  }

    @action loadProjections = (id) => {
        this.emptyProjectionData()
        this.emptyLivnehData()
        this.loadLivnehData(id);
        this.loadProjections_2000_2100(id,'rcp85','mean');
        this.loadProjections_2000_2100(id,'rcp85','max');
        this.loadProjections_2000_2100(id,'rcp85','min');
        this.loadProjections_2000_2100(id,'rcp45','mean');
        this.loadProjections_2000_2100(id,'rcp45','max');
        this.loadProjections_2000_2100(id,'rcp45','min');
    }

    @action climview_loadData = (getObs,getProj,uid) => {
        // getObs: boolean, whether to load observations
        // getProj: boolean, whether to load projections
        if (getObs) {this.loadPastData(uid)};
        if (getObs) {this.loadPresentData(uid)};
        if (getObs) {this.loadPresentPrecip(uid)};
        if (getObs) {this.loadPresentExtremes(uid)};
        if (getProj) {this.loadProjections(this.getStateId)};
    }

    // run these on initial load
    //constructor() {
    //    this.downloadStationInfo()
    //}

}
