///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';

// Components
import HomeContents from '../../components/HomeContents';
import AboutContents from '../../components/AboutContents';
import ToolContents from '../../components/ToolContents';

@inject('store') @observer
class Navigation extends Component {

    render() {

        let path = this.props.location.pathname
        let availablePaths = ['/','/about','/about/','/tools','/tools/','/tools/climate-viewer','/tools/climate-viewer/','/tools/tool2','/tools/tool2/']

        return (
          <div>
            {path==='/' && <HomeContents />}
            {(path==='/about' || path==='/about/') && <AboutContents />}
            {(path==='/tools' || path==='/tools/') && <ToolContents {...this.props} name={'climview'} />}
            {(path==='/tools/climate-viewer' || path==='/tools/climate-viewer/') && <ToolContents {...this.props} name={'climview'} />}
            {(path==='/tools/tool2' || path==='/tools/tool2/') && <ToolContents {...this.props} name={'tool2'} />}
            {!availablePaths.includes(path) && <HomeContents />}
          </div>
        )
    }
}

export default Navigation;
