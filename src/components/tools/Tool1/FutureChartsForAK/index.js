///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

var app;

@inject('store') @observer
class FutureChartsForAK extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.exportChart = () => {
          this.chart.exportChart();
        };
    }

    getTimescaleText = (t,s,m) => {
      // t: timescale selected
      // s: season selected
      // m: month selected
      let result
      let periodNames = {
        'jan':'January','feb':'February','mar':'March','apr':'April',
        'may':'May','jun':'June','jul':'July','aug':'August',
        'sep':'September','oct':'October','nov':'November','dec':'December',
        'djf':'Dec-Jan-Feb','mam':'Mar-Apr-May','jja':'Jun-Jul-Aug','son':'Sep-Oct-Nov'
      }
      if (t==='annual') {
        result = 'Annual'
      } else if (t==='seasonal') {
        result = periodNames[s]
      } else if (t==='monthly') {
        result = periodNames[m]
      }
      return result
    }

    getScenarioText = (s) => {
      if (s==='rcp85') {
        return 'High Emission Model Scenario (RCP 8.5)'
      } else {
        return 'Low Emission Model Scenario (RCP 4.5)'
      }
    }

    render() {

        let varName = this.props.variable
        let varLabel = app.wxgraph_getVarLabels[this.props.variable]
        let nation = this.props.nation.name
        let startYear = new Date(1980,0,1)

        let scenario = this.props.scenario

        var pdata = app.getProjectionDataAK

        let createProjectionSeries = (y,a,syear) => {
            let i
            let series = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    if (y[i]>=syear) {series.push([y[i],a[i]])};
                };
            }
            return series;
        }

        function tooltipFormatter() {
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                if ( item.series.name.includes("range") ) {
                    tips += '<br/>' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                } else {
                    tips += '<br/>' + item.y.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        if (!app.isProjectionLoading && app.getProjectionDataAK['date']!==[]) {

        const options = {
                 plotOptions: {
                     line: {
                         animation: true,
                     },
                     series: {
                         type: 'line',
                         showCheckbox: false,
                         pointStart: Date.UTC(1850,1,1),
                         animation: true,
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                             states: {
                                 hover: {
                                     enabled: false
                                 }
                             }
                         },
                         states: {
                             hover: {
                                 enabled: false,
                                 halo: {
                                     size: 0
                                 }
                             }
                         },
                         events: {
                             checkboxClick: function(event) {
                                 if (event.checked) {
                                     this.show();
                                     //this.legendSymbol.show();
                                 } else {
                                     this.hide();
                                     //this.legendSymbol.hide();
                                 }
                             }
                         }
                     }
                 },
          chart: {
            marginBottom: 70
          },
          title: {
            text: varLabel+' @ '+nation
          },
          subtitle: {
            //text: (this.props.scenario==='rcp85') ? 'High Emission Model Scenario (RCP 8.5)' : 'Low Emission Model Scenario (RCP 4.5)'
            //text: this.getTimescaleText(this.props.timescale,this.props.season,this.props.month) + ' : ' + this.getScenarioText(this.props.scenario)
            text: this.getScenarioText(this.props.scenario) + ' : ' + this.getTimescaleText(this.props.timescale,this.props.season,this.props.month)
          },
          exporting: {
            //showTable: true,
            showTable: app.getOutputType==='chart' ? false : true,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',
              crosshairs: { width:1, color:"#ff0000", snap:true }, formatter:tooltipFormatter },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          //legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
          legend: { align: 'center', floating: true, verticalAlign: 'bottom', layout: 'horizontal', x: 0, y: 0 },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: false, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
               plotLines:[{
                   color: '#000000',
                   width: 2,
                   value: Date.UTC(2005),
                   label: {text:'2005: Projections Begin', verticalAlign:'bottom', rotation:0, x:6, y:-6},
                   zIndex: 2,
               }],
               dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
            },
          yAxis: {
               //min: (!app.isProjectionLoadingAK) ? Math.min(...pdata['rcp85']['min'][varName]) : null,
               //max: (!app.isProjectionLoadingAK) ? Math.max(...pdata['rcp85']['max'][varName]) : null,
               title:{ text:app.wxgraph_getVarLabels[this.props.variable]+' ('+app.wxgraph_getVarUnits[this.props.variable]+')', style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
              name: 'GFDL-CM3',
              data: (!app.isProjectionLoading) ? createProjectionSeries(pdata[scenario]['gfdl-cm3']['years'],pdata[scenario]['gfdl-cm3'][varName],startYear): [],
              type: "line",
              zIndex: 24,
              lineWidth: 1,
              color: "#000000",
              shadow: false,
              marker: { enabled: false, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" },
              zoneAxis: 'x',
              zones: [{
                   value: Date.UTC(2005),
                   color: 'rgba(0,0,255,0.2)',
                   fillColor: 'rgba(0,0,255,0.2)',
                }, {
                   color: 'rgba(0,0,255,1.0)',
                   fillColor: 'rgba(0,0,255,1.0)',
                }]
          },{
              name: 'NCAR-CCSM4',
              data: (!app.isProjectionLoading) ? createProjectionSeries(pdata[scenario]['ncar-ccsm4']['years'],pdata[scenario]['ncar-ccsm4'][varName],startYear): [],
              type: "line",
              zIndex: 24,
              lineWidth: 1,
              color: "#000000",
              shadow: false,
              marker: { enabled: false, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" },
              zoneAxis: 'x',
              zones: [{
                   value: Date.UTC(2005),
                   color: 'rgba(255,0,0,0.2)',
                   fillColor: 'rgba(255,0,0,0.2)',
                }, {
                   color: 'rgba(255,0,0,1.0)',
                   fillColor: 'rgba(255,0,0,1.0)',
                }]
          }]
        };

        return (
          <div id="wx-chart">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              options={options}
            />
          </div>
        );

        } else {

        return(false);

        }

    }
}

FutureChartsForAK.propTypes = {
  variable: PropTypes.string.isRequired,
  nation: PropTypes.object.isRequired,
  scenario: PropTypes.string.isRequired,
  timescale: PropTypes.string.isRequired,
  season: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
}

export default FutureChartsForAK;

