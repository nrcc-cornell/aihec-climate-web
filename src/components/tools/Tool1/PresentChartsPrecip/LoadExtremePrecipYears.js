///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const protocol = window.location.protocol;

const LoadExtremePrecipYears = ({uid,network,enddate_mmdd}) => {
        // uid : ACIS uid for station
        // network: 'scan','tscan', or 'other'
        // enddate_mmdd : 'mmdd' representing date that year-to-date period ends 
        let vN_pcpn=0
        if (network==='scan') { vN_pcpn=22 }
        if (network==='tscan') { vN_pcpn=23 }
        let params = {
            "uid": uid,
            "sdate":"1850"+enddate_mmdd,
            "edate":"por",
            "elems":[{
                "name":"pcpn",
                "vN":vN_pcpn,
                "interval":[1,0,0],
                "duration":"ytd",
                "reduce":"sum",
                "maxmissing":"10",
                "smry":{"add":"date","reduce":"min"},
                "smry_only":"1"
              },{
                "name":"pcpn",
                "vN":vN_pcpn,
                "interval":[1,0,0],
                "duration":"ytd",
                "reduce":"sum",
                "maxmissing":"10",
                "smry":{"add":"date","reduce":"max"},
                "smry_only":"1"
              }]
          }
        return axios
          .post(`${protocol}//data.nrcc.rcc-acis.org/StnData`, params)
          .then(res => {
            //console.log('LoadExtremePrecipYears success');
            let minYear = res.data.smry[0][1].split('-')[0]
            let maxYear = res.data.smry[1][1].split('-')[0]
            return {'min_year':minYear,'max_year':maxYear}
          })
          .catch(err => {
            console.log(
              "Request Error: " + (err.response.data || err.response.statusText)
            );
          });
}

LoadExtremePrecipYears.propTypes = {
  uid: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  enddate_mmdd: PropTypes.string.isRequired,
};

export default LoadExtremePrecipYears;
