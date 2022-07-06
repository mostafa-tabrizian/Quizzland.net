import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link, useLocation } from 'react-router-dom'
import persianDate from 'persian-date'
persianDate.toLocale('fa');

import Header from '../../components/header'
import Footer from '../../components/footer'
import { log } from '../../components/base'
import axiosInstance from '../../components/axiosApi';

const Profile = () => {
    const [user, setUser] = useState(null)
    const [userCommentLength, setUserCommentLength] = useState(0)
    const [loaded, setLoaded] = useState(false)
    
    const location = useLocation()

    useEffect(async() => {
        const userDetail = await getUserDetail()
        getUserCommentsLength(userDetail)
        setLoaded(true)
    }, [location])

    const getUserDetail = async () => {
        const now = new Date().getTime()
        const username = window.location.href.split('/').slice(-1)[0]
        
        return await axiosInstance.get(`/api/user/?username=${username}&is_active=true&timestamp=${now}`)
            .then( async res => {
                if (res.data.length == 0) {
                    return null
                } else {
                    const userDetail = res.data[0]
                    setUser(userDetail)
                    return userDetail
                }
            })
    }

    const getUserCommentsLength = async (userDetails) => {
        const now = new Date().getTime()
        
        userDetails &&
        await axiosInstance.get(`/api/comment/?submitter_related=${userDetails.id}&timestamp=${now}`)
            .then( async res => {
                setUserCommentLength(res.data.length)
            })
    }

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>کوییزلند | پروفایل</title>
                <link rel='canonical' to={`https://www.quizzland.net/profile/${user?.username}`} />
            </Helmet>

            {
                user && loaded ?
                <div className='mx-4 space-y-10 md:mx-auto md:w-4/5'>
    
                    <div className='space-y-5 py-8 px-4 mb-20 shadow-[0_1px_10px_#690D11] border-4 bg-[#0e0202d4] border-[#690D11] rounded-lg'>
                        <div className="">
                            <div className="flex items-center mb-5 space-x-2 space-x-reverse">
                                {
                                    user?.avatar ?
                                    <img className="w-20 h-20 rounded-full" src={'https:' + user.avatar.slice(59, )} alt={user.username} />
                                    :
                                    <svg className="h-20 w-20 text-[#ac272e]"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                }
    
                                <h2 className="" id="buzz-content">{user?.first_name }&nbsp;{user?.last_name}</h2>
                            </div>
                            <p className="">{user?.bio}</p>
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
                                <div className="">
                                    <Link to='/points-guide' className='flex px-4 py-2 space-x-2 space-x-reverse bloodRiver_bg rounded-xl'>
                                        <dt className="">امتیاز ها</dt>
                                        <dd className='flex'>
                                            <span className="">{user?.points}</span>
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
                            <h2 className="">کوییز های منتشرشده</h2>
                            <Link aria-label="کوییز های منتشرشده" to={`/post/${user?.uesrname}`}>
                                ⬅
                            </Link>
                        </div>
                    </div> */}
                    {/* <div className='space-y-5 py-8 px-4 shadow-[0_1px_10px_#690D11] border-4 bg-[#0e0202d4] border-[#690D11] rounded-lg'>
                        <div className="flex justify-between">
                            <h2 className="">جوایز</h2>
                            <Link aria-label="دیدن تمام جوایز" to={`/trophies/${user?.uesrname}`}>
                                ⬅
                            </Link>
                        </div>
                    </div> */}
                </div>
                :
                <h1 className='mt-10 mb-[25rem] text-center'>هیچ کاربری با این عنوان پیدا نشد <span className='text-[2.5rem]'>😕</span></h1>
                
            }

            <Footer />

        </React.Fragment>
    );
}
 
export default Profile;