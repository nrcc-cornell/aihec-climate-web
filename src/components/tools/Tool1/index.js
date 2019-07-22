///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
//import { spacing } from '@material-ui/system';

// Components
import ChartRangeSelector from './ChartRangeSelector'
//import VarPicker from './VarPicker'
import UserInput from './UserInput'
//import ToolSelect from '../common/ToolSelect'
//import OutputSelect from '../common/OutputSelect'
import VarPopover from './VarPopover'
//import WxCharts from './WxCharts'
import PastCharts from './PastCharts'
import PresentCharts from './PresentCharts'
import PresentChartsPrecip from './PresentChartsPrecip'
import FutureCharts from './FutureCharts'
//import WxTables from './WxTables'

// Styles
import '../../../styles/Tool1Tool.css';

var app;

@inject('store') @observer
class Tool1 extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    componentDidMount() {
        app.climview_loadData(1,1,app.getDefaultStationFromNation.uid);
    }

    render() {

        let display;
        if (app.getChartView==='past') { display = <PastCharts/> }
        if (app.getChartView==='present' && app.wxgraph_getVar==='avgt') { display = <PresentCharts/> }
        if (app.getChartView==='present' && app.wxgraph_getVar==='pcpn') { display = <PresentChartsPrecip/> }
        if (app.getChartView==='future') { display = <FutureCharts/> }
        //if (app.getOutputType==='chart' && app.getChartView==='past') { display = <PastCharts/> }
        //if (app.getOutputType==='chart' && app.getChartView==='present' && app.wxgraph_getVar==='avgt') { display = <PresentCharts/> }
        //if (app.getOutputType==='chart' && app.getChartView==='present' && app.wxgraph_getVar==='pcpn') { display = <PresentChartsPrecip/> }
        //if (app.getOutputType==='chart' && app.getChartView==='future') { display = <FutureCharts/> }
        //if (app.getOutputType==='table') { display = <WxTables /> }
        let display_UserInput = <UserInput />;
        let display_VarPopover = <VarPopover />;
        //let display_UserInput;
        //if (app.getOutputType==='chart') { display_UserInput = <UserInput /> }
        //if (app.getOutputType==='table') { display_UserInput = null }
        //let display_VarPopover;
        //if (app.getOutputType==='chart') { display_VarPopover = <VarPopover /> }
        //if (app.getOutputType==='table') { display_VarPopover = null }

        return (
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item direction="row" justify="center" alignItems="center">
                <ChartRangeSelector/>
              </Grid>
              <Grid container item justify="flex-start" alignItems="flex-start">
                <Hidden mdUp>
                  {display_VarPopover}
                </Hidden>
              </Grid>
              <Grid container item justify="center" alignItems="flex-start">
                <Grid item className="nothing" xs={0} md={3}>
                  <Hidden smDown>
                      {display_UserInput}
                  </Hidden>
                </Grid>
                <Grid item container className="nothing" direction="row" justify="center" xs={12} md={9}>
                    <Grid item>
                     <Typography
                        color="inherit"
                      >
                        <LoadingOverlay
                          active={app.isPastLoading}
                          spinner
                          background={'rgba(255,255,255,1.0)'}
                          color={'rgba(34,139,34,1.0)'}
                          spinnerSize={'10vw'}
                          >
                            {display}
                        </LoadingOverlay>
                      </Typography>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
        );
    }
}

export default Tool1;
