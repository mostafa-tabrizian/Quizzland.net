import React, { useEffect } from 'react';
import Head from 'next/head'

import BackBtn from '../components/backBtn'

const pathRed = '../images/bubbles.png'

const PageNotFound_404 = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])
    
    return (
        <>

            <Head>
                <title>سرور های کوییزلند به مشکل برخورده |‌ کوییزلند</title>
                <meta name="description" content="سرور های کوییزلند به مشکل برخورده" />
                <meta name="keywords" content="کوییزلند" />
                <meta name="robots" content="noindex"></meta>
            </Head>
    
            <div className="basicPage wrapper-sm center pos-rel" style={{background: '#0000008c', backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1'}}>
                <h1>سرور های کوییزلند به مشکل برخورده  😨</h1>
                <div className="space-sm">
                    <p>یه خورده صبر کن مشکل حتما حل میشه. <br/> ولی اگه دیدی حل نشد میتونه به<a href="mailto:support@quizzland.net?subject= در سایت کوییزلند به یه مشکلی برخوردم به کد ۵۰۰"> این ایمیل</a> بهمون اطلاع بدی</p>
                    <a href="mailto:support@quizzland.net?subject= در سایت کوییزلند به یه مشکلی برخوردم به کد ۵۰۰" target="_blank" rel="noreferrer">support@quizzland.net</a>
                </div>
            </div>

            <span className="pageNotFound">500</span>
    
            <BackBtn />
        </>
    );
}
 
export default PageNotFound_404;