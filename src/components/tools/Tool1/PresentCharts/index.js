///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
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
class PresentCharts extends Component {

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
        let station = (app.getPresentData) ? app.getPresentData['stn'] : ''
        let today = new Date()

        var cdata = app.getPresentData

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

        if (!app.isPresentLoading && app.getPresentData['date']!=[]) {

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
            text: 'Recent conditions @ '+station
          },
          exporting: {
            //showTable: true,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
          },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
          xAxis: { type: 'datetime', startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                   dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
            },
          yAxis: {
              title:{ text:'Temperature', style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
              name: 'Observed Temperature Range',
              //data: (!app.isPresentLoading) ? createSeries(cdata['obs']['date'],cdata['obs']['maxt']) : [],
              data: (!app.isPresentLoading) ? createRanges(cdata['obs']['date'],cdata['obs']['mint'],cdata['obs']['maxt']): [],
              type: 'columnrange',
              color: '#000000',
              step: false,
              lineWidth: 0,
              marker: { enabled: true },
              visible: app.chartViewIsPresent,
              showInLegend: app.chartViewIsPresent,
          },{
              name: 'Normal temperature range',
              data: (!app.isPresentLoading) ? createRanges(cdata['normal']['date'],cdata['normal']['mint'],cdata['normal']['maxt']): [],
              marker : {symbol: 'square', radius: 12 },
              type: "arearange",
              linkedTo: ':previous',
              lineWidth:0,
              color: 'rgba(0,0,0,0.1)',
              fillColor: 'rgba(0,0,0,0.1)',
              fillOpacity: 0.1,
              zIndex: 0,
              visible: app.chartViewIsPresent,
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

        };

    }
}

export default PresentCharts;

