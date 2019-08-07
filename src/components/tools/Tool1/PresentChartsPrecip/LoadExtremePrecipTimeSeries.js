///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadExtremePrecipTimeSeries = ({uid,enddate_yyyymmdd}) => {
        // uid : ACIS uid for station
        // enddate_yyyymmdd : 'yyyymmdd' representing date that year-to-date period ends 
        let startdate_yyyymmdd = enddate_yyyymmdd.slice(0,4)+'0101'
        let params = {
            "uid": uid,
            "sdate":startdate_yyyymmdd,
            "edate":enddate_yyyymmdd,
            "elems":[{
                "name":"pcpn",
                "interval":[0,0,1],
                "duration":"ytd",
                "reduce":"sum"
              }]
          }
        console.log('PARAMS');
        console.log(params);
        return axios
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            console.log('LoadExtremePrecipTimeSeries success');
            console.log(res.data.data);
            return res.data.data
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
}

LoadExtremePrecipTimeSeries.propTypes = {
  uid: PropTypes.string.isRequired,
  enddate_yyyymmdd: PropTypes.string.isRequired,
};

export default LoadExtremePrecipTimeSeries;
