import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import Header from '../components/header'
import Footer from '../components/footer'
import { log, replaceFunction, isItMobile, sortByNewest, sortByMonthlyViews } from '../components/base'
import userProfileDetail from '../components/userProfileDetail'

const Profile = () => {
    const [user, setUser] = useState(null)

    useEffect(async() => {
        setUser(await userProfileDetail())
    }, [])

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>کوییزلند | پروفایل</title>
                <link rel='canonical' to={`https://www.quizzland.net/profile/${user?.username}`} />
            </Helmet>

            <div className='space-y-10 md:w-4/5 mx-auto'>

                <div className='space-y-5 py-8 px-4 shadow-[0_1px_10px_#690D11] border-4 bg-[#1d1313] border-[#690D11] rounded-lg'>
                    <div className="">
                        <div className="flex space-x-2 space-x-reverse mb-5 items-center">
                            {
                                user?.avatar ?
                                <img className="" src={user?.avatar} alt={user?.username} />
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
                        <div className="flex justify-between md:justify-start md:space-x-16 md:space-x-reverse items-center">
                            <div className="md:flex md:space-x-3 md:space-x-reverse">
                                <dt>عضویت</dt>
                                <dd>شهریور 1399</dd>
                            </div>
                            <div className='md:flex md:space-x-10 md:space-x-reverse hidden'>
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>جوایز</dt>
                                    <dd>1</dd>
                                </div>
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>پست ها</dt>
                                    <dd>0</dd>
                                </div>
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>کامنت ها</dt>
                                    <dd>0</dd>
                                </div>
                            </div>
                            <div className="">
                                <Link to='/points-guide' className='flex space-x-2 space-x-reverse bloodRiver_bg px-4 py-2 rounded-xl'>
                                    <dt className="">امتیاز ها</dt>
                                    <dd className='flex'>
                                        <span className="">100</span>
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fill="#FFF" fill-rule="nonzero" d="M13.11 10.023c-1.628 0-2.724-2.3-2.724-3.95 0 1.65-1.096 3.95-2.725 3.95 1.629 0 2.725 2.318 2.725 3.95 0-1.65 1.113-3.95 2.725-3.95zM8.537 6.375C5.994 6.375 4.268 2.66 4.268 0 4.268 2.66 2.54 6.375 0 6.375c2.541 0 4.268 3.715 4.268 6.376 0-2.66 1.726-6.376 4.268-6.376z"></path></svg>
                                    </dd>
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-between md:hidden">
                            <div className="flex space-x-3 space-x-reverse">
                                <dt>جوایز</dt>
                                <dd>1</dd>
                            </div>
                            <div className="flex space-x-3 space-x-reverse">
                                <dt>پست ها</dt>
                                <dd>0</dd>
                            </div>
                            <div className="flex space-x-3 space-x-reverse">
                                <dt>کامنت ها</dt>
                                <dd>0</dd>
                            </div>
                        </div>
                    </dl>
                </div>
                <div className='space-y-5 py-8 px-4 shadow-[0_1px_10px_#690D11] border-4 bg-[#1d1313] border-[#690D11] rounded-lg'>
                    <div className="flex justify-between">
                        <h2 className="">کوییز های منتشرشده</h2>
                        <Link aria-label="کوییز های منتشرشده" to={`/post/${user?.uesrname}`}>
                            ⬅
                        </Link>
                    </div>
                </div>
                <div className='space-y-5 py-8 px-4 shadow-[0_1px_10px_#690D11] border-4 bg-[#1d1313] border-[#690D11] rounded-lg'>
                    <div className="flex justify-between">
                        <h2 className="">جوایز</h2>
                        <Link aria-label="دیدن تمام جوایز" to={`/trophies/${user?.uesrname}`}>
                            ⬅
                        </Link>
                    </div>
                </div>

            </div>

            <Footer />

        </React.Fragment>
    );
}
 
export default Profile;