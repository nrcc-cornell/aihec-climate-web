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
                    <Typography component="span" align="justify" paragraph variant="body1">
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
The data presented in these tools come from numerous weather station networks across the United States, and are stored in databases managed by <a href="http://www.rcc-acis.org/" rel="noopener noreferrer">Regional Climate Centers</a> and accessed through the <a href="http://www.rcc-acis.org/docs_webservices.html" rel="noopener noreferrer">Applied Climate Information System</a>. Various networks are designed for different purposes, some measuring different variables (temperature, wind, precipitation, soil moisture, etc) at different timescales (minutes, hours, days).
                    </Typography>
                    <Typography component="span" align="justify" paragraph variant="body1">
The Natural Resources Conservation Service (<a href="https://www.nrcs.usda.gov/wps/portal/nrcs/site/national/home/" target="_blank" rel="noopener noreferrer">NRCS</a>) operates a soil moisture and climate information network on Tribal lands, and these data are included among those used in our tools. The Tribal Soil Climate Analysis Network (also known as Tribal SCAN) supports natural resource assessments and conservation activities through its network of automated climate monitoring and data collection sites. The network focuses on agricultural areas which are situated on Tribal lands in the United States. For more information about the Tribal SCAN network, please visit the sites listed:
                      <ul>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/" target="_blank" rel="noopener noreferrer">SCAN / Tribal SCAN documentation</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/tribalscan/tribalscan_brochure.pdf" target="_blank" rel="noopener noreferrer">Tribal SCAN brochure</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/scan_brochure.pdf" target="_blank" rel="noopener noreferrer">SCAN brochure</a></li>
                      </ul>
                    </Typography>
              </Grid>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h2" className={classes.aboutHeaderText}>
                      Climate Model Data
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                 <b>For Nations within the contiguous United States:</b>
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
               Localized Constructed Analogs (LOCA, Pierce et al. 2014) downscaled data from 32 independent climate models are used to show simulated (in the past) and projected (into the future) climate conditions. On charts, a blue band indicates the range of model simulation results, a light red band indicates the range of model projection results, and a dark line represents the weighted average of the model results. These data are available at 1/16° spatial resolution and daily temporal resolution for the period from 1950 to 2100.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
               Climate models project conditions for multiple emissions scenarios. This allows us to understand the magnitude of changes we might expect given the range of possible greenhouse gas emissions, depending on human activity, over the next century. Climate projections for two emissions scenarios are provided in this tool:<br/>
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                   <i>(1) High Emissions</i>: Under this scenario, greenhouse gas emissions and concentrations increase considerably over time, with no mitigation. This is also known as RCP8.5, as defined by the Intergovernmental Panel on Climate Change (IPCC).
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                   <i>(2) Low Emissions</i>: Under this scenario, greenhouse gas emissions peak at year 2040 and then level off. This is also known as RCP4.5, as defined by the IPCC.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
               <i>Pierce, D. W., D. R. Cayan, and B. L. Thrasher, 2014: Statistical Downscaling Using Localized Constructed Analogs (LOCA). Journal of Hydrometeorology, volume 15, 2558-2585. doi: 10.1175/JHM-D-14-0082.1.</i>
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                 <b>For Nations in Alaska:</b>
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                 We utilize additional downscaled climate model output for nations located to the far north. These datasets are created by the <a href="https://www.snap.uaf.edu/" rel="noopener noreferrer">Scenarios Network For Alaska and Arctic Planning, University of Alaska (SNAP)</a>.
                    </Typography>
              </Grid>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h2" className={classes.aboutHeaderText}>
                      Comparing Climate Model Ouput to Observations
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
               When presenting climate model output, these tools overlay data observed at weather stations from 1950-2013 to provide context for climate model simulations. The observations are interpolated to a grid of 1/16° spatial resolution by Livneh et al (2013,2015). The use of this dataset allows for direct comparison of observations with model projections that are also downscaled to the same resolution. Charts show these observations as black dots and are overlayed on top of climate model results.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
               <i>Livneh, B., E. A. Rosenberg, C. Lin, B. Nijssen, V. Mishra, K. M. Andreadis, E. P. Maurer, and D. P. Lettenmaier (2013), A long-term hydrologically based dataset of land surface fluxes and states for the conterminous United States: Update and extensions, J. Clim., 26(23), 9384–9392, doi 10.1175/JCLI-D-12-00508.1.</i>
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
               <i>Livneh, B., Bohn, T.J., Pierce, D.W., Munoz-Arriola, F., Nijssen, B., Vose, R., Brekke, L. 2015. A spatially comprehensive, hydrometeorological data set for Mexico, the U.S., and Southern Canada 1950–2013. Scientific Data 2:150042. doi: 10.1038/sdata.2015.42.</i>
                    </Typography>
              </Grid>
            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(AboutContents);
