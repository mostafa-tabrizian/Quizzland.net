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

const Index             = lazy(() => import('./components/landPage'))

const Profile     = lazy(() => import('./components/profile'))
const SignUp     = lazy(() => import('./components/signUp'))
const SignIn     = lazy(() => import('./components/signIn'))

const Guide             = lazy(() => import('./components/guide'))
const Contact           = lazy(() => import('./components/contact'))
const Ads               = lazy(() => import('./components/ads'))
const Support           = lazy(() => import('./components/support'))
const PrivacyPolicy     = lazy(() => import('./components/privacyPolicy'))

const Search            = lazy(() => import('./components/searchMoreResult'))

const Sort              = lazy(() => import('./components/sort'))

const Blog              = lazy(() => import('./components/blog'))

const pageNotFound_404  = lazy(() => import('./components/pageNotFound_404'))

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
                        <Route path='/profile' component={Profile} />
                        <Route path='/signUp' component={SignUp} />
                        <Route path='/signIn' component={SignIn} />
                        <Route path='/sort' component={Sort} />
                        <Route path='/search' component={Search} />
                        <Route path='/blog' component={Blog} />
                        <Route path='/guide' component={Guide} />
                        <Route path='/contact' component={Contact} />
                        <Route path='/ads' component={Ads} />
                        <Route path='/support' component={Support} />
                        <Route path='/privacy-policy' component={PrivacyPolicy} />
                        <Route path='/makeMonthlyRecord' component={monthlyRecord} />
                        <Route path='/restartEveryMonthlyViews' component={restartEveryMonthlyViews} />
                        <Route path='/welcomeOwl' component={welcomeOwl} />
                        <Route path='/welcomeZeynab' component={welcomeZeynab} />
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
    document.getElementById('land')
);
