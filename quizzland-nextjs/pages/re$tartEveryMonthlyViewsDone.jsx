import React, { useEffect } from 'react'
import Head from 'next/head'

import BackBtn from '../components/backBtn'
import Layout from '../components/layout'

const pathRed = '../images/bubbles.png'

const RestartEveryMonthlyViews = () => {

    useEffect(() => {
        document.querySelector('html').style=`url('${pathRed}') center center scroll !important`
    }, [])

    return (
        <>
            <Layout>

                <Head>
                    <title>Restarting Monthly Views</title>
                </Head>

                <div className="basicPage wrapper-sm center">
                    <h2 className='text-center'>Restarting Every Monthly Views Done Successfully</h2>
                    <p className='text-center'>Quizzes - Categories - SubCategories - Blogs</p>
                    <p className='text-center'>Good Job AssH*le 💗</p>
                </div>

                <BackBtn />

            </Layout>
        </>
    );
}
 
export default RestartEveryMonthlyViews;