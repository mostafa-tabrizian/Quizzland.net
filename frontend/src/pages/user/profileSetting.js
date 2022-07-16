import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { DatePicker } from 'antd';

import axiosInstance from '../../components/axiosApi';
import Header from '../../components/header'
import Footer from '../../components/footer'
import { log, getTheme } from '../../components/base'
import userProfileDetail from '../../components/user/userProfileDetail'

const ProfileSetting = () => {
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        checkIfLoggedIn_setUser()
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
    }, [])

    // const oldPassword = useRef()
    // const newPassword = useRef()
    // const re_NewPassword = useRef()

    const checkIfLoggedIn_setUser = async () => {
        const userProfile = await userProfileDetail()

        if (userProfile == null) {
            window.location.href = '/login'
        }
        
        setUser(userProfile)
    }

    // const changePassword = async () => {
    //     if (newPassword.current.value != re_NewPassword.current.value) {
    //         return message.error('رمز جدید و تکرار آن بکسان نمی‌باشد')
    //     }
    //     else if (newPassword.current.value == oldPassword.current.value) {
    //         return message.error('رمز قبلی و جدید شما نمی‌توانند بکسان باشد')
    //     }
        
    //     else {
    //         message.loading('لطفا منتظر بمانید ...', 1)

    //         await axiosInstance.get(`/api/reset_password?u=${user.username}&op=${oldPassword.current.value}&np=${newPassword.current.value}`)
    //             .then(res => {
    //                 if (res.data == 'not_same') {
    //                     message.error('رمز قبلی شما صحیح نمی‌باشد')
    //                 }
    //                 else if(res.data.includes('too short')) {
    //                     message.error('رمز شما می‌بایست حداقل ۸ کارکتر باشد', 3)
    //                 }
    //                 else if (res.data.includes('entirely numeric')) {
    //                     message.error('رمز شما می‌بایست حداقل حاوی یک حرف باشد', 3)
    //                 }
    //                 else if (res.data.includes('too common')) {
    //                     message.error('رمز شما به راحتی قابل حدس است. می‌بایست یک مقدار پیچیده تر باشد', 3)
    //                 }
    //                 else if (res.data == 'success_change') {
    //                     message.success('رمز شما با موفقیت تغییر یافت')
    //                 }
    //             })
    //             .catch(err => {
    //                 log(err.response)
    //             })
    //     }
    // }

    return (
        <React.Fragment>

            <Helmet>
                <title>کوییزلند | پروفایل</title>
                <link rel='canonical' to='https://www.quizzland.net/setting' />
            </Helmet>

            <Header />

            <div className='mx-4 md:mx-auto md:w-4/5'>
                <div>
                    <h1 className='mb-3'>
                        اطلاعات پروفایل        
                    </h1>
                    <div className='py-2 px-2 border-[#690D11] space-y-5 border-4 rounded'>
                        <div>
                            <h3>تصویر پروفایل و نام کاربری</h3>
                            <div>
                                <div className='flex justify-around mt-5 space-x-5 space-x-reverse md:justify-start'>
                                    {
                                        user?.avatar ?
                                        <img className="w-20 h-20 rounded-full" src={user?.avatar} alt={user?.username} />
                                        :
                                        <svg className="h-20 w-20 text-[#ac272e]"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    }

                                    <div className='flex flex-col items-center m-auto text-center'>
                                        <button className='px-3 py-1 border rounded'>آپلود عکس جدید</button>
                                        <button className='text-xm'>حذف تصویر</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            <div className=''>
                                <h3>نام کاربری</h3>
                                <input type="text" placeholder={user?.username} />
                            </div>
                        </div>
                        <div className='space-y-5 md:grid md:grid-cols-2'>
                            <div>
                                <h3>نام</h3>
                                <input type="text" placeholder={user?.first_name} />
                            </div>
                            <div>
                                <h3>نام خانوادگی</h3>
                                <input type="text" placeholder={user?.last_name} />
                            </div>
                            <div>
                                <h3>درباره من</h3>
                                <textarea type="text" cols="40" rows='5' placeholder={user?.bio} />
                            </div>
                            <div>
                                <h3>تاریخ تولد</h3>
                                <div>
                                    <figure>
                                        <DatePicker />
                                        <figcaption>
                                            تاریخ تولد شما به هیچ کس نمایان نخواهد بود.
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                            <div>
                                <h3>جنسیت</h3>
                                <div>
                                    <figure>
                                        <select name="genders">
                                            <option value='null' selected>انتخاب کنید</option>
                                            <option value='male'>مذکر</option>
                                            <option value='female'>مونث</option>
                                        </select>
                                        <figcaption>
                                            جنسیت شما به هیچ کس نمایان نخواهد بود.
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end w-full mt-5'>
                            <button className='px-6 py-2 border-2 border-green-600 rounded-xl'>‌ذخیره</button>
                        </div>
                    </div>

                    {/* <h1 className='mt-10 mb-5'>تنظیمات امنیتی</h1>
                    <div className='py-2 px-2 border-[#690D11] space-y-5 border-4 rounded'>
                        <div className='space-y-5 md:grid md:grid-cols-2'>
                            <div>
                                <h3 className='mb-5'>تغییر رمز عبور</h3>

                                <div className='flex flex-col space-y-5'>
                                    <input type="password" ref={oldPassword} placeholder='رمز عبور قبلی خود را وارد کنید' />
                                    <input type="password" ref={newPassword} placeholder='رمز عبور جدید' />
                                    <input type="password" ref={re_NewPassword} placeholder='تکرار رمز عبور جدید' />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end w-full mt-5'>
                            <button onClick={() => changePassword()} className='px-6 py-2 border-2 border-green-600 rounded-xl'>ذخیره</button>
                        </div>
                    </div> */}
                </div>
            </div>

            <Footer />

        </React.Fragment>
    );
}
 
export default ProfileSetting;