import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link, useLocation } from 'react-router-dom'
const persianDate = require('persian-date')
persianDate.toLocale('fa');
import { BigHead } from "@bigheads/core";
import axios from '../../components/axiosApi'

import { log, getTheme } from '../../components/base'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [userCommentLength, setUserCommentLength] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [theme, setTheme] = useState('dark')
    
    const location = useLocation()

    useEffect(async() => {
        fetchUserProfile()
        setLoaded(true)
        const theme = getTheme()
        setTheme(theme)
                // document.querySelector('body').style = `background: ${theme == 'light' ? 'white' : '#060101'}`
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [location])

    useEffect(() => {
        fetchUserCommentsLength()
    }, [user]);

    const fetchUserProfile = async () => {
        const username = window.location.pathname.split('/')[2]
        
        await axios.post(`/api/profile`, {'username': username})
            .then( async res => {
                setUser(res.data)
            })
    }

    const fetchUserCommentsLength = async () => {
        const now = new Date().getTime()
        
        user?.id &&
        await axios.get(`/api/commentView/?submitter_id=${user?.id}&timestamp=${now}`)
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
                user !== 'DoesNotExist' && loaded ?
                <div className='mx-4 space-y-10 md:mx-auto md:w-2/5'>
    
                    <div className={`space-y-5 pb-8 px-4 mb-20 shadow-[0_1px_10px_#690D11] border-4 ${theme == 'light' ? 'bg-[#f3f3f3d4]' : 'bg-[#0e0202d4]'} border-[#690D11] rounded-lg`}>
                        <dl className="md:flex">
                            <div className="flex items-center justify-center mb-5 space-x-2 space-x-reverse">
                                <div className='w-[16rem] h-[16rem]'>
                                    {
                                        user?.avatar &&
                                        <BigHead {...JSON.parse(user.avatar)} />
                                    }
                                </div>
                            </div>
                            <div className="items-center space-y-5 m-auto">
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>نام و نام خانوادگی:</dt>
                                    <h2>{user?.first_name }&nbsp;{user?.last_name}</h2>
                                </div>
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>نام کاربری:</dt>
                                    <dd>{user?.username}</dd>
                                </div>
                                <div className='flex space-x-10 space-x-reverse'>
                                    <div className="flex space-x-3 space-x-reverse">
                                        <dt>لایک ها:</dt>
                                        <dd>{user?.likes}</dd>
                                    </div>
                                    <div className="flex space-x-3 space-x-reverse">
                                        <dt>کامنت ها:</dt>
                                        <dd>{userCommentLength}</dd>
                                    </div>
                                </div>
                                <div className="flex space-x-3 space-x-reverse">
                                    <dt>عضویت:</dt>
                                    <dd>{new persianDate(user?.date_joined).format('MMMM YYYY')}</dd>
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