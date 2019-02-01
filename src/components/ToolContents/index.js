///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { string } from 'prop-types'

// Components
import LocationSelect from '../../components/LocationSelect';
import ToolSelect from '../../components/ToolSelect';
import OutputSelect from '../../components/OutputSelect';
import Tool1 from '../../components/tools/Tool1';
import Tool2 from '../../components/tools/Tool2';
import Tool3 from '../../components/tools/Tool3';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

// Styles
import '../../styles/ToolContents.css';

var app;

@inject('store') @observer
class ToolContents extends Component {

    static propTypes = {
      name: string,
    }

    static defaultProps = {
      name: "",
    }

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className='tool-contents'>
            <Grid container spacing="8">
              <Grid item xs={12}>
                 <Typography variant="h5">
                    Climate Tools for Tribal Nations
                 </Typography>
              </Grid>
              <Grid item xs={12}>
                <LocationSelect />
              </Grid>
              <Grid item xs={9} sm={6}>
                <ToolSelect names={app.toolNameArray} />
              </Grid>
              <Grid item xs={9} sm={4}>
                <OutputSelect />
              </Grid>
              <Grid item xs={12}>
                { this.props.name==='tool1' && (<Tool1 />) }
                { this.props.name==='tool2' && (<Tool2 />) }
                { this.props.name==='tool3' && (<Tool3 />) }
              </Grid>
            </Grid>
            </div>
        );
    }
}

export default ToolContents;

