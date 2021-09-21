import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

import BackBtn from '../components/backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const restartEveryMonthlyViews = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: black url('${pathRed}') center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>Restarting Monthly Views</title>
            </Helmet>

            <div className="basicPage wrapper-sm center">
                <h2 className='tx-al-c'>Restarting Every Monthly Views Done Successfully</h2>
                <p className='tx-al-c'>Quizzes - Categories - SubCategories - Blogs</p>
                <p className='tx-al-c'>Good Job AssH*le 💗</p>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default restartEveryMonthlyViews;