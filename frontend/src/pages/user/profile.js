import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link, useLocation } from 'react-router-dom'
import persianDate from 'persian-date'
persianDate.toLocale('fa');
import { BigHead } from "@bigheads/core";

import { log, getTheme } from '../../components/base'
import axiosInstance from '../../components/axiosApi';
import UserStore from '../../store/userStore';

const Profile = () => {
    const [user, setUser] = useState(null)
    const [userCommentLength, setUserCommentLength] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [theme, setTheme] = useState('dark')
    
    const location = useLocation()

    const [userProfile, userActions] = UserStore()

    useEffect(async() => {
        setUser(userProfile.userDetail)
        getUserCommentsLength()
        setLoaded(true)
        const theme = getTheme()
        setTheme(theme)
        document.querySelector('body').style = `background: ${theme == 'dark' ? '#060101' : 'white'}`
    }, [location, userProfile])

    const getUserCommentsLength = async () => {
        const now = new Date().getTime()
        await axiosInstance.get(`/api/commentView/?submitter_related=${userProfile.userDetail.id}&timestamp=${now}`)
            .then( async res => {
                setUserCommentLength(res.data.length)
            })
    }

    return (
        <React.Fragment>

            <Helmet>
                <title>کوییزلند | پروفایل</title>
                <link rel='canonical' to={`https://www.quizzland.net/profile/${user?.username}`} />
            </Helmet>

            {
                user && loaded ?
                <div className='mx-4 space-y-10 md:mx-auto md:w-4/5'>
    
                    <div className={`space-y-5 py-8 px-4 mb-20 shadow-[0_1px_10px_#690D11] border-4 ${theme == 'dark' ? 'bg-[#0e0202d4]' : 'bg-[#f3f3f3d4]'} border-[#690D11] rounded-lg`}>
                        <div>
                            <div className="flex items-center mb-5 space-x-2 space-x-reverse">
                                <div className='w-[16rem] h-[16rem]'>
                                    <BigHead {...JSON.parse(user?.avatar)} />
                                </div>
                                <h2>{user?.first_name }&nbsp;{user?.last_name}</h2>
                            </div>
                            <p>{user?.bio}</p>
                        </div>
                        <dl className="space-y-5">
                            <div className="flex items-center justify-between md:justify-start md:space-x-16 md:space-x-reverse">
                                <div className="md:flex md:space-x-3 md:space-x-reverse">
                                    <dt>عضویت</dt>
                                    <dd>{new persianDate(user?.date_joined).format('MMMM YYYY')}</dd>
                                </div>
                                <div className='hidden md:flex md:space-x-10 md:space-x-reverse'>
                                    {/* <div className="flex space-x-3 space-x-reverse">
                                        <dt>جوایز</dt>
                                        <dd>1</dd>
                                    </div> */}
                                    {/* <div className="flex space-x-3 space-x-reverse">
                                        <dt>پست ها</dt>
                                        <dd>0</dd>
                                    </div> */}
                                    <div className="flex space-x-3 space-x-reverse">
                                        <dt>لایک ها</dt>
                                        <dd>{user?.liked_quizzes.split('_').length - 2}</dd>
                                    </div>
                                    <div className="flex space-x-3 space-x-reverse">
                                        <dt>کامنت ها</dt>
                                        <dd>{userCommentLength}</dd>
                                    </div>
                                </div>
                                <div>
                                    <Link to='/points-guide' className='flex px-4 py-2 space-x-2 space-x-reverse bloodRiver_bg rounded-xl'>
                                        <dt>امتیاز ها</dt>
                                        <dd className='flex'>
                                            <span>{user?.points}</span>
                                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="#FFF" fill-rule="nonzero" d="M13.11 10.023c-1.628 0-2.724-2.3-2.724-3.95 0 1.65-1.096 3.95-2.725 3.95 1.629 0 2.725 2.318 2.725 3.95 0-1.65 1.113-3.95 2.725-3.95zM8.537 6.375C5.994 6.375 4.268 2.66 4.268 0 4.268 2.66 2.54 6.375 0 6.375c2.541 0 4.268 3.715 4.268 6.376 0-2.66 1.726-6.376 4.268-6.376z"></path></svg>
                                        </dd>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-between md:hidden">
                                {/* <div className="flex space-x-3 space-x-reverse">
                                    <dt>جوایز</dt>
                                    <dd>1</dd>
                                </div> */}
                                {/* <div className="flex space-x-3 space-x-reverse">
                                    <dt>پست ها</dt>
                                    <dd>0</dd>
                                </div> */}
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>لایک ها</dt>
                                    <dd>{user?.liked_quizzes.split('_').length - 2}</dd>
                                </div>
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>کامنت ها</dt>
                                    <dd>{userCommentLength}</dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                    {/* <div className='space-y-5 py-8 px-4 shadow-[0_1px_10px_#690D11] border-4 bg-[#0e0202d4] border-[#690D11] rounded-lg'>
                        <div className="flex justify-between">
                            <h2>کوییز های منتشرشده</h2>
                            <Link aria-label="کوییز های منتشرشده" to={`/post/${user?.uesrname}`}>
                                ⬅
                            </Link>
                        </div>
                    </div> */}
                    {/* <div className='space-y-5 py-8 px-4 shadow-[0_1px_10px_#690D11] border-4 bg-[#0e0202d4] border-[#690D11] rounded-lg'>
                        <div className="flex justify-between">
                            <h2>جوایز</h2>
                            <Link aria-label="دیدن تمام جوایز" to={`/trophies/${user?.uesrname}`}>
                                ⬅
                            </Link>
                        </div>
                    </div> */}
                </div>
                :
                <h1 className='mt-10 mb-[25rem] text-center'>هیچ کاربری با این عنوان پیدا نشد <span className='text-[2.5rem]'>😕</span></h1>
                
            }
            
        </React.Fragment>
    );
}
 
export default Profile;