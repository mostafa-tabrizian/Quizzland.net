import React, { useEffect } from 'react'

import BackBtn from '../components/backBtn'
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const Support = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: url('${pathRed}') center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>

            <Header
                title='حمایت |‌کوئيزلند'
            />

            <div className="basicPage wrapper-sm center">
                <h2>از این که تصمیم به حمایت از کوئیزلند کردید خیلی قدردانیم</h2>
                <p>اما لازم نیست به ما حمایت پولی کنید. همین که ما رو به <bold>دوستاتون و خانوادتون معرفی کنید</bold> برای ما خیلی با ارزشه</p>
                <h5> 💗 قدردان شما کوئیزلندی عزیز هستیم 💗 </h5>
            </div>

            <BackBtn />

        </React.Fragment>
    );
}
 
export default Support;