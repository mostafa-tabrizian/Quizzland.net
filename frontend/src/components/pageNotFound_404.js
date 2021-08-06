import React, { useEffect } from 'react';

import BackBtn from './backBtn'
import HotHeader from './hotHeader'

const pathRed = '/static/img/bubbles.png'

const PageNotFound_404 = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: url(${pathRed}) center center scroll !important`
        }
    }, [])
    
    return (
        <React.Fragment>
            
            <HotHeader
                title='صفحه مورد نظر پیدا نشد |‌ کوییزلند'
            />
    
            <div class="basicPage wrapper-sm center">
                <h1> 🤔 صفحه‌ی مورد نظر پیدا نشد </h1>
                <div class="space-sm">
                    <p>💖 اگه فکر میکنی اشتباهی پیش اومدی ممنون میشیم برامون به<a href="mailto:quizzland.net@gmail.com?subject= در سایت کوییزلند به یه مشکلی برخوردم"> این ایمیل</a> پیام بدی</p>
                    <a href="mailto:quizzland.net@gmail.com?subject= در سایت کوییزلند به یه مشکلی برخوردم" target="_blank" rel="noreferrer">quizzland.net@gmail.com</a>
                </div>
            </div>
    
            <BackBtn />
        </React.Fragment>
    );
}
 
export default PageNotFound_404;