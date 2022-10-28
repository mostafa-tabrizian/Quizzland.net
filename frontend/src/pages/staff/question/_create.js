import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";

import { log } from '../../../components/base'
import userStore from '../../../store/userStore';
import QuestionForm from '../../../components/staff/create/questionForm';

const CreateQuestion = () => {
    const [forms, setForms] = useState([])

    const [userProfile, userActions] = userStore()

    return (
        userProfile.userDetail?.is_staff ?
            <div>
                {forms}

                <button
                    className='bg-white flex space-x-5 space-x-reverse py-3 px-12 text-center mx-auto items-center rounded text-red-700'
                    onClick={() => setForms(forms.concat(<QuestionForm key={forms.length} id={forms.length} />))}
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
    );
}
 
export default CreateQuestion;