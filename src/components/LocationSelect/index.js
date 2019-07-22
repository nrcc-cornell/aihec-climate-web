///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Hidden from '@material-ui/core/Hidden';

//import ReactModal from 'react-modal';
//import StationPicker from '../../components/StationPicker';
//import NationPicker from '../../components/NationPicker';
//import NationSelect from '../../components/NationSelect';
import ToolSelect from '../tools/common/ToolSelect'
import OutputSelect from '../tools/common/OutputSelect'

// Styles
import '../../styles/LocationSelect.css';

const styles = theme => ({
  button: {
    //margin: theme.spacing.unit,
    //background: green[500],
    //color: green[500],
    color: red[500],
    fontWeight: 'bold',
  },
  titleText: {
    //color: 'black',
    fontSize: '30px',
    fontWeight: 'bold',
    marginTop: '20px'
    //marginBottom: '4px'
    //marginLeft: '24px'
  },
  nationText: {
    //color: 'black',
    fontSize: '20px',
    fontWeight: 'normal',
    //marginBottom: '4px'
    //marginLeft: '24px'
  },
  mainSelect: {
    marginLeft: '16px'
  },
});

var app;
var history;

@inject('store') @observer
class LocationSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    onChangeClick = () => {
      app.setActivePage(0);
      history.push('/');
    }

    render() {

        const { classes } = this.props;

        return (
          <div>
              <Grid container item spacing="3" direction="row" justify="flex-start" alignItems="flex-start" className={classes.mainSelect}>
                <Grid item>
                  <ToolSelect/>
                </Grid>
                <Grid item>
                  <OutputSelect/>
                </Grid>
              </Grid>
              <Grid container item spacing="1" direction="column" justify="flex-start" alignItems="center">
                <Grid item>
                  <Typography variant='h2' className={classes.titleText} noWrap>
                    {app.getToolInfo(app.getToolName).title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h2' className={classes.nationText} noWrap>
                    @ {app.getNation.name}
                    <Hidden mdUp>
                      <Button className={classes.button} variant="text" color="secondary" size="small" onClick={this.onChangeClick}>
                        Change
                      </Button>
                    </Hidden>
                  </Typography>
                </Grid>
              </Grid>
          </div>
        );
    }
}

LocationSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(LocationSelect));
