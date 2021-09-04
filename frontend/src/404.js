import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'
import PageNotFound_404 from './components/pageNotFound_404'
import HotFooter from './components/hotFooter'
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

const CategoryApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />

                    <Switch>
                        <Route component={PageNotFound_404} />
                    </Switch>
                    
                    <HotFooter />
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default CategoryApp;

ReactDOM.render(
    <CategoryApp />,
    document.getElementById('404Root')
);
