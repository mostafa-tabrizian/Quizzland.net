import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import BackBtn from './backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const AdvertiseContact = () => {
    
    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
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
                    <ul className="text-red-600 font-bold flex justify-center items-center">
                        {/* <li><a href="#"><a>انستگرام</a></a></li> */}
                        {/* <li><a href="#"><a>تلگرام</a></a></li> */}
                        <li><a href="mailto:support@quizzland.net">ایمیل</a></li>
                    </ul>
                </div>
                <h5>💗کوییزلند</h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default AdvertiseContact;