import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import BackBtn from '../components/backBtn'
import Header from '../components/header'
import Footer from '../components/footer'

const pathRed = '/static/img/bubbles.png'

const Support = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style = `background: #0a0d13 url('${pathRed}') center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>حمایت |‌کوییزلند</title>
                <meta name="description" content="حمایت از کوییزلند" />
                <meta name="keywords" content="کوییزلند, حمایت" />
            </Helmet>

            <div className="basicPage wrapper-sm center">
                <h2>از این که تصمیم به حمایت از کوییزلند کردید خیلی قدردانیم</h2>
                <p>اما لازم نیست به ما حمایت پولی کنید. همین که ما رو به <b>دوستاتون و خانوادتون معرفی کنید</b> برای ما خیلی با ارزشه</p>
                <h5> 💗 قدردان شما کوییزلندی عزیز هستیم 💗 </h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}

export default Support;