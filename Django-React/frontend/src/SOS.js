import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const SOS  = lazy(() => import ('./components/SOS'))
const Footer  = lazy(() => import ('./components/footer'))
const ScrollToTop = lazy(() => import ('./components/scrollToTop'))

const SOSLandApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex justify-center items-center'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route component={SOS} />
                    </Switch>
                    
                    <Footer />
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default SOSLandApp;

ReactDOM.render(
    <SOSLandApp />,
    document.getElementById('SOSLand')
);
