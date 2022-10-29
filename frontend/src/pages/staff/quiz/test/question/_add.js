import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";

import UserStore from '../../../../../store/userStore'
import TestQuestionForm from '../../../../../components/staff/quiz/test/question/questionForm'
import { log } from '../../../../../components/base';

const CreateQuestion = () => {
    const [forms, setForms] = useState([])

    const [userProfile, userActions] = UserStore()

    return (
        <React.Fragment>
            <Helmet>
                <title>Test Question Add</title>
                <meta name='robots' content='noindex' />
            </Helmet>
            
            {
                userProfile.userDetail?.is_staff ?
                <div>
                    {forms}

                    <button
                        className='flex items-center px-12 py-3 mx-auto space-x-5 space-x-reverse text-center text-red-700 bg-white rounded'
                        onClick={() => setForms(forms.concat(<TestQuestionForm key={forms.length} id={forms.length} />))}
                    >
                        <h1>
                            سوال جدید
                        </h1>
                        <svg class="h-8 w-8 text-[#b91c1c]"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
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