///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

// Components
//import StationExplorer from '../../components/StationExplorer';
//import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/AboutContents.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    //padding: theme.spacing.unit * 2,
    padding: theme.spacing(2),
  },
  aboutHeaderText: {
    color: 'black',
    fontSize: '26px',
    fontWeight: 'normal',
  },
});

//var app;

@inject('store') @observer
class AboutContents extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        const { classes } = this.props;

        return (
            <div className="about-contents">
            <Grid container className={classes.root} spacing={4}>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h2" className={classes.aboutHeaderText}>
                      Purpose of these tools
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
These tools are meant to increase the accessibility and usefulness of weather and climate data available to Tribal nations. Data are summarized for nations of interest, and presented in graphical and tabular forms.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
Tools on this site use data from climate models and weather stations located near/within Tribal nations. From these data, nation members can use weather and climate data on a variety of timescales to assess:
                      <ul>
                        <li>long-term changes in climate since as far back as the early 1900s</li>
                        <li>how recent weather events compare to normal conditions</li>
                        <li>how their nation may be impacted by a changing climate through the next century</li>
                      </ul>
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
These assessments are essential to assist nation members in their goal of understanding and preparing for changing climate conditions where they live.
                    </Typography>
              </Grid>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h2" className={classes.aboutHeaderText}>
                      Weather & Climate Data
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
The data presented in these tools come from numerous weather station networks across the United States, and are stored in databases managed by <a href="http://www.rcc-acis.org/" rel="noopener noreferrer">Regional Climate Centers</a>. Various networks are designed for different purposes, some measuring different variables (temperature, wind, precipitation, soil moisture, etc) at different timescales (minutes, hours, days).
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
The Natural Resources Conservation Service (<a href="https://www.nrcs.usda.gov/wps/portal/nrcs/site/national/home/" target="_blank" rel="noopener noreferrer">NRCS</a>) operates a soil moisture and climate information network on Tribal lands, and these data are included among those used in our tools. The Tribal Soil Climate Analysis Network (also known as Tribal SCAN) supports natural resource assessments and conservation activities through its network of automated climate monitoring and data collection sites. The network focuses on agricultural areas which are situated on Tribal lands in the United States. For more information about the Tribal SCAN network, please visit the sites listed:
                      <ul>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/" target="_blank" rel="noopener noreferrer">SCAN / Tribal SCAN documentation</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/tribalscan/tribalscan_brochure.pdf" target="_blank" rel="noopener noreferrer">Tribal SCAN brochure</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/scan_brochure.pdf" target="_blank" rel="noopener noreferrer">SCAN brochure</a></li>
                      </ul>
                    </Typography>
              </Grid>
            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(AboutContents);
