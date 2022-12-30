import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";
import { getTheme } from '../components/base'

const pathRed = '/static/img/bubbles.webp'

const PrivacyPolicy = () => {

    useEffect(() => {
        // document.querySelector('body').style = `background: ${getTheme() == 'light' ? 'white' : '#060101'} url(${pathRed}) center center scroll`
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [])

    return (
        <React.Fragment>

            <Helmet>
                <title>حریم خصوصی | کوییزلند</title>
                <meta name="description" content="حریم خصوصی در کوییزلند" />
                <meta name="keywords" content="حریم خصوصی, کوییزلند" />
            </Helmet>

            <h1 className='mt-5 text-center title'>حریم خصوصی شما</h1>

            <div className='space-y-5 max-w-[40rem] md:mx-auto mx-5 mt-5 mb-20'>
                <p>تمام اطلاعات جزئی شما که توسط کوییزلند دریافت میشود تنها برای بهتر کردن تجربه ی شما است.</p>
                <p>
                    کوییزلند با تاکید بر احترامی که برای حریم شخصی کاربران قائل است، ذخیره، لایک و کامنت بر روی کوییز ها یا استفاده از برخی امکانات وب‌سایت، اطلاعاتی را از کاربران درخواست می‌کند تا بتواند خدماتی امن و مطمئن را به کاربران ارائه دهد. اطلاعاتی مانند ایمیل و نام و نام خانوادگی.
                </p>
                <p>
                    کوییزلند اطلاعات را توسط کوکی (cookie) جمع آوری می کند. کوکی فایلی است که به درخواست یک سایت، توسط مرورگر ایجاد می‌شود و به سایت امکان ذخیره بازدید‌های شما و مناسب‌سازی آنها برای تجربه شما در آینده را فراهم می‌نماید.
                </p>
                {/* <p>
                    کوییزلند ممکن است نقد و کامنت های ارسالی کاربران را در راستای رعایت قوانین وب سایت حذف کند. کاربران ضمن استفاده از خدمات وب‌سایت کوییزلند، حق ویرایش اطلاعات و استفاده از آنها را در چارچوب فوق‌الذکر به کوییزلند اعطا نموده و حق اعتراض را از خود سلب می‌نمایند.
                </p> */}
                <p>
                    کوییزلند برای حفاظت و نگهداری اطلاعات و حریم شخصی کاربران همه توان خود را به کار می‌گیرد و امیدوار است که تجربه خوشایند را برای همه کاربران فراهم آورد.
                </p>
            </div>

        </React.Fragment>
    );
}

export default PrivacyPolicy;