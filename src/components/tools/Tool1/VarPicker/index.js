import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
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
    //margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    //marginTop: theme.spacing(2),
  },
});

var app;

@inject("store") @observer
class VarPicker extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
      const { classes } = this.props;

      if (app.chartViewIsPast || app.chartViewIsFuture) {

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="variable">Variable</InputLabel>
              <Select
                value={app.wxgraph_getVar}
                onChange={app.wxgraph_setVarFromInput}
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

      } else if (app.chartViewIsPresent) {

        // check to see if variable is valid for this view. Reset if necessary.
        if (app.wxgraph_getVar==='maxt' || app.wxgraph_getVar==='mint') {
          app.wxgraph_setVar('avgt');
        }

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="variable">Variable</InputLabel>
              <Select
                value={app.wxgraph_getVar}
                onChange={app.wxgraph_setVarFromInput}
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

export default withStyles(styles)(VarPicker);
