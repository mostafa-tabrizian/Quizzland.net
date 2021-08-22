import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import PageNotFound_404 from './components/pageNotFound_404'
import HotFooter from './components/hotFooter'
import ScrollToTop from './components/scrollToTop'

const CategoryApp = () => {
    return (
        <React.Fragment>
            <Router>
                <ScrollToTop />

                <Switch>
                    <Route component={PageNotFound_404} />
                </Switch>
                
                <HotFooter />
            </Router>
        </React.Fragment>
    );
}

export default CategoryApp;

ReactDOM.render(
    <CategoryApp />,
    document.getElementById('404Root')
);
