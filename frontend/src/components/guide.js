import React, { useEffect } from 'react'
import { Helmet } from "react-helmet";

import Header from './header'

const lightMode = '/static/img/lightMode.png'
const nightMode = '/static/img/nightMode.png'
const pathRed = '/static/img/bubbles.png'

const Guide = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: black url(${pathRed}) center center scroll !important`
        }
    }, [])
    
    return (
        <React.Fragment>

          <Header />

          <Helmet>
              <title>راهنما | کوییزلند</title>
              <meta name="description" content="راهنمای وب سایت کوییزلند" />
              <meta name="keywords" content="کوییزلند, راهنمای وب سایت کوییزلند" />
          </Helmet>

          <div className="basicPage center wrapper-sm">
              <h1>راهنمای کوییزلند</h1>

              <div className="tx-al-r space-med">
                  <h2 className="space-sm">انتخاب کتگوری یا دسته </h2>
                  <p>
                      اگه تصمیم به انجام کتگوری خاصی از کوییز ها دارید، میتونید از بخش منوی وب‌ سایت بر روی ( کتگوری ها ) کلیک کنید و گزینه مورد نظر خود را انتخاب کنید و سپس زیر مجموعه‌ی خود را انتخاب کنید
                  </p>
                  <p>
                      اما اگر زیر مجموعه خاصی در نظر دارید و نمیخواهید در تمام صفحات سایت به دنبال آن بگردید. میتوانید از بخش بالاچپ سایت از بخش جستجو کمک بگیرید و عبارت خود را سرچ کنید
                  </p>

                  <h2 className="space-l">انتخاب کوییز یا تست</h2>
                  <p>
                      از بخش منوی سایت میتوانید با کلیک بر ( کوییز ها ) جدیدترین و بهترین کوییز های کوییزلند رو ببینید
                  </p>
                  <p>
                      و یا با استفاده از بخش جستجوی بالا سمت چپ صفحه، کوییز مورد نظر خود را سرچ کنید
                  </p>

                  <h2 className="space-l">فعال کردن حالت شب</h2>
                  <p>
                      کوییزلند قادر به تبدیل به حالت شب است
                  </p>
                  <p>
                      تنها کافیه از بخش منو تصویر ماه را کلیک کنید تا وب‌ سایت به حالت شب تبدیل شود
                  </p>
                  <img className="nightMode__container" style={{position: 'relative'}} src={nightMode} alt="حالت شب کوییزلند" loading="lazy" />
                  <p>
                      و برای برگشت به حالت روز، تنها کافی است دوباره بر روی این گزینه که تصویر خورشید گرفته است کلیک مجدد کنید
                  </p>
                  <img className="nightMode__container" style={{position: 'relative'}} src={lightMode} alt="حالت روز کوییزلند" loading="lazy" />

                  <h2 className="space-l">کوییزها و روش کار با آنها</h2>

                  <h4 className="space-med">انواع کوییز ها</h4>
                  <p>
                      در کوییزلند ۲ نوع کوییز وجود دارد
                  </p>
                  <p>
                      کوییز های درست و غلط که در نهایت بر اساس تعداد درست های شما امتیاز محاسبه میشود
                  </p>
                  <p>
                      و کوییز های دیگر که به عبارتی تست خطاب میشوند و هیچ گزینه ‌ی غلطی وجود ندارد بر اساس نمره شما به شما نتیجه نشان میدهد مانند تست های روانشناسی
                  </p>

                  <h4 className="space-med">روش های تغییر سوال ها</h4>
                  <p>
                      در کوییز ها ۲ روش تغییر سوال وجود دارد
                  </p>
                  <p>
                      یک به شکل دستی و استفاده از فلش ها
                  </p>
                  <p>
                      و یا به شکل خودکار با فعال و غیر فعال کردن گزینه میان فلش ها که سبز به معنای فعال بودن و قرمز به معنای غیر فعال بودن آن است
                  </p>
                  <p>
                      هنگام فعال کردن حالت خودکار، پس از پاسخ به سوال پس از ۵ ثانیه به سوال بعدی میرود
                  </p>

                  <h4 className="space-med">اشتراک گذاری نتیجه هر کوییز</h4>
                  <p>
                      با استفاده از دکمه اشتراک گذاری در صفحه‌ی نتیجه، لینکی پیش شما کپی میشود که حاوی پیام امتیاز شما و نام عنوان کوییز انجام شده می‌باشد، همچنین به همراه لینک کوییز برای مثال
                  </p>

                  {/* <h4 className="space-med">منبع اصلی هر کوییز</h4>
                  <p>
                      کوییز هایی که ارزش علمی داشته باشند، در انتهای هر نتیجه کوییز منبع ذکر خواهد شد تا از صحت کوییز و تست اطمینان یابید و حق نشر رعایت شود
                  </p> */}

                  <h5 className="space-med tx-al-c">
                      اگر به کمک بیشتری هستید میتوانید از <a style={{textDecoration: 'underline'}} href="/contact">اینجا</a> با ما در تماس باشید
                  </h5>
                  <h5 className="tx-al-l"><a href="/welcomeZeynab">💗</a> کوییزلند</h5>
                  
              </div>
          </div>
      </React.Fragment>
    );
}
 
export default Guide;