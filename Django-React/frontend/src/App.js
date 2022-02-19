import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const Footer            = lazy(() => import('./components/footer'))
const ScrollToTop       = lazy(() => import('./components/scrollToTop'))
const Category          = lazy(() => import ('./components/category'))
const Index             = lazy(() => import('./components/landPage'))
const Guide             = lazy(() => import('./components/guide'))
const Contact           = lazy(() => import('./components/contactUs'))
const AdvertiseContact  = lazy(() => import('./components/advertiseContact'))
const Support           = lazy(() => import('./components/supportUs'))
const PrivacyPolicy     = lazy(() => import('./components/privacyPolicy'))
const Search            = lazy(() => import('./components/searchMoreResult'))
const Sort              = lazy(() => import('./components/sort'))
const Blog              = lazy(() => import('./components/blog'))
const pageNotFound_404  = lazy(() => import('./components/404'))
const monthlyRecord     = lazy(() => import('./components/monthlyRecord'))
const restartEveryMonthlyViews     = lazy(() => import('./components/restartEveryMonthlyViews'))
const welcomeOwl        = lazy(() => import('./components/welcomeOwl'))
const welcomeZeynab     = lazy(() => import('./components/welcomeZeynab'))

log(" \n\n\
                                ((((((((())))))))))))))))))) \n\
                             ((((((((((((((((((Q))))))))))))))) \n\
                          (((((((((((((((((((((((U))))))))))))))) \n\
                       ((((((((((((((((((((((((((((I))))))))))))))) \n\
                      (((((((((((((((((((((((((((((((Z)))))))))))))) \n\
                     ((((((((((((((((((((((((((((((((((Z)))))))))))))) \n\
                    (((((((((((((((((((((((((((((((((((L))))))))))))))) \n\
                   ((((((((((((((((((((((((((((((((((((((A)))))))))))))) \n\
                  (((((((((((((((((//                ((((((N))))))))))))) \n\
                 ((((((((((((((((//                   (((((((D)))))))))))) \n\
                /((((((((((((((//                       (((((((.)))))))))) \n\
                ((((((((((((((//                         (((((N))))))))))) \n\
                /(((((((((((((//                         (((((((E))))))))) \n\
                //((((((((((((//    -YOU ARE AWESOME-    (((((((((T))))))) \n\
                ///(((((((((((//                         ((((((((((()))))) \n\
                ///(((((((((((//                         (((((((((((((())) \n\
                ///((((((((((((//                       (((((((((((((((() \n\
                 ///(((((((((((((//                   ((((((((((((((((() \n\
                  ///(((((((((((((//                (((((((((((((((((() \n\
                   ///(((((((((((((()    (((((((((((((((((((((((((((() \n\
                    ///(((((((((((()   (((((((((((((((((((((((((((() \n\
                     ///(((((((((()   (((((((((((((((((((((((((((() \n\
                       ///((((((()   (((((((((((((((((((((((((() \n\
                         ///((()     (((((((((((((((((((((((() \n\
                           /(()      ((((((((((((((((((((() \n\
                                     ((((((((((((((((((() \n\
                                      (((((((((((((() \n\
                                        (((((((((((() \n\
                                        ((((((((((((() \n\
                                         ((((((((((((() \n\
                                         (()          () \n\
                                         ()  (((((((()  () \n\
                                            (()     (() \n\
                                           (()       () \n\
                                            (()     (() \n\
                                             (((((((() \n\
\n\n")

const App = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route path='/' exact component={Index} />
                        <Route path='/guide' component={Guide} />
                        <Route path='/category/:category' exact component={Category} />
                        <Route path='/contact' component={Contact} />
                        <Route path='/advertiseContact' component={AdvertiseContact} />
                        <Route path='/support' component={Support} />
                        <Route path='/privacy-policy' component={PrivacyPolicy} />
                        <Route path='/search' component={Search} />
                        <Route path='/sort' component={Sort} />
                        <Route path='/blog' component={Blog} />
                        <Route path='/makeMonthlyRecord' component={monthlyRecord} />
                        <Route path='/restartEveryMonthlyViews' component={restartEveryMonthlyViews} />
                        <Route path='/welcomeOwl' component={welcomeOwl} />
                        <Route path='/welcomeZeynab' component={welcomeZeynab} />
                        <Route component={pageNotFound_404} />
                    </Switch>
                    
                    <Footer linkType='Link'/>
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default App;

ReactDOM.render(
    <App />,
    document.getElementById('land')
);
