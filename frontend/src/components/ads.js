import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

import BackBtn from '../components/backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const Ads = () => {
    
    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: url(${pathRed}) center center scroll !important`
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
                <a href="mailto:quizzland.net@gmail.com">Quizzland.net@gmail.com</a>
                <div>
                    <ul className="contact__socialMedia flex flex-jc-c flex-ai-c">
                        <li><a href="#">انستگرام</a></li>
                        <li><a href="#">تلگرام</a></li>
                        <li><a href="mailto:quizzland.net@gmail.com">ایمیل</a></li>
                    </ul>
                </div>
                <h5>💗کوییزلند</h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default Ads;