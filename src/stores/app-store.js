///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import { observable, computed, action } from 'mobx';
import axios from 'axios';
import moment from 'moment';

import us_aiannh_pilot from '../assets/us_aiannh_pilot.json';

const protocol = window.location.protocol;

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
            if (this.getToolName==='climview') { this.wxgraph_downloadData() }
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
    //@action setSelectedToolName = (t) => {
    //        if (this.getToolName !== t) {
    //            this.toolName = t.value;
    //            if (this.getToolName==='climview') { this.wxgraph_downloadData() }
    //        }
    //    };
    // set toolName from select menu
    @action setSelectedToolName = (e) => {
            if (this.getToolName !== e.target.value) {
                this.toolName = e.target.value;
                if (this.getToolName==='climview') { this.wxgraph_downloadData() }
            }
        };
    @computed get getToolName() { return this.toolName };

    getToolInfo = (name) => {
            let title, tagline, thumbnail, url, onclick
            let pathToImages = './thumbnails/'
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

    @computed get getNationGeojson() { return us_aiannh_pilot };

    /// manage currently active nation
    // get currently selected nation object (for nation select and nation picker)
    @observable nation = {"name":"Pine Ridge Reservation","ll":["43.3449996","-102.0818655"]}
    @action setNation = (l) => {
        if (this.getNation.name !== l.toString()) {
            this.nation = this.getNations.find(obj => obj.name === l);
            if (this.getToolName==='climview') { this.wxgraph_downloadData() }
        };
    }
    // set nation from select menu
    @action setSelectedNation = (t) => {
            if (this.getNation.name !== t.value) {
                this.nation = this.getNations.find(obj => obj.name.toString() === t.value);
                if (this.getToolName==='climview') { this.wxgraph_downloadData() }
            }
            if (this.getShowModalMap) { this.setShowModalMap(false) };
        };
    @computed get getNation() { return this.nation };

    // manage list of all nations
    @computed get getNations() {
        let nationsObject = this.getNationGeojson
        let nations = nationsObject['features'].map( function(item) {return {'name':item.properties.NAMELSAD,'ll':[item.properties.INTPTLAT,item.properties.INTPTLON]} } );
        return nations
    };

    @computed get getStationFromNation() {
        let stns = {
            "Flathead Reservation": "246640 2",
            "L'Anse Reservation": "14858 1",
            "Pine Ridge Reservation": "391972 2",
            "Tohono O'odham Nation Reservation": "024675 2",
            "Navajo Nation Reservation": "021248 2",
            "Fort Belknap Reservation": "241722 2",
            "Leech Lake Reservation": "214652 2",
            "Crow Reservation": "241297 2",
            "Spirit Lake Reservation": "325730 2",
            "Menominee Reservation": "477708 2",
            "Fond du Lac Reservation": "211630 2",
            "Lummi Reservation": "451484 2",
            "Standing Rock Reservation": "396712 2",
            "Turtle Mountain Reservation": "329445 2",
            "Blackfeet Indian Reservation": "24137 1",
            "Winnebago Reservation": "14943 1",
            "Barrow ANVSA": "27502 1",
            "Creek OTSA": "13968 1",
        }
        return stns[this.getNation.name]
    };

    @action nationOnEachFeature = (feature, layer) => {
        let nation = layer.bindPopup(feature.properties.NAMELSAD);
        layer.on({
            click: () => {
                this.setNation(feature.properties.NAMELSAD);
                if (this.getShowModalMap) { this.setShowModalMap(false) };
            },
            mouseover: () => {
                    nation.openPopup();
                },
            mouseout: () => {
                    nation.closePopup();
                },
        })
    }

    @action nationOnEachFeature_explorer = (feature, layer) => {
        let nation = layer.bindPopup(feature.properties.NAMELSAD);
        layer.on({
            mouseover: () => {
                    nation.openPopup();
                },
            mouseout: () => {
                    nation.closePopup();
                },
        })
    }

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

    // show the location picker modal map
    @observable showModalMap=false;
    @action setShowModalMap = (b) => {
            this.showModalMap=b
            if (!this.getShowModalMap) {
            //    if (this.getToolName==='gddtool') { this.gddtool_downloadData() }
            //    if (this.getToolName==='climview') { this.wxgraph_downloadData() }
            }
        }
    @computed get getShowModalMap() {
        return this.showModalMap
    }

    ///////////////////////////////////////////////////////
    /// Tool: Long-term weather grapher
    ///////////////////////////////////////////////////////
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
    @computed get wxgraph_getVar() { return this.wxgraph_var };

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
            avgt_units : '°F',
            maxt_units : '°F',
            mint_units : '°F',
            pcpn_units : 'inches',
        };
        return varUnits
    }

    @computed get wxgraph_getVarLabels() {
        return {
          avgt : 'Ave Air Temperature',
          maxt : 'Max Air Temperature',
          mint : 'Min Air Temperature',
          pcpn : 'Total Precipitation',
        };
    }

    // climate data saved in this var
    // - the full request downloaded from ACIS
    @observable wxgraph_climateData = null;
    @action wxgraph_setClimateData = (res) => {
        this.wxgraph_climateData = res
    }
    @computed get wxgraph_getClimateData() {
        return this.wxgraph_climateData
    }

    // summary for weather grapher daily data saved here
    // - data includes:
    //     date : date of observation
    //     avgt : annual average temperature (F)
    //     mint : annual average min temperature (F)
    //     maxt : annual average max temperature (F)
    //     pcpn : annual accumulated precipitation (in)
    //     snow : annual accumulated snowfall (in)
    @observable wxgraph_climateSummary = [{
                'date': moment().format('YYYY-MM-DD'),
                'avgt': NaN,
                'maxt': NaN,
                'mint': NaN,
                'pcpn': NaN,
                'snow': NaN,
                }];
    @action wxgraph_setClimateSummary = (m) => {
        let data = this.wxgraph_getClimateData
        let dataObjArray = []
        data.forEach(function (d) {
            dataObjArray.push({
                'stn':m.name+', '+m.state,
                'date':d[0],
                'avgt':(d[1]==='M') ? NaN : parseFloat(d[1]),
                'maxt':(d[2]==='M') ? NaN : parseFloat(d[2]),
                'mint':(d[3]==='M') ? NaN : parseFloat(d[3]),
                'pcpn':(d[4]==='M') ? NaN : ((d[4]==='T') ? 0.00 : parseFloat(d[4])),
                'snow':NaN,
            })
        });

        this.wxgraph_climateSummary = dataObjArray
    }
    @computed get wxgraph_getClimateSummary() {
        return this.wxgraph_climateSummary
    }

    // Wx Grapher tool data download - set parameters
    @computed get wxgraph_getAcisParams() {
            let elems
            //let numdays
            elems = [
                {"name":"avgt","interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"maxt","interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"mint","interval":[1],"duration":"yly","reduce":{"reduce":"mean"},"maxmissing":10},
                {"name":"pcpn","interval":[1],"duration":"yly","reduce":{"reduce":"sum"},"maxmissing":10},
            ]
            return {
                //"sid":this.getLocation.uid.toString(),
                "sid": this.getStationFromNation,
                //"meta":"sids,name,state,ll,valid_daterange",
                "meta":"name,state",
                "sdate":"por",
                "edate":"por",
                "elems":elems
            }
        }

    // data is loading - boolean - to control the spinner
    @observable wxgraph_dataIsLoading = false
    @action wxgraph_setDataIsLoading = (b) => {
        this.wxgraph_dataIsLoading = b;
    }
    @computed get wxgraph_getDataIsLoading() {
        return this.wxgraph_dataIsLoading;
    }

    // GDD tool data download - download data using parameters
    @action wxgraph_downloadData = () => {
        console.log("Call wxgraph_downloadData")
        this.wxgraph_setDataIsLoading(true);
        return axios
          .post(`${protocol}//data.rcc-acis.org/StnData`, this.wxgraph_getAcisParams)
          .then(res => {
            console.log('SUCCESS downloading from ACIS');
            console.log(res);
            this.wxgraph_setClimateData(res.data.data.slice(0));
            this.wxgraph_setClimateSummary(res.data.meta)
            this.wxgraph_setDataIsLoading(false);
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
    }

    // run these on initial load
    //constructor() {
    //    this.downloadStationInfo()
    //}

}
