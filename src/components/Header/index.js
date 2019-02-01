///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    marginLeft: 0,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 0,
    //[theme.breakpoints.up('sm')]: {
    //  display: 'none',
    //},
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    //padding: theme.spacing.unit * 3,
  },
});

//var app;

@inject('store') @observer
class FullWidthTabs extends React.Component {

  //constructor(props) {
  //    super(props);
  //    app = this.props.store.app;
  //}

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    //this.setState({ value });
    this.props.store.app.setActivePage(value);
  };

  handleChangeHome = () => {
    this.setState({value: 0});
    this.props.store.app.setActivePage(0);
  };

  handleChangeAbout = () => {
    this.setState({value: 1});
    this.props.store.app.setActivePage(1);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              (LOGO / TITLE)
            </Typography>
            <section className={classes.rightToolbar}>
              <Hidden smUp implementation="css">
                <IconButton
                  color="inherit"
                  aria-label="Home"
                  onClick={this.handleChangeHome}
                  className={classes.homeButton}
                >
                  <HomeIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="About AIHEC"
                  onClick={this.handleChangeAbout}
                  className={classes.infoButton}
                >
                  <InfoIcon />
                </IconButton>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Tabs
                  value={this.props.store.app.getActiveTabIndex}
                  onChange={this.handleChange}
                  //indicatorColor="secondary"
                  //textColor="secondary"
                  variant="fullWidth"
                >
                  <Tab label="HOME" />
                  <Tab label="ABOUT" />
                </Tabs>
              </Hidden>
            </section>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  //theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthTabs);
