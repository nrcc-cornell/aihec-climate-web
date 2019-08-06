///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
//import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const HelpUserContent = () => {
        return (
            <Box padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">
              <p><b>User input options for the Climate Viewer tool:</b></p>
              <p><b>CHANGE NATION</b> button allows you to select a specific nation of interest from a map or list.</p>
              <p><b>STATIONS</b> can be selected from available locations on the map, near your selected nation.</p>
              <p><b>VARIABLE</b> is the type of weather/climate measurement available to view.
                <ul>
                  <li><b>Max Temperature:</b> The highest temperature occurring over an entire day, typically in the afternoon.</li>
                  <li><b>Min Temperature:</b> The lowest temperature occurring over an entire day, typically early morning.</li>
                  <li><b>Ave Temperature:</b> The average daily temperature is the average of the day's high and low temperature.</li>
                  <li><b>Temperature:</b> A combination of daily maximum, minimum and record extremes are included. <i>(RECENT view only)</i></li>
                  <li><b>Total Precipitation:</b> The total amount of rainfall and melted snowfall received at a location over a chosen period of time.</li>
                </ul>
              </p>
              <p><b>TIMESCALE</b> is the time period over which you would like to view averaged data.
                <ul>
                  <li><b>Annual:</b> Daily values are averaged (for temperatures) or summed (for precipitation) over an entire year.</li>
                  <li><b>Seasonal:</b> Daily values are averaged (for temperatures) or summed (for precipitation) over a selected season.</li>
                  <li><b>Monthly:</b> Daily values are averaged (for temperatures) or summed (for precipitation) over a selected month.</li>
                </ul>
              </p>
              <p><b>MODEL SCENARIO</b> represents conditions under which the climate models run. <i>(available for FUTURE view only)</i>
                <ul>
                  <li><b>High Emissions:</b> Under this scenario, greenhouse gas emissions and concentrations increase considerably over time, with no mitigation.</li>
                  <li><b>Low Emissions:</b> Under this scenario, greenhouse gas emissions peak at year 2040 and then level off.</li>
                </ul>
              </p>
            </Box>
        );
}

export default HelpUserContent;
