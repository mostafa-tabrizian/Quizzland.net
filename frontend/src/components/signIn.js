import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import '/static/css/style.css'
require('/static/css/nightTheme.css')

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        document.querySelector('.footer').remove()
    }, [])

    return (
        <React.Fragment>

            <Helmet>
                <title>ورود | کوییزلند</title>
                <meta name="description" content="ورود به کوییزلند" />
                <meta name="keywords" content="ورود, کوییزلند" />
            </Helmet>


            <div className='signIn wrapper-med tx-al-c'>
                <h1>ورود به کوییزلند</h1>
                <h5>یا <span style={{color: '#cf3815'}}><a href='/signUp'>ثبت نام</a></span> برای دسترسی به امکانات بسیار به علاوه پست کردن کوییز خود</h5>
                <div>
                    sign in with google
                </div>

                <div className='signIn_OrLine flex flex-jc-c flex-ai-c tx-al-c'>
                    <hr />
                    <span>یا</span>
                    <hr />
                </div>

                <div className='signIn_manual space-sm'>
                    <h2>نام کاربری یا ایمیل</h2>
                    <input type="text" />
                    <h2>رمز عبور</h2>
                    <input type="password" name="" id="" />
                </div>

                <button className='signIn_submit space-sm'>ورود</button>

                <p className='space-sm tx-al-c'>
                    کوییزلند توسط reCaptcha محافظت میشود و تمام قوانین امنیتی گوگل اعمال میشود.
                </p>

                <h5 className='signIn_forgotPassword'>رمز ورودم رو فراموش کردم</h5>
            </div>

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;