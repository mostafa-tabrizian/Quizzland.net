import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'

const Blog = lazy(() => import ('./components/blog'))
const Article = lazy(() => import ('./components/article'))
const Footer = lazy(() => import ('./components/footer'))
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

const BlogApp = () => {
    return (
        <React.Fragment>
            <Suspense fallback={ <div className='loadingScreen pos-fix flex flex-jc-c flex-ai-c'></div> }>
                <Router>
                    <ScrollToTop />
                    
                    <Switch>
                        <Route path='/blog' exact component={Blog} />
                        <Route path='/blog/:title' component={Article} />
                    </Switch>
                    
                    <Footer linkType='Hot'/>
                </Router>
            </Suspense>
        </React.Fragment>
    );
}

export default BlogApp;

ReactDOM.render(
    <BlogApp />,
    document.getElementById('blogLand')
);
