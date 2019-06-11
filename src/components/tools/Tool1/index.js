///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import ChartRangeSelector from './ChartRangeSelector'
import VarPicker from './VarPicker'
//import ToolSelect from '../common/ToolSelect'
//import OutputSelect from '../common/OutputSelect'
import VarPopover from './VarPopover'
//import WxCharts from './WxCharts'
import PastCharts from './PastCharts'
import PresentCharts from './PresentCharts'
import FutureCharts from './FutureCharts'
import WxTables from './WxTables'

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
        if (app.getOutputType==='chart' && app.getChartView==='past') { display = <PastCharts/> }
        if (app.getOutputType==='chart' && app.getChartView==='present') { display = <PresentCharts/> }
        if (app.getOutputType==='chart' && app.getChartView==='future') { display = <FutureCharts/> }
        //if (app.getOutputType==='chart') { display = <WxCharts/> }
        if (app.getOutputType==='table') { display = <WxTables /> }
        let display_VarPicker;
        if (app.getOutputType==='chart') { display_VarPicker = <VarPicker /> }
        if (app.getOutputType==='table') { display_VarPicker = null }
        //let display_ToolSelect;
        //if (app.getOutputType==='chart') { display_ToolSelect = <ToolSelect /> }
        //if (app.getOutputType==='table') { display_ToolSelect = null }
        //let display_OutputSelect;
        //if (app.getOutputType==='chart') { display_OutputSelect = <OutputSelect /> }
        //if (app.getOutputType==='table') { display_OutputSelect = null }
        let display_VarPopover;
        if (app.getOutputType==='chart') { display_VarPopover = <VarPopover /> }
        if (app.getOutputType==='table') { display_VarPopover = null }

        return (
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container item direction="row" justify="center" alignItems="center">
                <ChartRangeSelector/>
              </Grid>
              <Grid container item justify="center" alignItems="center">
                <Grid item className="nothing" xs={0} md={3}>
                  <Hidden smDown>
                    <Typography
                      color="inherit"
                      style={{ borderRight: '0.1em solid black', padding: '0.5em' }}
                    >
                      {display_VarPicker}
                    </Typography>
                  </Hidden>
                </Grid>
                <Grid item container className="nothing" direction="row" justify="center" xs={12} md={9}>
                    <Grid item>
                      <Hidden mdUp>
                        {display_VarPopover}
                      </Hidden>
                    </Grid>
                    <Grid item>
                        <LoadingOverlay
                          active={app.isPastLoading}
                          spinner
                          background={'rgba(255,255,255,1.0)'}
                          color={'rgba(34,139,34,1.0)'}
                          spinnerSize={'10vw'}
                          >
                            {display}
                        </LoadingOverlay>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
        );
    }
}

export default Tool1;
