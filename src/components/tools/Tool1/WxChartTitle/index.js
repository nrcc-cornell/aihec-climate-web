///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { inject, observer} from 'mobx-react';
import Typography from '@material-ui/core/Typography';

//Components

// Styles
import '../../../../styles/WxChartTitle.css';

var app;

@inject('store') @observer
class WxChartTitle extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let varLabel = app.wxgraph_getVarLabels[app.wxgraph_getVar]
        let station = app.wxgraph_getClimateSummary[0]['stn']

        return (
            <Typography align="center" variant="h6">
                {varLabel+' @ '+station}
            </Typography>
        );

    }
}

export default WxChartTitle;

