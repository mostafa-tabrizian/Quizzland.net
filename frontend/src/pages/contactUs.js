import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import { getTheme } from '../components/base'

const pathRed = '/static/img/bubbles.webp'

const Contact = () => {

    useEffect(() => {
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'} url(${pathRed}) center center scroll`
    }, [])

    return (
        <React.Fragment>

            <Helmet>
                <title>تماس با ما | ‌کوییزلند</title>
                <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                <meta name="keywords" content="پشتیبانی کوییزلند" />
            </Helmet>

            <h1 className='mt-5 text-center title'>تماس با ما</h1>

            <div className="mx-auto basicPage wrapper-sm">
                <h1>برای تماس با ما میتونید از روش های زیر استفاده کنید </h1>
                <div>
                    <ul className="flex items-center justify-center font-bold text-red-600">
                        {/* <li className="hoverAnimation"><a href="#">انستگرام</a></li> */}
                        {/* <li className="hoverAnimation"><a href="#">تلگرام</a></li> */}
                        <li className="hoverAnimation">
                            <Link to="mailto:support@quizzland.net"><a>ایمیل</a></Link>
                        </li>
                    </ul>
                    <Link to="mailto:support@quizzland.net"><a>support@quizzland.net</a></Link>
                </div>
                <p className={`${getTheme() == 'dark' ? 'text-white' : 'text-[#060101]'}`}>
                    میتونی تمام نظرات و پیشنهادات خودت رو برامون بفرستی <br /> اینطوری کمکمون میکنی و باعث میشی سریعتر پیشرفت کنیم .💖
                </p>
            </div>

        </React.Fragment>
    );
}

export default Contact;