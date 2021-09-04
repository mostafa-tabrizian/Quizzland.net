import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'
import HotFooter from './components/hotFooter'
import Quiz from './components/quiz'
import QuizPointy from './components/quizPointy'
import Result from './components/result'
import ResultPointy from './components/resultPointy'
import SearchMoreResult from './components/searchMoreResult'
import ScrollToTop from './components/scrollToTop'

log(" \n\n\
                                    ((((())))))))))))))))) \n\
                                ((((((((())))))))))))))))))))) \n\
                             ((((((((((((((((Q)))))))))))))))))) \n\
                          (((((((((((((((((((((((U)))))))))))))))) \n\
                       (((((((((((((((((((((((((((I)))))))))))))))) \n\
                     (((((((((((((((((((((((((((((((Z)))))))))))))))) \n\
                    (((((((((((((((((((((((((((((((((((L))))))))))))))) \n\
                   (((((((((((((((((((((((((((((((((((((A))))))))))))))) \n\
                  (((((((((((((((((/////////////////((((((N)))))))))))))) \n\
                 ((((((((((((((((//                   (((((D))))))))))))) \n\
                /((((((((((((((//                       (((((.)))))))))))) \n\
                ((((((((((((((//                         (((((N))))))))))) \n\
                /(((((((((((((//                         (((((((E))))))))) \n\
                //((((((((((((//    -YOU ARE AWESOME-    (((((((((T))))))) \n\
                ///(((((((((((//                         (((((((((((❤)))) \n\
                ///(((((((((((//                         ((((((((((())))) \n\
                ///((((((((((((//                       (((((((((((((())) \n\
                 ///(((((((((((((//                   (((((((((((((((()) \n\
                  ///(((((((((((((//                ((((((((((((((((((( \n\
                   ///(((((((((((((((    (((((((((((((((((((((((((((((( \n\
                    ///((((((((((((((  ((((((((((((((((((((((((((((((( \n\
                     ///(((((((((((   (((((((((((((((((((((((((((((( \n\
                       ///((((((((   ((((((((((((((((((((((((((((( \n\
                         ///((((     ((((((((((((((((((((((((( \n\
                           /(((      ((((((((((((((((((((((( \n\
                                     (((((((((((((((((((( \n\
                                      ((((((((((((((( \n\
                                        ((((((((((((( \n\
                                        (((((((((((((( \n\
                                         (((((((((((((( \n\
                                         (((          ((( \n\
                                         ((  (((((((((  (( \n\
                                            (((     ((( \n\
                                           (((       ((( \n\
                                            (((     ((( \n\
                                             ((((((((( \n\
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
