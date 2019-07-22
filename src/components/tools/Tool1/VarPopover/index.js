import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
//import ExtremeSwitch from '../ExtremeSwitch'
//import VarPicker from '../VarPicker'
import UserInput from '../UserInput'
//import OutputSelect from '../../common/OutputSelect'

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2,
  },
});

class VarPopover extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <Button
          variant="text"
          color="secondary"
          size="small"
          onClick={this.handleClick}
        >
          <ExpandMore />
          Select chart details
        </Button>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <UserInput/>
        </Popover>
      </div>
    );
  }
}

VarPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VarPopover);
