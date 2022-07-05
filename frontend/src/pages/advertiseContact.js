import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import Header from '../components/header'
import Footer from '../components/footer'

const pathRed = '/static/img/bubbles.webp'

const AdvertiseContact = () => {

    useEffect(() => {
        document.querySelector('body').style = `background: #0a0d13 url(${pathRed})) center center scroll`
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>تبلیغات |‌ کوییزلند</title>
                <meta name="description" content="تبلیغات در سایت کوییزلند" />
                <meta name="keywords" content="تبلیغات, کوییزلند" />
            </Helmet>

            <div className="basicPage center wrapper-sm">
                <h3>برای تبلیغ در بنر های کوییزلند میتونید با پشتیبانی بابت هماهنگی در تماس باشید</h3>
                <a href="mailto:support@quizzland.net">support@quizzland.net</a>
                <div>
                    <ul className="flex items-center justify-center font-bold text-red-600">
                        {/* <li><a href="#"><a>انستگرام</a></a></li> */}
                        {/* <li><a href="#"><a>تلگرام</a></a></li> */}
                        <li><a href="mailto:support@quizzland.net">ایمیل</a></li>
                    </ul>
                </div>
                <h5>💗کوییزلند</h5>
            </div>

        </React.Fragment>
    );
}

export default AdvertiseContact;