import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const Category = lazy(() => import ('./components/category'))
const HotFooter = lazy(() => import ('./components/hotFooter'))
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

const CategoryApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />
                    
                    <Switch>
                        <Route path='/category/:category' exact component={Category} />
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
    document.getElementById('categoryLand')
);
