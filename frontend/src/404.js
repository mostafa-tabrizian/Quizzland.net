import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const PageNotFound_404  = lazy(() => import ('./components/pageNotFound_404'))
const HotFooter  = lazy(() => import ('./components/hotFooter'))
const ScrollToTop = lazy(() => import ('./components/scrollToTop'))

const CategoryApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route component={PageNotFound_404} />
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
    document.getElementById('404Root')
);
