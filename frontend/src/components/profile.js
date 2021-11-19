import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import Header from './header'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { ProfileDetail } from './profileChecker'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

const pathRed = '/static/img/bubbles.png'

const PrivacyPolicy = () => {
    const [profileDetail, setProfileDetail] = useState(null)

    useEffect(() => {
        const userDetaInPromise = ProfileDetail()
        userDetaInPromise.then((x) => {
            setProfileDetail(x)
        })

        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url(${pathRed})) center center scroll !important`
        }
    }, [])

    const signOut = () => {
        localStorage.removeItem('signInSession');
        window.location.pathname = '/'
    }

    return (
        <React.Fragment>
            
            <Header linkType='Link'/>

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
                            <img src={profileDetail && profileDetail.avatar} alt="" />
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
                        <input type="text" placeholder='username' value={profileDetail && profileDetail.username} />
                    </div>
                    <div className="profile_detail space-sm">
                        <div className='flex flex-ai-c'>
                            <div>
                                <h3>نام</h3>
                                <input type="text" placeholder='full name' value={`${profileDetail && profileDetail.firstname}`} />
                            </div>
                            <div>
                                <h3>نام خانوادگی</h3>
                                <input type="text" placeholder='full name' value={`${profileDetail && profileDetail.firstname}`} />
                            </div>
                        </div>

                        <div>
                            <h3>درباره</h3>
                            <textarea className='profile_bio' rows="10">{profileDetail && profileDetail.bio}</textarea>
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

                <div className="space-sm">
                    <h1>تنظیمات اکانت</h1>
                    <div className="profile_accountSetting wrapper-med space-sm flex">
                        <div>
                            <h3>ایمیل</h3>
                            <h4>{profileDetail && profileDetail.email}</h4>
                            <button>تغییر ایمیل</button>
                        </div>
                        <div>
                            <h3>رمز عبور</h3>
                            <button>تغییر رمز عبور</button>
                        </div>
                    </div>
                </div>

                <button className='profile_signOutBtn space-sm' onClick={signOut}>خروج از حساب کاربری</button>

                <button className='profile_saveBtn space-sm'>ذخیره اطلاعات</button>

            </div>

        </React.Fragment>
    );
}
 
export default PrivacyPolicy;