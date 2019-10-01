///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
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


class TimescalePicker extends Component {

    //constructor(props) {
    //    super(props);
    //}

    render() {
        const { classes } = this.props;

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="timescale">Timescale</InputLabel>
              <Select
                value={this.props.value}
                onChange={this.props.onchange}
                inputProps={{
                  name: 'timescale',
                  id: 'timescale',
                }}
              >
                <MenuItem value='annual'>Annual</MenuItem>
                <MenuItem value='seasonal'>Seasonal</MenuItem>
                <MenuItem value='monthly'>Monthly</MenuItem>
              </Select>
            </FormControl>
          </form>
        )
    }

};

TimescalePicker.propTypes = {
  value: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired,
}

export default withStyles(styles)(TimescalePicker);
