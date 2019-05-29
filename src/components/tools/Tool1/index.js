///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import VarPicker from './VarPicker'
//import ToolSelect from '../common/ToolSelect'
//import OutputSelect from '../common/OutputSelect'
import VarPopover from './VarPopover'
import WxCharts from './WxCharts'
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

    render() {

        let display;
        if (app.getOutputType==='chart') { display = <WxCharts /> }
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
            <Grid container justify="center" alignItems="center">
                <Grid item className="nothing" xs={0} md={2}>
                  <Hidden smDown>
                    {display_VarPicker}
                  </Hidden>
                </Grid>
                <Grid item container className="nothing" direction="row" justify="center" xs={12} md={10}>
                    <Grid item>
                      <Hidden mdUp>
                        {display_VarPopover}
                      </Hidden>
                    </Grid>
                    <Grid item>
                        <LoadingOverlay
                          active={app.wxgraph_dataIsLoading}
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
        );
    }
}

export default Tool1;
