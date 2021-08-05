import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import PageNotFound_404 from './components/pageNotFound_404'
import HotFooter from './components/hotFooter'

const CategoryApp = () => {
    return (
        <React.Fragment>

            <Router>

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