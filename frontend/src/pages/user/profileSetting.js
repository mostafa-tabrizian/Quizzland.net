import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import persianJs from "persianjs"
import { useCookies } from "react-cookie";
import debounce from 'lodash.debounce'
import ReCAPTCHA from 'react-google-recaptcha'
import { message } from 'antd';

import LoginForm from '../../components/user/loginForm'
import axiosInstance from '../../components/axiosApi';
import { log, getTheme } from '../../components/base'
import Avatar from '../../components/user/avatar'
import UserStore from '../../store/userStore';

const ProfileSetting = () => {
    const [user, setUser] = useState(null)
    const [birthdayDatePicker, setBirthdayDatePicker] = useState(null)
    const [avatarOptions, setAvatarOptions] = useState(null)
    
    const [userProfile, userActions] = UserStore()
    
    useEffect(() => {
        getUserDetail()
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
    }, [userProfile])
    
    const recaptchaRef = useRef(null)
    const userIdRef = useRef()
    const currentUsernameRef = useRef()
    const usernameRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const bioRef = useRef()
    const birthdayDateRef = useRef()
    const gendersRef = useRef()

    const [cookies] = useCookies(['USER_ACCESS_TOKEN']);

    const getUserDetail = async () => {
        if (userProfile.userDetail) {
            userIdRef.current = userProfile.userDetail.id
            currentUsernameRef.current = userProfile.userDetail.username
            setUser(userProfile.userDetail)
        }
    }

    const checkRecaptcha = async () => {
        const recaptchaResponse = await recaptchaRef.current.executeAsync()

        return await axiosInstance.get(`/api/recaptcha?r=${recaptchaResponse}`,)
            .then(res => {
                return res.data
            })
            .catch(err => {
                log(err.response)
            })
    }

    const saveSetting = async () => {
        message.loading('')

        const updatedUsername =  usernameRef.current.value
        const updatedFirstName = firstNameRef.current.value
        const updatedLastName = lastNameRef.current.value
        const updatedBio = bioRef.current.value
        const updatedGender = gendersRef.current.value
        const updatedAvatarOption = JSON.stringify(avatarOptions)

        const dateRefValue = birthdayDateRef.current.querySelector('input').value
        let updatedBirthdayDate = ''
        
        if (dateRefValue.length) {
            const farsiPersianDateObject = persianJs(dateRefValue).persianNumber()
            const farsiPersianDateValue = Object.values(farsiPersianDateObject)[0]
            const persianConvertEnglish = new DateObject({calendar:persian, date:farsiPersianDateValue}).convert().format()
            updatedBirthdayDate =  persianConvertEnglish
        }

        if (!updatedUsername.length && !updatedFirstName.length && !updatedLastName.length && !updatedBio.length && !updatedBirthdayDate.length && updatedGender == 'null' && !dateRefValue.length.length && avatarOptions == null) {
            return message.warning('برای ذخیره، حداقل یک ورودی را تغییر دهید.')
        }

        debouncePatchUserSetting(updatedUsername, updatedFirstName, updatedLastName, updatedBio, updatedGender, updatedBirthdayDate, updatedAvatarOption)
    }
    
    const debouncePatchUserSetting = useCallback(
        debounce(
            async (updatedUsername, updatedFirstName, updatedLastName, updatedBio, updatedGender, updatedBirthdayDate, updatedAvatarOption) => {
                if (await checkRecaptcha()) {
                    
                    const payload = {
                        accessToken: cookies.USER_ACCESS_TOKEN,
                        username: updatedUsername || currentUsernameRef.current,
                        firstName: updatedFirstName,
                        lastName: updatedLastName,
                        bio: updatedBio,
                        gender: updatedGender,
                        birthdayData: updatedBirthdayDate,
                        avatar: updatedAvatarOption
                    }
                    
                    await axiosInstance.patch(`/api/userView/${userIdRef.current}/`, payload)
                        .then(res => {
                            message.success('اطلاعات شما با موفقیت تغییر یافت.')
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        })
                        .catch(err => {
                            log(err.response)
                            if (err.response.data == 'username already exists') {
                                message.error('نام کاربری دیگری انتخاب کنید')
                            }
                            else if (err.response.data == 'username too short') {
                                message.error('نام کاربری می‌بایست بیش از ۳ کارکتر باشد.')
                            } else {
                                message.error('تغییر پروفایل به مشکل برخورد. لطفا مجددا امتحان کنید.', 4)
                            }
                            setTimeout(() => {
                                window.location.reload()
                            }, 3_500);
                        })
                }
            }
        , 1000), []
    );

    return (
        <React.Fragment>

            <Helmet>
                <title>کوییزلند | پروفایل</title>
                <link rel='canonical' to='https://www.quizzland.net/profile/setting' />
            </Helmet>

            <div className={`mx-4 md:mx-auto md:w-4/5 min-h-[60vh] ${user ? '' : 'flex' }`}>
                { user ?
                    <div>
                        <h1 className='mb-3'>
                            اطلاعات پروفایل        
                        </h1>
                        <div className='py-2 px-2 border-[#690D11] space-y-5 border-4 rounded'>
                            {user && <Avatar user={user} setAvatarOptions={setAvatarOptions} />}
                            <div className=''>
                                <div className=''>
                                    <h3>نام کاربری</h3>
                                    <input type="text" className='bg-transparent border-b border-red-900' placeholder={user?.username} ref={usernameRef} />
                                </div>
                            </div>
                            <div className='space-y-5 md:grid md:grid-cols-2'>
                                <div>
                                    <h3>نام</h3>
                                    <input type="text" className='bg-transparent border-b border-red-900' placeholder={user?.first_name} ref={firstNameRef} />
                                </div>
                                <div>
                                    <h3>نام خانوادگی</h3>
                                    <input type="text" className='bg-transparent border-b border-red-900' placeholder={user?.last_name} ref={lastNameRef} />
                                </div>
                                <div>
                                    <h3>درباره من</h3>
                                    <textarea type="text" className='p-2 bg-transparent border border-red-900 rounded-md' cols="40" rows='5' placeholder={user?.bio} ref={bioRef} />
                                </div>
                                <div>
                                    <h3>تاریخ تولد</h3>
                                    <div>
                                        <figure>
                                            <DatePicker
                                                value={birthdayDatePicker}
                                                onChange={setBirthdayDatePicker}
                                                format="YYYY/MM/DD"
                                                minDate="1300/01/01"
                                                maxDate='1401/01/01'
                                                calendar={persian}
                                                locale={persian_fa}
                                                inputClass={'w-[10rem] translate-x-[-4rem] text-black pr-4 bg-transparent border-b border-red-900'}
                                                ref={birthdayDateRef}
                                            />
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
                                            <select name="genders" ref={gendersRef}>
                                                <option value='null' selected>انتخاب کنید</option>
                                                <option value='male'>آقا</option>
                                                <option value='female'>خانم</option>
                                            </select>
                                            <figcaption>
                                                جنسیت شما به هیچ کس نمایان نخواهد بود.
                                            </figcaption>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            
                            <button onClick={saveSetting} className='px-6 py-2 my-auto mt-4 mr-4 border-2 border-green-600 h-fit rounded-xl'>‌ذخیره</button>
                            
                            <ReCAPTCHA
                                sitekey={process.env.RECAPTCHA_SITE_KEY}
                                size='invisible'
                                hl='fa'
                                theme="dark"
                                ref={recaptchaRef}
                            />
                            
                        </div>
                    </div>
                    :
                    <div className='m-auto space-y-5 text-center md:shadow-[0_0_10px_#690D11] md:p-8 rounded-lg'>
                        <h1 className='title'>شما میبایست ابتدا <span className='text-red-600 title'>وارد</span> شوید.</h1>
                        <div>
                            <LoginForm/>
                        </div>
                    </div>
                }
            </div>

        </React.Fragment>
    );
}
 
export default ProfileSetting;