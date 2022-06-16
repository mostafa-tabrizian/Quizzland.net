import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import BackBtn from '../components/backBtn'
import Header from '../components/header'
import Footer from '../components/footer'

const pathRed = '/static/img/bubbles.png'

const Contact = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style = `background: #0a0d13 url(${pathRed}) center center scroll !important`
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

            <div className="basicPage wrapper-sm m-auto">
                <h1>برای تماس با ما میتونید از روش های زیر استفاده کنید </h1>
                <div>
                    <ul className="text-red-600 font-bold flex justify-center items-center">
                        {/* <li className="hoverAnimation"><a href="#">انستگرام</a></li> */}
                        {/* <li className="hoverAnimation"><a href="#">تلگرام</a></li> */}
                        <li className="hoverAnimation">
                            <Link to="mailto:support@quizzland.net"><a>ایمیل</a></Link>
                        </li>
                    </ul>
                    <Link to="mailto:support@quizzland.net"><a>support@quizzland.net</a></Link>
                </div>
                <p>
                    میتونی تمام نظرات و پیشنهادات خودت رو برامون بفرستی <br /> اینطوری کمکمون میکنی و باعث میشی سریعتر پیشرفت کنیم .💖
                </p>
            </div>

            <BackBtn />

            <Footer />
        </React.Fragment>
    );
}

export default Contact;