///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { string } from 'prop-types'

// Components
import LocationSelect from '../../components/LocationSelect';
//import ToolSelect from '../../components/ToolSelect';
//import OutputSelect from '../../components/OutputSelect';
import Tool1 from '../../components/tools/Tool1';
import Tool2 from '../../components/tools/Tool2';
import Tool3 from '../../components/tools/Tool3';
//import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

// Styles
import '../../styles/ToolContents.css';

const styles = theme => ({
  headerText: {
    color: 'Black',
    fontSize: '34px',
    fontWeight: 'normal',
    marginBottom: '4px'
  }
});

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
      //const { classes, theme } = this.props;

      if (app.getNations) {
        return (
            <div className='tool-contents'>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <LocationSelect />
              </Grid>
              <Grid item xs={12}>
                { this.props.name==='climview' && (<Tool1 nation={app.getNation} />) }
                { this.props.name==='tool2' && (<Tool2 />) }
                { this.props.name==='tool3' && (<Tool3 />) }
              </Grid>
            </Grid>
            </div>
        );
      }
    }
}

export default withStyles(styles)(ToolContents);

