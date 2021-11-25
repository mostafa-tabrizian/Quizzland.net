import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from "react-helmet";
import Header from './header'
import { log } from './base'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { buffer } from 'buffer'
import shajs from 'sha.js'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])

    const userEmail = useRef(null)
    const userName = useRef(null)
    const userPassword = useRef(null)
    const userPasswordRepeat = useRef(null)

    const [passwordNotTheSameState, setPasswordNotTheSameState] = useState(false)
    const [userNameExistState, setUserNameExistState] = useState(false)
    const [emailExistState, setEmailExistState] = useState(false)

    const submitSignUpUserData = async () => {
        const userNameInput = userName.current.value
        const userEmailInput = userEmail.current.value
        const userPasswordRef = userPassword.current.value
        const userPasswordRepeatRef = userPasswordRepeat.current.value

        const inputFilled = () => {
            return (userNameInput !== '' && userEmailInput !== '')
        }

        const newUserNameAndEmail = async () => {
            const grabUsernameData = await axiosLimited.get(`/dbAPI/profile/?username=${userNameInput}&limit=1`)
            const grabEmailData = await axiosLimited.get(`/dbAPI/profile/?email=${userEmailInput}&limit=1`)
            const emailExistInDB = grabEmailData.data.results[0] != null
            const userNameExistInDB = grabUsernameData.data.results[0] != null

            if (emailExistInDB) {
                setEmailExistState(true)
            }

            else if (userNameExistInDB) {
                setUserNameExistState(true)
            }

            else if (userPasswordRef !== userPasswordRepeatRef) {
                setPasswordNotTheSameState(true)
            }

            else { // New User
                return true
            }
        }

        if (inputFilled() && await newUserNameAndEmail()) {
            const hashUserPasswordBeforeSubmit = shajs('sha256').update(userPasswordRef).digest('hex')

            const session = JSON.stringify({ userNameInput, hashUserPasswordBeforeSubmit })
            localStorage.setItem('signInSession', session);

            window.location.href = `${window.location.origin}/newProfile?u=${userNameInput}&e=${userEmailInput}&p=${hashUserPasswordBeforeSubmit}`  // Send data to db
        }
    }

    return (
        <React.Fragment>
            
            <Header linkType='Link'/>

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
                    <div className="flex flex-jc-c">
                        <div>
                            <h2>یه نام کاربری انتخاب کن</h2>
                            <input ref={userName} type="text" name="" id="" />
                            {
                                userNameExistState &&
                                <h5 style={{color: 'red'}}>نام کاربری از قبل استفاده شده</h5>
                            }
                        </div>
                        <div>
                            <h2>ایمیل</h2>
                            <input ref={userEmail} type="text" />
                            {
                                emailExistState &&
                                <h5 style={{color: 'red'}}>ایمیل از قبل ثبت شده</h5>
                            }
                        </div>
                    </div>
                    <div className='flex flex-jc-c space-sm'>
                        <div>
                            <h2>رمزت رو دوباره وارد کن</h2>
                            <input ref={userPasswordRepeat} type="password" name="" id="" />
                            {
                                passwordNotTheSameState &&
                                <h5 style={{color: 'red'}}>رمز ها یکسان نیستند</h5>
                            }
                        </div>
                        <div>
                            <h2>یه رمز انتخاب کن</h2>
                            <input ref={userPassword} type="password" name="" id="" />
                        </div>
                    </div>
                </div>

                <button className='signIn_submit space-sm' onClick={submitSignUpUserData}>ثبت نام</button>

                <p className='space-sm tx-al-c'>
                    کوییزلند توسط reCaptcha محافظت میشود و تمام قوانین امنیتی گوگل اعمال میشود.
                </p>
            </div>

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;