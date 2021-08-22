import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import HotFooter from './components/hotFooter'
import SubCategory from './components/subCategory'
import ScrollToTop from './components/scrollToTop'

const SubCategoryApp = () => {
    return (
        <React.Fragment>
            <Router>
                <ScrollToTop />

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
