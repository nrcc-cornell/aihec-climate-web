///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
//import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
//import Grid from '@material-ui/core/Grid';
import Highcharts from 'highcharts/highstock';
//import HC_exporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official';

//Components

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

//require("highcharts/modules/exporting")(Highcharts);

var app;

@inject('store') @observer
class PastCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.chart;
        this.exportChart = () => {
          this.chart.exportChart();
        };
    }

    //componentDidMount() {
    //  this.chart = this.refs.chart.chart;
    //}

    render() {

        let varName = app.wxgraph_getVar
        let varLabel = app.wxgraph_getVarLabels[app.wxgraph_getVar]
        let station = (app.getPastData) ? app.getPastData['stn'][0] : ''
        let today = new Date()

        var odata = app.getPastData

        let createPastSeries = (y,a) => {
            let i
            let oseries = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    oseries.push([y[i],a[i]])
                };
            }
            return oseries;
        }

        function tooltipFormatter() {
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                //console.log(item);
                if ( item.series.name.includes("range") ) {
                    tips += '<br/>' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    //tips += '<br/><span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span> : ' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0);
                } else {
                    tips += '<br/>' + item.y.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        if (!app.isPastLoading && app.getPastData['date']!=[]) {

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
          title: {
            text: varLabel+' @ '+station
          },
          exporting: {
            //showTable: true,
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
          legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
          xAxis: { type: 'datetime', crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          series: [{
              name: app.wxgraph_getVarLabels[app.wxgraph_getVar],
              data: (app.getPastData['date']!=[]) ? createPastSeries(odata['date'],odata[varName]) : [],
              color: '#000000',
              step: false,
              lineWidth: 0,
              marker: { enabled: true },
              visible: app.chartViewIsPast,
              showInLegend: app.chartViewIsPast,
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

        };

    }
}

export default PastCharts;

