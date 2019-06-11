///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

import StationPickerMap from '../../common/StationPickerMap';

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
class VarPicker extends React.Component {
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
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={24}>
        <Grid container item direction="column" alignItems="center" spacing={8}>
          <Grid item>
            <Button className={classes.button} onClick={this.onChangeClick}>
              Change Nation
            </Button>
          </Grid>
          <Grid item>
            <StationPickerMap/>
          </Grid>
        </Grid>
        <Grid item>
      <div className={classes.root}>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="variable"
          name="variable"
          value={app.wxgraph_getVar}
          onChange={app.wxgraph_setVarFromRadioGroup}
          column
        >
          <FormControlLabel
            value="avgt"
            control={<Radio color="primary" />}
            label="Ave Temperature"
            labelPlacement="right"
          />
          <FormControlLabel
            value="maxt"
            control={<Radio color="primary" />}
            label="Max Temperature"
            labelPlacement="right"
          />
          <FormControlLabel
            value="mint"
            control={<Radio color="primary" />}
            label="Min Temperature"
            labelPlacement="right"
          />
          <FormControlLabel
            value="pcpn"
            control={<Radio color="primary" />}
            label="Total Precipitation"
            labelPlacement="right"
          />
        </RadioGroup>
      </FormControl>
      </div>
        </Grid>
      </Grid>
    );
  }
}

VarPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(VarPicker));
