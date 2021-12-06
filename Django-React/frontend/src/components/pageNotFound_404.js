import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";

import BackBtn from './backBtn'
import Header from './header'

const pathRed = '../images/bubbles.png'

const PageNotFound_404 = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])
    
    return (
        <React.Fragment>
            
            <Header linkType='Hot'/>

            <Helmet>
                <title>صفحه مورد نظر پیدا نشد |‌ کوییزلند</title>
                <meta name="description" content="صفحه مورد نظر پیدا نشد" />
                <meta name="keywords" content="کوییزلند" />
                <meta name="robots" content="noindex"></meta>
            </Helmet>
    
            <div class="basicPage wrapper-sm center pos-rel" style={{background: '#0000008c', backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1'}}>
                <h1> 🤔 صفحه‌ی مورد نظر پیدا نشد </h1>
                <div class="space-sm">
                    <p>💖 اگه فکر میکنی اشتباهی پیش اومدی ممنون میشیم برامون به<a href="mailto:support@quizzland.net?subject= در سایت کوییزلند به یه مشکلی برخوردم"> این ایمیل</a> پیام بدی</p>
                    <a href="mailto:support@quizzland.net?subject= در سایت کوییزلند به یه مشکلی برخوردم" target="_blank" rel="noreferrer">support@quizzland.net</a>
                </div>
            </div>

            <span className="pageNotFound">404</span>
    
            <BackBtn />
        </React.Fragment>
    );
}
 
export default PageNotFound_404;