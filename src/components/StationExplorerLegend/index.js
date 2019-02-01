///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import { array } from 'prop-types'

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/StationExplorerLegend.css';

@inject('store') @observer
class StationExplorerLegend extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="bottomright" className="control-bottom-right">
                <div className="explorer-map-legend">
                    <span className={"explorer-map-legend-color-box blue"}></span><span className="explorer-map-legend-label">SCAN</span><br/>
                    <span className={"explorer-map-legend-color-box green"}></span><span className="explorer-map-legend-label">T-SCAN</span><br/>
                    <span className={"explorer-map-legend-color-box black"}></span><span className="explorer-map-legend-label">Coop</span><br/>
                    <span className={"explorer-map-legend-color-box brown"}></span><span className="explorer-map-legend-label">Nations</span>
                </div>
            </Control>
        );
    }
}

export default StationExplorerLegend;
