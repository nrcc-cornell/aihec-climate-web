///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
//import Grid from '@material-ui/core/Grid';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

//Components
//import TimeFrameButtonGroup from '../TimeFrameButtonGroup'
import WxChartTitle from '../WxChartTitle'

// Styles
import '../../../../styles/WxCharts.css';

var app;

@inject('store') @observer
class WxCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    getDataForVar = () => {
        let dataArr=[]
        let inData = app.wxgraph_getClimateSummary
        inData.forEach(function(d) {
          dataArr.push(d[app.wxgraph_var])
        })
        return dataArr
    }

    render() {

        let varLabel = app.wxgraph_getVarLabels[app.wxgraph_getVar]
        let station = app.wxgraph_getClimateSummary[0]['stn']

        let formatXAxisForDate = (tickItem) => {
            return moment(tickItem).format('YYYY')
        }

        const options = {
          title: {
            text: varLabel+' @ '+station
          },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          xAxis: { type: 'datetime', startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          series: [{
              name: app.wxgraph_getVarLabels[app.wxgraph_getVar], data: this.getDataForVar(),  color: '#0000FF', step: false, lineWidth: 2, marker: { enabled: false }
          }]
        };

        return (
          <div id="wx-chart">

            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />

          </div>


        );

    }
}

export default WxCharts;

