import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import Footer from './components/footer'
import Category from './components/category'



const CategoryApp = () => {
    return (
        <React.Fragment>
            <Router>

                <Switch>
                    <Route path='/category/:category' exact component={Category} />
                </Switch>
                
                <Footer />

            </Router>
        </React.Fragment>
    );
}

export default CategoryApp;

ReactDOM.render(
    <CategoryApp />,
    document.getElementById('categoryRoot')
);
