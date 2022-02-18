import React, { useEffect } from 'react'
import BackBtn from '../components/backBtn'
import { Helmet } from "react-helmet";
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>
            
            <Header linkType='Link'/>

            <Helmet>
                <title>حریم خصوصی | کوییزلند</title>
                <meta name="description" content="حریم خصوصی در کوییزلند" />
                <meta name="keywords" content="حریم خصوصی, کوییزلند" />
            </Helmet>

            <div className="basicPage wrapper-sm center">
                <h2>تمام اطلاعات جزئی شما که توسط کوییزلند دریافت میشود تنها برای بهتر کردن تجربه‌ی شما است و این اطلاعات</h2>
                <p>.کوکی ها هستند که باعث میشوند تجربه‌ی شما در آینده در این سایت سریع تر و بهتر شود</p>
                <p>و در صورت درخواست، ایمیل شما، برای اطلاع رسانی بهتر شما به کوییز های جدید که شاید به آنها علاقه‌مند باشید</p>
                
                <h5>💗کوییزلند</h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;