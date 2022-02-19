import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

import BackBtn from './backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const Ads = () => {
    
    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])
    
    return (
        <React.Fragment>

            <Header linkType='Link'/>
                
            <Helmet>
                <title>تبلیغات |‌ کوییزلند</title>
                <meta name="description" content="تبلیغات در سایت کوییزلند" />
                <meta name="keywords" content="تبلیغات, کوییزلند" />
            </Helmet>
                
            <div className="basicPage center wrapper-sm">
                <h3>برای تبلیغ در بنر های کوییزلند میتونید با پشتیبانی بابت هماهنگی در تماس باشید</h3>
                <Link href="mailto:support@quizzland.net"><a>support@quizzland.net</a></Link>
                <div>
                    <ul className="text-red-600 font-bold flex justify-center flex-ai-c">
                        {/* <li><Link href="#"><a>انستگرام</a></Link></li> */}
                        {/* <li><Link href="#"><a>تلگرام</a></Link></li> */}
                        <li><Link href="mailto:support@quizzland.net"><a>ایمیل</a></Link></li>
                    </ul>
                </div>
                <h5>💗کوییزلند</h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default Ads;