///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
//import Radio from '@material-ui/core/Radio';
//import RadioGroup from '@material-ui/core/RadioGroup';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

import StationPickerMap from '../../common/StationPickerMap';
import VarPicker from '../VarPicker';
import ScenarioPicker from '../ScenarioPicker';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    //margin: theme.spacing.unit * 3,
    margin: theme.spacing.unit,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  button: {
    color: green[500],
  },
});

var app;
var history;

@inject('store') @observer
class UserInput extends React.Component {
  constructor(props) {
      super(props);
      app = this.props.store.app;
      history = this.props.history;
      // set the station box to 4x4 degrees
      //app.setStationBox(4.,4.);
      //console.log('getStationBox');
      //console.log(app.getStationBox);
  }

  onChangeClick = () => {
    app.setActivePage(0);
    history.push('/');
  }

  getStationBox = (width,height) => {
      let sLat = parseFloat(app.getNation.ll[0]) - (height/2.)
      let nLat = parseFloat(app.getNation.ll[0]) + (height/2.)
      let wLon = parseFloat(app.getNation.ll[1]) - (width/2.)
      let eLon = parseFloat(app.getNation.ll[1]) + (width/2.)
      return [wLon.toString(),sLat.toString(),eLon.toString(),nLat.toString()].join(',')
  }

  render() {
    const { classes } = this.props;
    //let v = app.wxgraph_getVar;

    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={24}>
        <Grid container item direction="column" alignItems="center" spacing={8}>
          <Grid item>
            <Button className={classes.button} onClick={this.onChangeClick}>
              Change Nation
            </Button>
          </Grid>
          <Grid item>
            {app.wxgraph_getVar &&
              <StationPickerMap type={app.wxgraph_getVar} period={['2019-04-01','2019-06-01']} bounds={this.getStationBox(4.,4.)} />
            }
          </Grid>
        </Grid>
        <Grid item>
          <VarPicker />
        </Grid>
        <Grid item>
          {app.chartViewIsFuture &&
            <ScenarioPicker />
          }
        </Grid>
      </Grid>
    );
  }
}

UserInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(UserInput));
