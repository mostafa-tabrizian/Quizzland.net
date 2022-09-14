import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
import DatePicker, { DateObject } from "react-multi-date-picker"
const persian = require("react-date-object/calendars/persian")
const persian_fa = require("react-date-object/locales/persian_fa")
const persianJs = require("persianjs")
const debounce = require('lodash.debounce')
const MenuItem = require('@mui/material/MenuItem')
import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import Select from '@mui/material/Select';
import InputLabel  from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

import axiosInstance from '../../components/axiosApi'
import { log, getTheme } from '../../components/base'
import UserStore from '../../store/userStore'
const LoginForm = React.lazy(() => import('../../components/user/loginForm'))
const Avatar = React.lazy(() => import('../../components/user/avatar'))
const BackdropLoading = React.lazy(() => import('../../components/bacdropLoading'))

const ProfileSetting = () => {
    const [user, setUser] = useState(null)
    const [birthdayDatePicker, setBirthdayDatePicker] = useState(null)
    const [avatarOptions, setAvatarOptions] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const [userProfile, userActions] = UserStore()
    
    const { enqueueSnackbar } = useSnackbar()
    
    useEffect(() => {
        getUserDetail()
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
    }, [userProfile])
    
    const recaptchaRef = useRef(null)
    const userIdRef = useRef()
    const usernameRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const bioRef = useRef()
    const birthdayDateRef = useRef()
    const gendersRef = useRef()

    const getUserDetail = async () => {
        if (userProfile.userDetail) {
            userIdRef.current = userProfile.userDetail.id
            setUser(userProfile.userDetail)
        }
    }

    const checkRecaptcha = async () => {
        const recaptchaResponse = await recaptchaRef.current.executeAsync()

        return await axiosInstance.get(`/api/recaptcha?r=${recaptchaResponse}`)
            .then(res => {
                return res.data
            })
            .catch(err => {
                log(err.response)
            })
    }

    const saveSetting = async () => {
        setLoading(true)

        const updatedUsername =  usernameRef.current.value
        const updatedFirstName = firstNameRef.current.value
        const updatedLastName = lastNameRef.current.value
        const updatedBio = bioRef.current.value
        const updatedGender = gendersRef.current
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
            return enqueueSnackbar('برای ذخیره، حداقل یک ورودی را تغییر دهید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
        }

        debouncePatchUserSetting(updatedUsername, updatedFirstName, updatedLastName, updatedBio, updatedGender, updatedBirthdayDate, updatedAvatarOption)
    }
    
    const debouncePatchUserSetting = useCallback(
        debounce(
            async (updatedUsername, updatedFirstName, updatedLastName, updatedBio, updatedGender, updatedBirthdayDate, updatedAvatarOption) => {
                // if (true) {
                if (await checkRecaptcha()) {
                    let payload = {}

                    updatedUsername.length && (payload['username'] = updatedUsername)
                    updatedFirstName.length && (payload['first_name'] = updatedFirstName)
                    updatedLastName.length && (payload['last_name'] = updatedLastName)
                    updatedBio.length && (payload['bio'] = updatedBio)
                    updatedGender != 'null' && (payload['gender'] = updatedGender)
                    updatedBirthdayDate.length && (payload['birthday_date'] = updatedBirthdayDate.replaceAll('/', '-'))
                    updatedAvatarOption != 'null' && (payload['avatar'] = updatedAvatarOption)

                    await axiosInstance.patch(`/api/userView/${userIdRef.current}/`, payload)
                        .then(res => {
                            enqueueSnackbar('اطلاعات شما با موفقیت تغییر یافت.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        })
                        .catch(err => {
                            if (err.response.data == 'username already exists') {
                                enqueueSnackbar('نام کاربری دیگری انتخاب کنید', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                            else if (err.response.data == 'username too short') {
                                enqueueSnackbar('نام کاربری می‌بایست بیش از ۳ کارکتر باشد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                            else if (err.response.data == 'none valid emoji') {
                                enqueueSnackbar('یکی از ایموجی های شما قابل ذخیره نیست. لطفا آن را تغییر بدهید.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            } else if (err.response.data = 'error saving instance') {
                                enqueueSnackbar('در ذخیره تغییرات شما به مشکل برخوردیم! لطفا مجددا امتحان کنید.')  // include ! for debuggi', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                            else {
                                enqueueSnackbar('در ذخیره تغییرات شما به مشکل برخوردیم. لطفا مجددا امتحان کنید.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                        })
                }
                
                setLoading(false)
            }, 500
        )
    );

    return (
        <React.Fragment>

            <Helmet>
                <title>کوییزلند | پروفایل</title>
                <link rel='canonical' to='https://www.quizzland.net/profile/setting' />
            </Helmet>

            <BackdropLoading loadingStatue={loading} />

            <div className="lowTitle">Edit Profile</div>
            <div className="title">تنظیمات پروفایل</div>

            <div className={`mx-4 mt-5 md:mx-auto md:w-4/5 min-h-[60vh] ${user ? '' : 'flex' }`}>
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
                                    <div>
                                        <FormControl sx={{ m: 1, width: 200 }}>
                                            <InputLabel id="genders">جنسیت</InputLabel>
                                            <Select
                                                labelId="genders"
                                                id="genders"
                                                value={gendersRef.current}
                                                label="جنسیت"
                                                ref={gendersRef}
                                                onChange={(event) => {gendersRef.current = event.target.value}}
                                            >
                                                <MenuItem value="">انتخاب کنید</MenuItem>
                                                <MenuItem value='male'>آقا</MenuItem>
                                                <MenuItem value='female'>خانم</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <figcaption>جنسیت شما به هیچ کس نمایان نخواهد بود.</figcaption>
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