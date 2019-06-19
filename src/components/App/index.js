///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { MuiThemeProvider, createMuiTheme, withStyles, withTheme  } from "@material-ui/core/styles";
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import brown from '@material-ui/core/colors/brown';
import Highcharts from 'highcharts/highstock';
//import HC_exporting from 'highcharts/modules/exporting'
//import HighchartsReact from 'highcharts-react-official';

// import route Components here
import {
  BrowserRouter as Router,
  Route,
  //Link,
  //Switch,
  //Redirect
} from 'react-router-dom'

// Components
import Navigation from '../../components/Navigation';
import Header from '../../components/Header';
//import HomeContents from '../../components/HomeContents';
//import AboutContents from '../../components/AboutContents';
//import ToolContents from '../../components/ToolContents';
import Footer from '../../components/Footer';

// Styles
//import 'react-tabs/style/react-tabs.css';
// modified tab css version for this app
//import '../../styles/react-tabs.css';
import '../../styles/App.css';

// init the exporting module
require("highcharts/modules/exporting")(Highcharts);

const theme = createMuiTheme({
  shadows: ["none"],
  palette: {
    primary: brown,
    //secondary:
  },
});

const styles = theme => ({
  root: {},
  toolbar: theme.mixins.toolbar,
});

//var app;

@inject('store') @observer
class App extends Component {
    //constructor(props) {
    //    super(props);
    //    //app = this.props.store.app;
    //}

    render() {
        //const { classes } = this.props;

        return (
          <Router basename={process.env.PUBLIC_URL}>
            <MuiThemeProvider theme={theme}>
              <div className="App">
                <Header />
                <Route render={(props) => <Navigation {...props} />} />
                <Footer />
              </div>
            </MuiThemeProvider>
          </Router>
        );
    }
}

export default withStyles(styles)(withTheme()(App));
