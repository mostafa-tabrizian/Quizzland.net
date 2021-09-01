import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import HotFooter from './components/hotFooter'
import Category from './components/category'
import ScrollToTop from './components/scrollToTop'

const CategoryApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />
                    
                    <Switch>
                        <Route path='/category/:category' exact component={Category} />
                    </Switch>
                    
                    <HotFooter />
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default CategoryApp;

ReactDOM.render(
    <CategoryApp />,
    document.getElementById('categoryRoot')
);
