import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";

import { buffer } from 'buffer'
import shajs from 'sha.js'

import '/static/css/style.css'
require('/static/css/nightTheme.css')
import { log } from './base'

const pathRed = '/static/img/bubbles.png'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

const SignIn = () => {
    const [userNotFound, setUserNotFound] = useState(false)
    const [passwordIncorrect, setPasswordIncorrect] = useState(false)

    const usernameEmailRef = useRef(null)
    const passwordRef = useRef(null)

    useEffect(() => {
        document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        document.querySelector('.footer').remove()
    }, [])

    const signIn = (password) => {
        const username = usernameEmailRef.current.value
        const session = JSON.stringify({ username, password })
        localStorage.setItem('signInSession', session);
        // go profile page
    }

    const checkPassword = (loggedPassword, userPassword) => {
        const loggedPasswordHashed = shajs('sha256').update(loggedPassword).digest('hex')
        
        if (loggedPasswordHashed == userPassword) {
            setPasswordIncorrect(false)
            signIn(loggedPasswordHashed)
        } else {
            setUserNotFound(false)
            setPasswordIncorrect(true)
        }
    }

    const submitSignInForm = async () => {
        const username = usernameEmailRef.current.value
        const loggedPassword = passwordRef.current.value

        
        const grabUsernameDate = await axiosLimited.get(`/dbAPI/profile/?username=${username}&limit=1`)
        const checkUsernameExist = grabUsernameDate.data.results[0]
        
        if (checkUsernameExist) {
            const userPassword = grabUsernameDate.data.results[0].password
            checkPassword(loggedPassword, userPassword)
        } else {
            setUserNotFound(true)
        }
    }

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
                    <h3>نام کاربری یا ایمیل</h3>
                    <input ref={usernameEmailRef} type="text" />
                    {userNotFound && <h4 style={{color: 'red'}}>همچین نام کاربری وجود ندارد</h4>}
                    <h3>رمز عبور</h3>
                    <input ref={passwordRef} type="password" name="" id="" />
                    {passwordIncorrect && <h4 style={{color: 'red'}}>رمز وارد شده اشتباه است</h4>}
                </div>

                <button className='signIn_submit space-sm' onClick={() => {submitSignInForm()}}>ورود</button>

                <p className='space-sm tx-al-c'>
                    کوییزلند توسط reCaptcha محافظت میشود و تمام قوانین امنیتی گوگل اعمال میشود.
                </p>

                <h5 className='signIn_forgotPassword'>رمز ورودم رو فراموش کردم</h5>
            </div>

        </React.Fragment>
    );
}
 
export default SignIn;