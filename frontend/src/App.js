import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from 'notistack'

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const ScrollToTop       = lazy(() => import('./components/scrollToTop'))
const Header            = lazy(() => import('./components/header'))
const Footer            = lazy(() => import('./components/footer'))

const Contents          = lazy(() => import ('./pages/contents'))

const Quiz              = lazy(() => import ('./pages/quiz'))
const QuizV2              = lazy(() => import ('./pages/quiz_v2'))
const Result            = lazy(() => import ('./pages/result'))

const Login             = lazy(() => import('./pages/user/login'))
const Profile           = lazy(() => import('./pages/user/profile'))
const Setting           = lazy(() => import('./pages/user/profileSetting'))
const Playlist          = lazy(() => import('./pages/user/playlist'))
const Messages          = lazy(() => import('./pages/user/messages'))

const Index             = lazy(() => import('./pages/landPage'))
// const Guide             = lazy(() => import('./pages/guide'))
// const Contact           = lazy(() => import('./pages/contactUs'))
// const AdvertiseContact  = lazy(() => import('./pages/advertiseContact'))
// const Support           = lazy(() => import('./pages/supportUs'))
const PrivacyPolicy     = lazy(() => import('./pages/privacyPolicy'))
const Search            = lazy(() => import('./pages/searchPage'))
const Tags              = lazy(() => import('./pages/tags'))
const Blog              = lazy(() => import('./pages/blog'))
const notFound_404      = lazy(() => import('./pages/404'))

const staffPanel        = lazy(() => import('./pages/staff/panel'))

const staffCreateTrivia   = lazy(() => import('./pages/staff/quiz/trivia/_create'))
const staffOverviewTrivia = lazy(() => import('./pages/staff/quiz/trivia/_overview')) 

const staffAddTriviaQuestion   = lazy(() => import('./pages/staff/quiz/trivia/question/_add'))
const staffOverviewTriviaQuestion   = lazy(() => import('./pages/staff/quiz/trivia/question/_overview'))

const staffCreateTest   = lazy(() => import('./pages/staff/quiz/test/_create'))
const staffOverviewTests = lazy(() => import('./pages/staff/quiz/test/_overview')) 
const staffAddTestQuestion   = lazy(() => import('./pages/staff/quiz/test/question/_add'))

const monthlyRecord     = lazy(() => import('./pages/monthlyRecord'))
const restartEveryMonthlyViews     = lazy(() => import('./pages/restartEveryMonthlyViews'))

const welcomeOwl        = lazy(() => import('./pages/welcomeOwl'))
const welcomeZeynab     = lazy(() => import('./pages/welcomeZeynab'))

log("                              \n\
          YOU ARE AWESOME :D       \n\
                                   \n\
             .-======-:            \n\
         .=*##############*=.        \n\
       :+####Q#######Q#######*:      \n\
      =#####U#+-::  ::-+#U#%%%%%%%%+     \n\
     +####I*:            :*I%%%%%%%%*    \n\
    =####Z=                =Z%%%%%%%%+         _         _                 _              _                 \n\
    ####Z*                 *Z%%%%%%%%.  \ _   _(_)_______| | __ _ _ __   __| |  _ __   ___| |_              \n\
    ####L+                 +L%%%%%%%%:  | | | | |_  /_  / |/ _` | '_ \\ / _` | | '_ \\ / _ \\ __|           \n\
    #%%%A#                  #A%%%%%%%%.  | |_| | |/ / / /| | (_| | | | | (_| |_| | | |  __/ |_               \n\
    -%%%%%%%%N+                 +N%%%%%%+  \  \\__,_|_/___/___|_|\\__,_|_| |_|\\__,_(_)_| |_|\\___|\\__|      \n\
     +%%%%%%%%D#-             :#D%%%%%%*    \n\
      =%%%%%%%%%%       .-::-=*%%%%%%%%%+    \n\
       .+%%%-      #%%%%%%%%%%%%%%%%%*.     \n\
          -=    -%%%%%%%%%%%%%%%%%*=.       \n\
                 *%%%%%%%%#-:            \n\
                 #%%%%%%%%+              \n\
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

                <CookiesProvider>
                    <SnackbarProvider>
                        <Router>
                            <ScrollToTop />
                            <Header />

                            <div>
                                <Switch>
                                    <Route path='/' exact component={Index} />

                                    <Route path='/login' component={Login} />

                                    <Route path='/profile/playlist' component={Playlist} />
                                    <Route path='/profile/setting' component={Setting} />
                                    <Route path='/profile/messages' component={Messages} />
                                    <Route path='/profile/:user' component={Profile} />
                                    

                                    {/* <Route path='/guide' component={Guide} /> */}

                                    <Route path='/quiz/:title' component={Quiz} />
                                    <Route path='/play/:title' component={QuizV2} />
                                    <Route path='/test/:title' component={Quiz} />
                                    <Route path='/result' component={Result} />

                                    <Route path='/contents/:category' exact component={Contents} />
                                    <Route path='/contents/' exact component={Contents} />

                                    {/* <Route path='/contact' component={Contact} /> */}
                                    {/* <Route path='/advertiseContact' component={AdvertiseContact} /> */}
                                    {/* <Route path='/support' component={Support} /> */}
                                    <Route path='/privacy-policy' component={PrivacyPolicy} />
                                    <Route path='/search' component={Search} />
                                    <Route path='/tags/:tag' component={Tags} />
                                    <Route path='/blog' component={Blog} />

                                    <Route path='/staff/panel' component={staffPanel} />

                                    <Route path='/staff/trivia/create' component={staffCreateTrivia} />
                                    <Route path='/staff/trivia/overview' component={staffOverviewTrivia} />

                                    <Route path='/staff/trivia/question/add' component={staffAddTriviaQuestion} />
                                    <Route path='/staff/trivia/question/overview' component={staffOverviewTriviaQuestion} />

                                    <Route path='/staff/test/create' component={staffCreateTest} />
                                    <Route path='/staff/test/overview' component={staffOverviewTests} />
                                    <Route path='/staff/test/question/add' component={staffAddTestQuestion} />

                                    <Route path='/makeMonthlyRecord' component={monthlyRecord} />
                                    <Route path='/restartEveryMonthlyViews' component={restartEveryMonthlyViews} />
                                    
                                    <Route path='/404' component={notFound_404} />
                                    
                                    <Route path='/welcomeOwl' component={welcomeOwl} />
                                    <Route path='/welcomeZeynab' component={welcomeZeynab} />

                                    <Route component={notFound_404} />
                                </Switch>
                            </div>

                            <Footer />
                        </Router>
                    </SnackbarProvider>
                </CookiesProvider>
            </Suspense>
        </React.Fragment>
    );
}

export default App;

ReactDOM.render(
    <App />,
    document.getElementById('land')
);
