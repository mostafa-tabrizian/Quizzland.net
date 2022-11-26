import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";

import UserStore from '../../../../../store/userStore';
import TriviaQuestionForm from '../../../../../components/staff/quiz/trivia/question/questionForm'
import { log } from '../../../../../components/base';

const CreateQuestion = () => {
    useEffect(() => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [])

    const [userProfile, userActions] = UserStore()

    return (
        <React.Fragment>
            <Helmet>
                <title>Trivia Question Add</title>
                <meta name='robots' content='noindex' />
            </Helmet>
            
            {
                userProfile.userDetail?.is_staff ?
                <div className='transition-all duration-300 ease-in-out'>
                    <TriviaQuestionForm />
                </div>
                :
                <h1>
                    not staff. sorry!
                </h1>   
            }
        </React.Fragment>
    );
}
 
export default CreateQuestion;