import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import Header from './header'
import { Link } from 'react-router-dom'

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>
            
            <Header />

            <Helmet>
                <title>ثبت نام | کوییزلند</title>
                <meta name="description" content="ثبت نام در کوییزلند" />
                <meta name="keywords" content="ثبت نام, کوییزلند" />
            </Helmet>

            <div className='signIn wrapper-med tx-al-c'>
                <h1>ثبت نام در کوییزلند</h1>
                <h5>یا اگه از قبل اکانت داری <span style={{color: '#cf3815'}}><a href='/signIn'>وارد</a></span> اکانتت شو</h5>
                <div>
                    sign up with google
                </div>

                <div className='signIn_OrLine flex flex-jc-c flex-ai-c tx-al-c'>
                    <hr />
                    <span>یا</span>
                    <hr />
                </div>

                <div className='signIn_manual space-sm'>
                    <h2>ایمیل</h2>
                    <input type="text" />
                    <h2>یه رمز انتخاب کن</h2>
                    <input type="password" name="" id="" />
                    <h2>رمزت رو دوباره وارد کن</h2>
                    <input type="text" name="" id="" />
                    <h2>یه نام کاربری انتخاب کن</h2>
                    <input type="text" name="" id="" />
                </div>

                <button className='signIn_submit space-sm'>ثبت نام</button>

                <p className='space-sm tx-al-c'>
                    کوییزلند توسط reCaptcha محافظت میشود و تمام قوانین امنیتی گوگل اعمال میشود.
                </p>
            </div>

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;