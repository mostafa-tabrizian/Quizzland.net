import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import Header from '../components/header'

import BackBtn from '../components/backBtn'

const pathRed = '/static/img/bubbles.png'

const SOS = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])
    
    return (
        <React.Fragment>
            
            <Header />

            <Helmet>
                <title>کوییزلند تحت تیم فنی است</title>
                <meta name="description" content="کوییزلند تحت تیم فنی است" />
                <meta name="keywords" content="کوییزلند" />
                <meta name="robots" content="noindex"></meta>
            </Helmet>
    
            <div class="basicPage wrapper-med center pos-rel" style={{background: '#0000008c', backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1'}}>
                <h1>🚧🔧 کوییزلند در حال حاضر در دسترس نیست 🚧🔧 </h1>
                <div class="space-sm">
                    <p className='text-center'> تیم فنی در حال آپدیت، بررسی و تعمیر برخی مشکلات سایت است </p>
                    <p className='text-center'>لطفا در چند دقیقه آینده دوباره تلاش کنید</p>
                    <p className='text-center'>قدردان صبر شما هستیم 💗</p>
                    <br />
                    <a href="mailto:support@quizzland.net?subject= در سایت کوییزلند به یه مشکلی برخوردم" target="_blank" rel="noreferrer">support@quizzland.net</a>
                </div>
            </div>
    
            <BackBtn />
        </React.Fragment>
    );
}
 
export default SOS;