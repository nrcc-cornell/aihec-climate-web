///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
//import moment from 'moment';
//import Grid from '@material-ui/core/Grid';
//import Highcharts from 'highcharts/highstock';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

//Components

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

var app;

@inject('store') @observer
class PresentCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        //this.chart;
        this.exportChart = () => {
          this.chart.exportChart();
        };
    }

    //componentDidMount() {
    //  this.chart = this.refs.chart.chart;
    //}

    render() {

        let station = (app.getPresentData) ? app.getPresentData['stn'] : ''
        let cdata = app.getPresentData
        let edata = app.getPresentExtremes

        let createSeries = (y,a) => {
            let i
            let oseries = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    oseries.push([y[i],a[i]])
                };
            }
            return oseries;
        }

        let createRanges = (y,a,b) => {
            let i;
            let ranges = [];
            if (a && b) {
                for (i=0; i<y.length; i++) {
                    ranges.push([y[i],a[i],b[i]])
                };
            }
            return ranges;
        }

        function tooltipFormatter() {
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %d, %Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                //console.log(item);
                if ( item.series.name.includes("Range") ) {
                    tips += '<br/>' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    //tips += '<br/><span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span> : ' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0);
                } else {
                    tips += '<br/>' + item.y.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        if (!app.isPresentLoading && app.getPresentData['date']!==[] && app.getPresentExtremes['date']!==[]) {

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
            text: (cdata.stn==="" || edata.stn==="") ? 'No Data Available - Please try another station.' : 'Recent temperature @ '+station
          },
          exporting: {
            enabled: true,
            showTable: false,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
            csv: {
              dateFormat: "%Y-%m-%d"
            },
            //menuItemDefinitions:{
            //  downloadCSV: {
            //    onclick: function() {
            //      this.getCSV()
            //    },
            //    text: 'Download CSV',
            //  }
            //},
            //buttons:{
            //  contextButton:{
            //    menuItems: ['downloadPNG', 'downloadSVG', 'separator', 'downloadCSV']
            //  }
            //},
          },
          accessibility: {
            description: 'Shows how temperatures over the last 90 days compare to those normally observed over the same period. Temperature records are also provided for each day, showing if temperatures from this year approached or set new all-time records.'
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',
              crosshairs: { width:1, color:"#ff0000", snap:true }, formatter:tooltipFormatter },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: { align: 'center', floating: true, verticalAlign: 'bottom', layout: 'horizontal', x: 0, y: 0 },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                   dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
            },
          yAxis: {
              title:{ text:'Temperature (°F)', style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
              name: 'Observed Range',
              data: (!app.isPresentLoading) ? createRanges(cdata['obs']['date'],cdata['obs']['mint'],cdata['obs']['maxt']): [],
              type: 'columnrange',
              linkedTo: ':previous',
              color: '#000000',
              step: false,
              lineWidth: 0,
              marker: {
                enabled: false,
              },
              zIndex: 1,
              //visible: !app.isPresentLoading && app.chartViewIsPresent,
              showInLegend: true,
          },{
              name: 'Normal Range',
              data: (!app.isPresentLoading) ? createRanges(cdata['normal']['date'],cdata['normal']['mint'],cdata['normal']['maxt']): [],
              //marker : {symbol: 'square', radius: 12 },
              type: "arearange",
              linkedTo: ':previous',
              lineWidth:0,
              color: 'rgba(0,0,0,0.1)',
              fillColor: 'rgba(0,0,0,0.1)',
              fillOpacity: 0.1,
              zIndex: 0,
              marker: {
                enabled: false,
                symbol: 'square',
                radius: 2,
              },
              //visible: !app.isPresentLoading && app.chartViewIsPresent,
              showInLegend: true,
          },{
              name: 'Record High',
              data: (!app.isPresentLoading) ? createSeries(edata['extreme']['date'],edata['extreme']['maxt']): [],
              type: "line",
              lineWidth:0,
              //linkedTo: ':previous',
              color: '#ff0000',
              fillOpacity: 0.0,
              zIndex: 2,
              marker: {
                enabled: true,
                symbol: 'circle',
                radius: 2,
              },
              //visible: !app.isPresentLoading && app.chartViewIsPresent,
              showInLegend: app.chartViewIsPresent,
          },{
              name: 'Record Low',
              data: (!app.isPresentLoading) ? createSeries(edata['extreme']['date'],edata['extreme']['mint']): [],
              type: "line",
              lineWidth:0,
              linkedTo: ':previous',
              color: '#0000ff',
              fillOpacity: 0.0,
              zIndex: 2,
              marker: {
                enabled: true,
                symbol: 'circle',
                radius: 2,
              },
              //visible: !app.isPresentLoading && app.chartViewIsPresent,
              showInLegend: app.chartViewIsPresent,
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

export default PresentCharts;

