import React, { useEffect, useState, useCallback } from 'react'
const axios = require('axios')
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import { Link } from 'react-router-dom'

import { log } from '../../components/base'
import userStore from '../../store/userStore';

const panel = () => {
    const [userProfile, userActions] = userStore()

    const [forms, setForms] = useState([])
    
    return (
        userProfile.userDetail?.is_staff ?
        <div className='my-20 text-center'>
            <ul>
                <li><Link to='/staff/quiz/overview'>Quizzes Overview 🔍</Link></li>
                
                <li><Link to='/staff/quiz/create-trivia'>Create Trivia ➕</Link></li>
                <li><Link to='/staff/quiz/create-test'>Create Test ➕</Link></li>
                
                <li><Link to='/staff/question/create'>Create New Question ➕</Link></li>
            </ul>
        </div>
        :
        <h1>
            not staff. sorry!
        </h1>
    );
}
 
export default panel;