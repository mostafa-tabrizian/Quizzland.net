import React, {useState, useRef} from 'react';
import axios from 'axios';

import { log } from './base'

const Newsletter = () => {
    const [newsletterOpen, setNewsletterOpen] = useState(false)

    const userEmail = useRef()
    const userUsername = useRef()
    const openCloseNewsletterRef = useRef()
    const reCaptchaRef = useRef()

    const openCloseNewsletter = () => {
        setNewsletterOpen(newsletterOpen ? false : true)
        document.body.style.overflow = newsletterOpen ? 'overlay' : 'hidden'
    }

    const addNewUserToNewsletter = async () => {
        const detail = {
            "email": userEmail.current.value,
            "username": userUsername.current.value,
            "signedUp_On": new Date()
        }

        await axios.post(`/dbAPI/newsletter_users/`, detail)
        alert('شما با موفقیت در خبرنامه ثبت نام کردید')
        openCloseNewsletterRef.current.click()
    }

    const alertUserThatHeSignedUpBefore = (userDetail) => {
        alert(`عزیز ${userDetail.username} \n شما  از قبل در تاریخ ${userDetail.signedUp_On.slice(0, 10)} \n ثبت نام کرده اید. \n با تشکر، کوییزلند 💜`)
    }

    const checkIfTheUserExists = async (userEmail) => {
        const resultOfCheck = await axios.get(`/dbAPI/newsletter_users/?email__iexact=${userEmail}`)
        if (resultOfCheck.data.length === 0) {
            addNewUserToNewsletter()
        } else {
            alertUserThatHeSignedUpBefore(resultOfCheck.data[0])
        }
    }

    const detailSubmitted = (e) => {
        e.preventDefault()

        // if (reCaptcha) {
            if(userEmail.current.value.length >= 3) {
                checkIfTheUserExists(userEmail.current.value)
            } else {
                alert('حداقل ۳ کارکتر وارد کنید')
            }
        // } else {
        //     alert('!لطفا تایید کنید که ربات نیستید')
        // }
    }

    // const sendRecaptchaDetail = () => {
    //     setRecaptcha(true)
    //     const recaptchaValue = reCaptchaRef.current.getValue();
    // }

    return (
        <React.Fragment>
            <p className="tx-al-c wrapper-sm"> اگه هیجان داری کوییز های جدید رو سریع تر از بقیه انجام بدی میتونی اینجا ایمیلت رو وارد کنی که سریعتر از هر کسی خبر دارت کنیم </p>

            <button onClick={openCloseNewsletter} className="btn" type="button" aria-label="Sign Up To Newsletter">🖊️ ثبت نام در خبرنامه</button>

            <div className={`${newsletterOpen ? 'newsletter__blurBackground' : ''}`}>
                <form onSubmit={reCaptchaRef} className={`newsletter ${newsletterOpen ? 'fadeIn' : 'fadeOut'}`}>
                    <button ref={openCloseNewsletterRef} onClick={openCloseNewsletter} type="button" className="btn newsletter__closeBtn" aria-label="Close Newsletter Form Button"></button>
                    <p className="tx-al-c">لطفا نام و ایمیل خود را وارد نمائيد</p>
                    
                    <input ref={userEmail} type='email' className='input' name='userEmail' placeholder='  ایمیل ...' max_length='100' required label='' />
                    <input ref={userUsername} type='string' className='input' name='userName' placeholder='  نام ...' max_length='20' mix_length='3' required label='' />

                    <button onClick={detailSubmitted} className='btn newsletter__submit' type="submit" value="send" aria-label="Submit Newsletter Form For Signing Up">ثبت نام </button>
                </form>
            </div>
        </React.Fragment>
    );
}
 
export default Newsletter;