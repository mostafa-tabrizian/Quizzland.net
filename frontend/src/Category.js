import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import HotFooter from './components/hotFooter'
import Category from './components/category'



const CategoryApp = () => {
    return (
        <React.Fragment>
            <Router>
                <ScrollToTop />
                
                <Switch>
                    <Route path='/category/:category' exact component={Category} />
                </Switch>
                
                <HotFooter />
            </Router>
        </React.Fragment>
    );
}

export default CategoryApp;

ReactDOM.render(
    <CategoryApp />,
    document.getElementById('categoryRoot')
);
