import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import Header from '../components/header'
import Footer from '../components/footer'

const pathRed = '/static/img/bubbles.webp'

const restartEveryMonthlyViews = () => {

    useEffect(() => {
        document.querySelector('body').style = `url('${pathRed}') center center scroll`
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>Restarting Monthly Views</title>
            </Helmet>

            <div className="mx-auto basicPage wrapper-sm">
                <h2 className='text-center'>Restarting Every Monthly Views Done Successfully</h2>
                <p className='text-center'>Quizzes - Categories - SubCategories</p>
                <p className='text-center'>Good Job AssH*le 💗</p>
            </div>

        </React.Fragment>
    );
}

export default restartEveryMonthlyViews;