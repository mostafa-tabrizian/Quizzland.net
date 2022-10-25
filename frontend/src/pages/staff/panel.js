import React, { useEffect, useState, useCallback } from 'react'
const axios = require('axios')
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import { Link } from 'react-router-dom'

const LoadingScreen = React.lazy(() => import('../../components/loadingScreen'))
import { log, getTheme, takeParameterFromUrl, sortByNewest, sortByViews, sortByMonthlyViews } from '../../components/base'
import userStore from '../../store/userStore';
import userProfileDetail from '../../components/user/userProfileDetail'

const panel = () => {
    const [userProfile, userActions] = userStore()
    
    return (
        userProfile.userDetail?.is_staff ?
        <div className='text-center my-20'>
            <ul>
                <li><Link to='/staff/create'>Create New ➕</Link></li>
            </ul>
        </div>
        :
        <h1>
            not staff. sorry!
        </h1>
    );
}
 
export default panel;