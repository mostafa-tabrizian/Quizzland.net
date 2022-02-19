import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

import BackBtn from '../components/backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const restartEveryMonthlyViews = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`url('${pathRed}') center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header linkType='Link'/>

            <Helmet>
                <title>Restarting Monthly Views</title>
            </Helmet>

            <div className="basicPage wrapper-sm center">
                <h2 className='text-center'>Restarting Every Monthly Views Done Successfully</h2>
                <p className='text-center'>Quizzes - Categories - SubCategories - Blogs</p>
                <p className='text-center'>Good Job AssH*le 💗</p>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default restartEveryMonthlyViews;