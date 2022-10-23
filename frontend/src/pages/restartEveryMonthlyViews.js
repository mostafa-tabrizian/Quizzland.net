import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

const pathRed = '/static/img/bubbles.webp'

const restartEveryMonthlyViews = () => {

    useEffect(() => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [])

    return (
        <React.Fragment>

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