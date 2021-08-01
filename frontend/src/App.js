import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'
import Footer from './components/footer'

import Index from './components/landPage'
const Guide             = React.lazy(() => import('./components/guide'))
const Contact           = React.lazy(() => import('./components/contact'))
const Ads               = React.lazy(() => import('./components/ads'))
const Support           = React.lazy(() => import('./components/support'))
const PrivacyPolicy     = React.lazy(() => import('./components/privacyPolicy'))
const Category          = React.lazy(() => import('./components/category'))
const SubCategory       = React.lazy(() => import('./components/subCategory'))
const Search            = React.lazy(() => import('./components/searchMoreResult'))
const Sort              = React.lazy(() => import('./components/sort'))
const pageNotFound_404  = React.lazy(() => import('./components/pageNotFound_404'))
const monthlyRecord     = React.lazy(() => import('./components/monthlyRecord'))
const welcomePage       = React.lazy(() => import('./components/welcomePage'))


const App = () => {
    return (
        <React.Fragment>

            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>

                <Router>

                    <Switch>
                        <Route path='/' exact component={Index} />
                        <Route path='/guide' component={Guide} />
                        <Route path='/contact' component={Contact} />
                        <Route path='/ads' component={Ads} />
                        <Route path='/support' component={Support} />
                        <Route path='/privacy-policy' component={PrivacyPolicy} />
                        <Route path='/category/:category' exact component={Category} />
                        <Route path='/category/:category/:subCategory' component={SubCategory} />
                        <Route path='/search' component={Search} />
                        <Route path='/sort' component={Sort} />
                        <Route path='/makeMonthlyRecord19931506' component={monthlyRecord} />
                        <Route path='/welcome/:target' component={welcomePage} />
                        <Route component={pageNotFound_404} />
                    </Switch>
                    
                    <Footer />

                </Router>

            </Suspense>
        </React.Fragment>
    );
}

export default App;

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
