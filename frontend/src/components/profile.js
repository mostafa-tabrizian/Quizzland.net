import React, { useEffect } from 'react'
import BackBtn from '../components/backBtn'
import { Helmet } from "react-helmet";
import Header from './header'

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])

    return (
        <React.Fragment>
            
            <Header />

            <Helmet>
                <title>پروفایل | کوییزلند</title>
                <meta name="description" content="پروفایل شما در کوییزلند" />
                <meta name="keywords" content="پروفایل, کوییزلند" />
            </Helmet>

            <div className='wrapper-med'>
                <h1>اطلاعات پروفایل</h1>
                <div className="profile_information tx-al-r space-sm">
                    <div className='profile_picture flex flex-ai-c flex-jc-fs'>
                        <div>
                            <img src="https://i.pinimg.com/474x/8e/d5/0a/8ed50a01d82d46364dc6208972ec20f4.jpg" alt="" />
                        </div>
                        <div className='tx-al-c'>
                            <button className='profile_picture_uploadBtn'>
                                    آپلود عکس جدید
                            </button>
                            <button>
                                    حذف عکس
                            </button>
                        </div>
                    </div>
                    <div className="profile_username">
                        <h3>نام کاربری</h3>
                        <input type="text"placeholder='username' />
                    </div>
                    <div className="profile_detail space-sm">
                        <div className='flex flex-ai-c'>
                            <div>
                                <h3>اسم کامل</h3>
                                <input type="text" placeholder='full name' />
                            </div>
                            <div>
                                <h3>عنوان</h3>
                                <input type="text" placeholder='title' />
                            </div>
                        </div>

                        <div className='flex flex-ai-c space-sm'>
                            <div>
                                <h3>درباره</h3>
                                <input type="text" placeholder='bio' />
                            </div>
                            <div>
                                <h3>تاریخ تولد</h3>
                                <select name="" id="">
                                    <option value="month">month</option>
                                    <option value="day">day</option>
                                </select>
                                
                                <select name="" id="">
                                    <option value="month">month</option>
                                    <option value="day">day</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-sm">
                    <h1>تنظیمات اکانت</h1>
                    <div className="profile_accountSetting wrapper-med space-sm flex">
                        <div>
                            <h3>ایمیل</h3>
                            <h4>tabrizian.codes@gmail.com</h4>
                            <button>تغییر ایمیل</button>
                        </div>
                        <div>
                            <h3>رمز عبور</h3>
                            <button>تغییر رمز عبور</button>
                        </div>
                    </div>
                </div>

                <button className='profile_saveBtn space-sm'>ذخیره اطلاعات</button>

            </div>

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;