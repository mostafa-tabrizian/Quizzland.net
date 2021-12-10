import React, { useEffect } from 'react'
import Head from 'next/head'

import BackBtn from '../components/backBtn'
import Layout from '../components/layout'

const pathRed = '../images/bubbles.png'

const Support = () => {

    useEffect(() => {
        document.querySelector('html').style=`background: #0a0d13 url('${pathRed}') center center scroll !important`
    }, [])

    return (
        <>
            <Layout>
                <Head>
                    <title>حمایت |‌کوییزلند</title>
                    <meta name="description" content="حمایت از کوییزلند" />
                    <meta name="keywords" content="کوییزلند, حمایت" />
                </Head>

                <div className="basicPage wrapper-sm center">
                    <h2>از این که تصمیم به حمایت از کوییزلند کردید خیلی قدردانیم</h2>
                    <p>اما لازم نیست به ما حمایت پولی کنید. همین که ما رو به <bold>دوستاتون و خانوادتون معرفی کنید</bold> برای ما خیلی با ارزشه</p>
                    <h5> 💗 قدردان شما کوییزلندی عزیز هستیم 💗 </h5>
                </div>

                <BackBtn />
            </Layout>
        </>
    );
}
 
export default Support;