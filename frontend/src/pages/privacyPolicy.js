import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { getTheme } from '../components/base'

const pathRed = '/static/img/bubbles.webp'

const PrivacyPolicy = () => {

    useEffect(() => {
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'} url(${pathRed}) center center scroll`
    }, [])

    return (
        <React.Fragment>

            <Helmet>
                <title>حریم خصوصی | کوییزلند</title>
                <meta name="description" content="حریم خصوصی در کوییزلند" />
                <meta name="keywords" content="حریم خصوصی, کوییزلند" />
            </Helmet>

            <h1 className='mt-5 text-center title'>حریم خصوصی شما</h1>

            <div className="mx-auto basicPage wrapper-sm">
                <h2>تمام اطلاعات جزئی شما که توسط کوییزلند دریافت میشود تنها برای بهتر کردن تجربه ی شما است و این اطلاعات</h2>
                <div className='space-sm'>
                    <p>.کوکی ها هستند که باعث میشوند تجربه ی شما در آینده در این سایت سریع تر و بهتر شود</p>
                    <p>و در صورت درخواست، ایمیل شما، برای اطلاع رسانی بهتر شما به کوییز های جدید که شاید به آنها علاقه مند باشید</p>
                </div>

                <h5>💗کوییزلند</h5>
            </div>

        </React.Fragment>
    );
}

export default PrivacyPolicy;