import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const ScrollToTop       = lazy(() => import('./components/scrollToTop'))

const Category          = lazy(() => import ('./pages/category'))
const SubCategory       = lazy(() => import ('./pages/subCategory'))

const Quiz              = lazy(() => import ('./pages/quiz'))
const Result            = lazy(() => import ('./pages/result'))
const Quiz404           = lazy(() => import ('./pages/404quiz'))

const Login             = lazy(() => import('./pages/user/login'))
const Profile           = lazy(() => import('./pages/user/profile'))
const Setting           = lazy(() => import('./pages/user/profileSetting'))
const QuizHistory           = lazy(() => import('./pages/user/quizHistory'))

const Index             = lazy(() => import('./pages/landPage'))
const Guide             = lazy(() => import('./pages/guide'))
const Contact           = lazy(() => import('./pages/contactUs'))
const AdvertiseContact  = lazy(() => import('./pages/advertiseContact'))
const Support           = lazy(() => import('./pages/supportUs'))
const PrivacyPolicy     = lazy(() => import('./pages/privacyPolicy'))
const Search            = lazy(() => import('./pages/searchMoreResult'))
const Tags            = lazy(() => import('./pages/tags'))
const Sort              = lazy(() => import('./pages/sort'))
const Blog              = lazy(() => import('./pages/blog'))
const pageNotFound_404  = lazy(() => import('./pages/404'))
const monthlyRecord     = lazy(() => import('./pages/monthlyRecord'))
const restartEveryMonthlyViews     = lazy(() => import('./pages/restartEveryMonthlyViews'))
const welcomeOwl        = lazy(() => import('./pages/welcomeOwl'))
const welcomeZeynab     = lazy(() => import('./pages/welcomeZeynab'))

log("                              \n\
          YOU ARE AWESOME :D       \n\
                                   \n\
             .-======-:            \n\
         .=*############*=.        \n\
       :+####Q#######Q#####*:      \n\
      =#####U#+-::  ::-+#U#%%%%+     \n\
     +####I*:            :*I%%%%*    \n\
    =####Z=                =Z%%%%+         _         _                 _              _                 \n\
    ####Z*                 *Z%%%%.  \ _   _(_)_______| | __ _ _ __   __| |  _ __   ___| |_              \n\
    ####L+                 +L%%%%:  | | | | |_  /_  / |/ _` | '_ \\ / _` | | '_ \\ / _ \\ __|           \n\
    #%%%A#                  #A%%%%.  | |_| | |/ / / /| | (_| | | | | (_| |_| | | |  __/ |_               \n\
    -%%%%N+                 +N%%%%+  \  \\__,_|_/___/___|_|\\__,_|_| |_|\\__,_(_)_| |_|\\___|\\__|      \n\
     +%%%%D#-             :#D%%%%*    \n\
      =%%%%%%       .-::-=*%%%%%%%+    \n\
       .+%%%-      #%%%%%%%%%%%*.     \n\
          -=    -%%%%%%%%%*=.       \n\
                 *%%%%#-:            \n\
                 #%%%%+              \n\
                 =%%*++*:            \n\
                 .-==:             \n\
                -%*-+%#            \n\
                *%- .%%.           \n\
                 +#%%*:            \n\
")

const App = () => {
    return (
        <React.Fragment>
            <Suspense
                fallback={
                    <div className={`
                        fixed left-0 backdrop-blur-3xl backdrop-brightness-75
                        top-0 w-screen h-screen z-20
                        flex items-center justify-center
                    `}>
                        <div>
                            <svg class="animate-spin h-10 w-10 m-10 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>    
                        </div>
                    </div>
                }>

                <Router>
                    <ScrollToTop />

                    <div>
                        <Switch>
                            <Route path='/' exact component={Index} />

                            <Route path='/login' component={Login} />
                            <Route path='/profile/:user' component={Profile} />
                            <Route path='/setting' component={Setting} />
                            <Route path='/quiz-history' component={QuizHistory} />

                            <Route path='/guide' component={Guide} />

                            <Route path='/quiz/:title' component={Quiz} />
                            <Route path='/test/:title' component={Quiz} />
                            <Route path='/result' component={Result} />
                            <Route path='/quiz-not-found' component={Quiz404} />

                            <Route path='/category/:category' exact component={Category} />
                            <Route path='/category/:category/:subCategory' component={SubCategory} />

                            <Route path='/contact' component={Contact} />
                            <Route path='/advertiseContact' component={AdvertiseContact} />
                            <Route path='/support' component={Support} />
                            <Route path='/privacy-policy' component={PrivacyPolicy} />
                            <Route path='/search' component={Search} />
                            <Route path='/tags/:tag' component={Tags} />
                            <Route path='/sort' component={Sort} />
                            <Route path='/blog' component={Blog} />
                            <Route path='/makeMonthlyRecord' component={monthlyRecord} />
                            <Route path='/restartEveryMonthlyViews' component={restartEveryMonthlyViews} />
                            <Route path='/welcomeOwl' component={welcomeOwl} />
                            <Route path='/welcomeZeynab' component={welcomeZeynab} />

                            <Route component={pageNotFound_404} />
                        </Switch>
                    </div>
                    
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
