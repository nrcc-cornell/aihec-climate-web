///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../../styles/Tool3Tool.css';

var app;

@inject('store') @observer
class Tool3 extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="tool3-tool">
                    <span className='tool3-tool-header'>
                        {app.getToolInfo(app.getToolName).title}
                    </span>
            </div>
        );
    }
}

export default Tool3;
