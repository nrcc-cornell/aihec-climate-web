///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Styles
import '../../../styles/Tool2Tool.css';

var app;

@inject('store') @observer
class Tool2 extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        return (
            <div className="tool2-tool">
                    <span className='tool2-tool-header'>
                        {app.getToolInfo(app.getToolName).title}
                    </span>
            </div>
        );
    }
}

export default Tool2;
