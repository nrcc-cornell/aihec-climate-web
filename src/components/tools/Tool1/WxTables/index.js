///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import MUIDataTable from "mui-datatables";


//Components

// Styles
//import '../../../../styles/WxTables.css';

var app;

@inject('store') @observer
class WxTables extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;

        let pageSize = 10;

        let setPage = () => {
                let data = app.wxgraph_getClimateSummary;
                let idxValid = 0;
                data.slice().reverse().some(function (value,index) {
                    idxValid=index;
                    return !isNaN(value['avgt']);
                });
                return parseInt(Math.floor(idxValid/pageSize),10);
            }

        this.state = {
            page: setPage(),
            pageSize: pageSize,
        }
    }

    render() {

        let columns = [];
        columns.push({name:'Date/Time', options:{filter:true,sort:true,display:true,download:true}})
        columns.push({name:'Ave Temp', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Max Temp', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Min Temp', options:{filter:false,sort:true,display:true,download:true}})
        columns.push({name:'Total Precipitation', options:{filter:false,sort:true,display:true,download:true}})

        let data = JSON.parse(JSON.stringify(app.wxgraph_getClimateSummary));

        const options = {
          filterType: 'checkbox',
          responsive: 'scroll',
          selectableRows: false,
          fixedHeader: false,
          search: false,
          filter: false,
          print: false,
          page: this.state.page,
          rowsPerPage: this.state.pageSize,
          rowsPerPageOptions: [10,50,data.length],
        };

        let tableData = data.map(row => {
                    row.avgt = !isNaN(row.avgt) ? row.avgt : '--'
                    row.maxt = !isNaN(row.maxt) ? row.maxt : '--'
                    row.mint = !isNaN(row.mint) ? row.mint : '--'
                    row.pcpn = !isNaN(row.pcpn) ? row.pcpn : '--'
                    return [row.date,row.avgt,row.maxt,row.mint,row.pcpn]
                })

        const tableTitle = 'Observed Data @ '+app.wxgraph_getClimateSummary[0]['stn']

        return (
                <MUIDataTable
                    title={tableTitle}
                    data={tableData.reverse()}
                    columns={columns}
                    options={options}
                />
        );

    }
}

export default WxTables;

