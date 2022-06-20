import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import BackBtn from '../components/backBtn'
import Header from '../components/header'
import Footer from '../components/footer'

const pathRed = '/static/img/bubbles.webp'

const restartEveryMonthlyViews = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style = `url('${pathRed}') center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>Restarting Monthly Views</title>
            </Helmet>

            <div className="basicPage wrapper-sm mx-auto">
                <h2 className='text-center'>Restarting Every Monthly Views Done Successfully</h2>
                <p className='text-center'>Quizzes - Categories - SubCategories</p>
                <p className='text-center'>Good Job AssH*le 💗</p>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}

export default restartEveryMonthlyViews;