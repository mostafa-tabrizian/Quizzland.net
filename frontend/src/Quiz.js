import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import { log } from './components/base'
import HotFooter from './components/hotFooter'
import Quiz from './components/quiz'
import Result from './components/result'
import SearchMoreResult from './components/searchMoreResult'
import ScrollToTop from './components/scrollToTop'

const QuizApp = () => {
    return (
        <React.Fragment>
            <Router>
                <ScrollToTop />

                <Switch>
                    <Route path='/quiz/:title' component={Quiz} />
                    <Route path='/result' component={Result} />
                    <Route path='/search' component={SearchMoreResult} />
                </Switch>
                
                <HotFooter />
            </Router>
        </React.Fragment>
    );
}

export default QuizApp;

ReactDOM.render(
    <QuizApp />,
    document.getElementById('quizRoot')
);
