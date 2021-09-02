import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

import BackBtn from '../components/backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const Contact = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: url(${pathRed}) center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>تماس با ما | ‌کوییزلند</title>
                <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                <meta name="keywords" content="پشتیبانی کوییزلند" />
            </Helmet>

            <div className="basicPage center wrapper-sm">
                <h3>برای تماس با ما میتونید از روش های زیر استفاده کنید </h3>
                <div>
                    <ul className="contact__socialMedia flex flex-jc-c flex-ai-c">
                        {/* <li className="hoverAnimation"><a href="#">انستگرام</a></li> */}
                        {/* <li className="hoverAnimation"><a href="#">تلگرام</a></li> */}
                        <li className="hoverAnimation"><a href="mailto:quizzland.net@gmail.com">ایمیل</a></li>
                    </ul>
                    <a href="mailto:quizzland.net@gmail.com">Quizzland.net@gmail.com</a>
                </div>
                <p>
                    .میتونی تمام نظرات و پیشنهادات خودت رو برامون بفرستی <br/> 💖 اینطوری کمکمون میکنی و باعث میشی سریعتر پیشرفت کنیم
                </p>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default Contact;