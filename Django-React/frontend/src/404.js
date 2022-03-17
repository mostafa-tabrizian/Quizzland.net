import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const E404  = lazy(() => import ('./components/404'))
const Footer  = lazy(() => import ('./components/footer'))
const ScrollToTop = lazy(() => import ('./components/scrollToTop'))

const PageNotFound404App = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex justify-center items-center'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route component={E404} />
                    </Switch>
                    
                    <Footer linkType='Hot'/>
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default PageNotFound404App;

ReactDOM.render(
    <PageNotFound404App />,
    document.getElementById('404Land')
);
