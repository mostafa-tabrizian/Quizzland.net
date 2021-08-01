import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import Footer from './components/footer'
import Quiz from './components/quiz'
import Result from './components/result'


const QuizApp = () => {
    return (
        <React.Fragment>
            
            <Router>

                <Switch>
                    <Route path='/quiz/:title' component={Quiz} />
                    <Route path='/result' component={Result} />
                </Switch>
                
                <Footer />

            </Router>

        </React.Fragment>
    );
}

export default QuizApp;

ReactDOM.render(
    <QuizApp />,
    document.getElementById('quizRoot')
);
