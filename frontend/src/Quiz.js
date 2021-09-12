import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const HotFooter  = lazy(() => import ('./components/hotFooter'))
const Quiz  = lazy(() => import ('./components/quiz'))
const QuizPointy = lazy(() => import ('./components/quizPointy'))
const Result = lazy(() => import ('./components/result'))
const ResultPointy = lazy(() => import ('./components/resultPointy'))
const SearchMoreResult = lazy(() => import ('./components/searchMoreResult'))
const ScrollToTop = lazy(() => import ('./components/scrollToTop'))

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

const QuizApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route path='/quiz/:title' component={Quiz} />
                        <Route path='/test/:title' component={QuizPointy} />
                        <Route path='/result' component={Result} />
                        <Route path='/result_p' component={ResultPointy} />
                        <Route path='/search' component={SearchMoreResult} />
                    </Switch>
                    
                    <HotFooter />
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default QuizApp;

ReactDOM.render(
    <QuizApp />,
    document.getElementById('quizRoot')
);
