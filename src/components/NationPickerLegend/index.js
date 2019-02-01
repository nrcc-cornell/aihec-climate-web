///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import { array } from 'prop-types'

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/NationPickerLegend.css';

@inject('store') @observer
class NationPickerLegend extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="bottomright" className="control-bottom-right">
                <div className="nation-picker-map-legend">
                    <span className={"nation-picker-map-legend-color-box brown"}></span><span className="nation-picker-map-legend-label">Nations</span>
                </div>
            </Control>
        );
    }
}

export default NationPickerLegend;
