///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
//import Grid from '@material-ui/core/Grid';

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

    render() {

        let formatXAxisForDate = (tickItem) => {
            return moment(tickItem).format('YYYY')
        }

        return (
          <div id="wx-chart">
              <WxChartTitle />

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={app.wxgraph_getClimateSummary} syncId="anyId"
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date" tickFormatter={formatXAxisForDate} />
          <YAxis
              //domain={[Math.floor(Math.min(...app.wxgraph_getClimateSummary[0]['mint']))-2, Math.ceil(Math.max(...app.wxgraph_getClimateSummary[0]['maxt']))+2]}
              domain={[Math.min(...app.wxgraph_getClimateSummary[0]['mint']), Math.max(...app.wxgraph_getClimateSummary[0]['maxt'])]}
              label={{ value: app.wxgraph_getVarUnits[app.wxgraph_getVar+'_units'], angle: -90, position:'insideLeft', offset: 20 }}
          />
          <Tooltip/>
          <Line name={app.wxgraph_getVarLabels[app.wxgraph_getVar]} type='monotone' dataKey={app.wxgraph_getVar} stroke='#8884d8' fill='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
      </div>


        );

    }
}

export default WxCharts;

