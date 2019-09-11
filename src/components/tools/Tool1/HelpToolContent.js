///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
//import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const HelpToolContent = () => {
        return (
            <Box padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
              <p>
                The <b>Climate Viewer</b> tool allows you to view past, recent and future climate conditions at your nation. Charts are presented by default, and the icon in the upper-right corner of each chart gives you access to tabular, formatted or downloadable data and images. Changes to location, variables and timescales is done to the left of the chart.
              </p>
              <p>
                <b>PAST</b> view shows long-term historical data observed at the selected weather station near your nation. A horizontal black line refers to normal conditions (averages) observed over the period 1981-2010. Colored bars show conditions observed during each available year, relative to the normal.
              </p>
              <p>
                <b>RECENT</b> view shows daily weather observations over the past 3 months (temperature) or season (precipitation) from the selected station near your nation.
              </p>
              <ul>
                <li>Daily temperature ranges are presented with references to normal and extreme records observed at the site.</li>
                <li>Accumulated precipitation for the current year (since January 1) is provided, with reference to normal amounts. </li>
              </ul>
              <p>
                <b>FUTURE</b> view shows averages and ranges of 32 climate models from 1981-2099. Observed values from 1981-2013 are overlayed on the climate model results for reference. These climate models were executed during a joint project in the early part of this century. The blue shading represents years that were simulated by the climate models, while the red shading represents years that were projected by the climate models. <b>NOTE: For nations in Alaska</b>, output from only two climate models are available to view, and each are shown on charts.
              </p>
            </Box>
        );
}

export default HelpToolContent;
