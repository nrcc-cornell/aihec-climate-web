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

class VarPicker extends Component {

    //constructor(props) {
    //    super(props);
    //}

    render() {
      const { classes } = this.props;

      if (this.props.selected_view==='past' || this.props.selected_view==='future') {

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="variable">Variable</InputLabel>
              <Select
                value={this.props.value}
                onChange={this.props.onchange}
                inputProps={{
                  name: 'variable',
                  id: 'variable',
                }}
              >
                <MenuItem value='avgt'>Ave Temperature</MenuItem>
                <MenuItem value='maxt'>Max Temperature</MenuItem>
                <MenuItem value='mint'>Min Temperature</MenuItem>
                <MenuItem value='pcpn'>Total Precipitation</MenuItem>
              </Select>
            </FormControl>
          </form>
        )

      } else if (this.props.selected_view==='present') {

        // check to see if variable is valid for this view. Reset if necessary.
        if (this.props.value==='maxt' || this.props.value==='mint') {
          this.props.onchange({'target':{'value':'avgt'}});
        }

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="variable">Variable</InputLabel>
              <Select
                value={this.props.value}
                onChange={this.props.onchange}
                inputProps={{
                  name: 'variable',
                  id: 'variable',
                }}
              >
                <MenuItem value='avgt'>Temperature</MenuItem>
                <MenuItem value='pcpn'>Precipitation</MenuItem>
              </Select>
            </FormControl>
          </form>
        )

      } else {

        return (false);

      }
    }

};

VarPicker.propTypes = {
  selected_view: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired,
}

export default withStyles(styles)(VarPicker);
