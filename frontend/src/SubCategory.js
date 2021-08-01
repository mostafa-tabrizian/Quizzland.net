import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import HotFooter from './components/hotFooter'
import SubCategory from './components/subCategory'

const SubCategoryApp = () => {
    return (
        <React.Fragment>
            <Router>

                <Switch>
                    <Route path='/category/:category/:subCategory' component={SubCategory} />
                </Switch>
                
                <HotFooter />

            </Router>
        </React.Fragment>
    );
}

export default SubCategoryApp;

ReactDOM.render(
    <SubCategoryApp />,
    document.getElementById('subCategoryRoot')
);
