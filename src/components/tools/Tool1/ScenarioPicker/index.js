///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 120,
  },
});


class ScenarioPicker extends Component {

    //constructor(props) {
    //    super(props);
    //}

    render() {
        const { classes } = this.props;

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="scenario">Model Scenario</InputLabel>
              <Select
                value={this.props.value}
                onChange={this.props.onchange}
                inputProps={{
                  name: 'scenario',
                  id: 'scenario',
                }}
              >
                <MenuItem value='rcp85'>High Emissions (RCP 8.5)</MenuItem>
                <MenuItem value='rcp45'>Low Emissions (RCP 4.5)</MenuItem>
              </Select>
            </FormControl>
          </form>
        )
    }

};

ScenarioPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired,
}

export default withStyles(styles)(ScenarioPicker);
