import React, { useEffect } from 'react'
import BackBtn from '../components/backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: url(${pathRed}) center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header
                title='حریم خصوصی | کوئيزلند'
            />

            <div className="basicPage wrapper-sm center">
                <h2>تمام اطلاعات جزئی شما که توسط کوئیزلند دریافت میشود تنها برای بهتر کردن تجربه‌ی شما است و این اطلاعات</h2>
                <p>.کوکی ها هستند که باعث میشوند تجربه‌ی شما در آینده در این سایت سریع تر و بهتر شود</p>
                <p>و در صورت درخواست، ایمیل شما، برای اطلاع رسانی بهتر شما به کوئیز های جدید که شاید به آنها علاقه‌مند باشید</p>
                
                <h5>💗کوئیزلند</h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;