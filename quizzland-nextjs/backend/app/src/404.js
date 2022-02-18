import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const PageNotFound_404  = lazy(() => import ('./components/pageNotFound_404'))
const Footer  = lazy(() => import ('./components/footer'))
const ScrollToTop = lazy(() => import ('./components/scrollToTop'))

const PageNotFound404App = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen fixed flex justify-center flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route component={PageNotFound_404} />
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
