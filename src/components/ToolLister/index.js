///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

// Components
import ToolCard from '../../components/ToolCard';

// Styles
//import '../../styles/ToolLister.css';

var app;

@inject('store') @observer
class ToolLister extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <Grid container direction="column" justify="center" spacing={16}>
              <Grid item>
                <ToolCard {...app.getToolInfo('tool1')} />
              </Grid>
              <Grid item>
                <ToolCard {...app.getToolInfo('tool2')} />
              </Grid>
              <Grid item>
                <ToolCard {...app.getToolInfo('tool3')} />
              </Grid>
            </Grid>
        );
    }
}

export default ToolLister;
