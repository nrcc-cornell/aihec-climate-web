///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';
//import Grid from '@material-ui/core/Grid';

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
});

var app;

@inject('store') @observer
class VarPicker extends React.Component {
  constructor(props) {
      super(props);
      app = this.props.store.app;
  }

  render() {
    const { classes } = this.props;

    return (
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
          <FormControlLabel
            value="snow"
            control={<Radio color="primary" />}
            label="Total Snowfall"
            labelPlacement="right"
            disabled
          />
        </RadioGroup>
      </FormControl>
      </div>
    );
  }
}

VarPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VarPicker);
