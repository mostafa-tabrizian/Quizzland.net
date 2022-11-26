import React, { useEffect, useState, useCallback } from 'react'
const axios = require('axios')
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import { Link } from 'react-router-dom'

import { log } from '../../components/base'
import UserStore from '../../store/userStore';

const panel = () => {
    useEffect(() => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    })

    const [userProfile, userActions] = UserStore()
    
    return (
        <React.Fragment>
            <Helmet>
                <title>Staff Panel</title>
                <meta name='robots' content='noindex' />
            </Helmet>
            
            {
                userProfile.userDetail?.is_staff ?
                <div className='my-20 text-center'>            
                    <ul>
                        <li><Link to='/staff/trivia/create'>Create Trivia ➕</Link></li>
                        <li><Link to='/staff/trivia/overview'>Trivia Overview 🔍</Link></li>
                        <br />
                        <li><Link to='/staff/trivia/question/add'>Add Trivia Question ➕</Link></li>
                        <li><Link to='/staff/trivia/question/overview'>Trivia Question Overview 🔍</Link></li>
                        <br />
                        <li><Link to='/staff/test/create'>Create Test ➕</Link></li>
                        <li><Link to='/staff/test/question/add'>Add Test Question ➕</Link></li>
                        <li><Link to='/staff/test/overview'>Tests Overview 🔍</Link></li>
                        
                    </ul>
                </div>
                :
                <h1>
                    not staff. sorry!
                </h1>
            }
        </React.Fragment>
    )
}
 
export default panel;