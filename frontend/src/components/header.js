import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCookies } from "react-cookie";
import { useSnackbar } from 'notistack'
import { BigHead } from "@bigheads/core";
import AnimatedNumbers from "react-animated-numbers";

import { log, keyPressedOnInput } from './base'
import Search from './search/searchInput'
import userProfileDetail from '../components/user/userProfileDetail'
import UserStore from '../../src/store/userStore'
import BackdropLoading from './backdropLoading';
import Logout from './auth/logout';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchMobileOpen, setSearchMobileOpen] = useState(false)
    const [profileSubMenu, setProfileSubMenu] = useState(false)
    const [categorySubMenu, setCategorySubMenu] = useState(null)
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    
    const mobileSearchInput = useRef()

    const [cookies, setCookie, removeCookie] = useCookies(['USER_ACCESS_TOKEN', 'USER_REFRESH_TOKEN']);

    const [userProfile, userActions] = UserStore()

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        setProfileSubMenu(false)
        setCategorySubMenu(false)
        setMenuOpen(false)
    }, [location])
    
    const getUserData = async () => {
        const userProfileDetailData = await userProfileDetail()

        if (userProfileDetailData == 'inactive') {
            enqueueSnackbar('اکانت شما غیرفعال شده است. لطفا با پشتیبانی تماس بگیرید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            Logout(cookies.USER_REFRESH_TOKEN, removeCookie)
        } else {
            userActions.setUser(userProfileDetailData)
            userActions.updateQCoins(userProfileDetailData.q_coins)
        }
    }

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseSearchMobile = () => {
        setSearchMobileOpen(searchMobileOpen ? false : true)
    }

    const bigHead = () => {
        return (
            <div className='flex items-center space-x-3 space-x-reverse hover:cursor-pointer' onClick={() => setProfileSubMenu(!profileSubMenu)}>
                <div className='w-24 h-24'>
                    {
                        userProfile.userDetail?.avatar &&
                        <BigHead {...JSON.parse(userProfile.userDetail?.avatar)} />
                    }
                </div>
                
                <div className='m-auto'>
                    <div className='flex items-center'>
                        {
                            userProfile.userDetail?.first_name !== '' || userProfile.userDetail?.last_name !== '' ?
                            <div className='flex space-x-1 space-x-reverse'>
                                <h2>
                                    {userProfile.userDetail?.first_name}
                                </h2>
                                <h2>
                                    {userProfile.userDetail?.last_name}
                                </h2>
                            </div>
                            :
                            <div>
                                {userProfile.userDetail?.username}
                            </div>
                        }
                    </div>
                    <div className='flex items-center'>
                        <AnimatedNumbers
                            animateToNumber={userProfile.QCoins}
                            fontStyle={{ fontSize: '1rem' }}
                            includeComma={true}
                            configs={[
                                {"mass":1,"tension":130,"friction":40},
                                {"mass":2,"tension":140,"friction":40},
                                {"mass":3,"tension":130,"friction":40}
                            ]}
                        ></AnimatedNumbers>
                        <img className='h-6 mx-3' src="/static/img/QCoin.png" />
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <React.Fragment>
            <BackdropLoading loadingStatue={loading} />

            <header className={`z-10 mb-12 from-[#1c1c1c] bg-gradient-to-b to-transparent md:sticky top-0 rounded-md backdrop-blur-md`}>
                <div>
                    {
                        userProfile.userDetail?.is_staff &&
                        <Link to="/staff/panel" className='m-3' rel="noopener noreferrer">
                            Staff Panel 🗿
                        </Link>
                    }

                    <div className="header text-xl md:min-h-[7rem] flex md:grid md:grid-cols-4 md:justify-right justify-between md:max-w-[85%] relative md:mx-auto px-4 pt-4 md:pb-4 md:pt-0">

                        <div className='flex items-center md:hidden'>
                            <button onClick={openCloseSearchMobile} className='flex items-center header__btn' type="button">
                                <svg className='w-8 h-8 text-white' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <button type="button" onClick={openCloseMenu} className={`header__btn mr-5 `} aria-label="Menu Button">
                                <svg className='w-8 h-8 text-white' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
                            </button>
                        </div>

                        <div className='relative flex-col hidden px-8 space-x-5 md:justify-center md:flex'>
                            <div className='flex items-center space-x-3 space-x-reverse'>   
                                {
                                    userProfile.userDetail?
                                    bigHead()
                                    :
                                    <a href='/login'>
                                        <button onClick={() => props.onClick()} className={`px-10 py-1 h-fit bloodRiver_bg flex rounded-2xl text-white`}>ورود</button>
                                    </a>
                                }
                            </div>

                            <div className={`absolute top-28 right-12 border-2 bg-[#0e0202f3] border-[#690D11] rounded-lg ${profileSubMenu ? '' : 'hidden'}`}>
                                <div className='relative px-4 py-4 max-w-[14rem]'>
                                    <div>
                                        <ul className='flex flex-col'>
                                            <li><Link to={`/profile/${userProfile.userDetail?.username}`}>پروفایل</Link></li>
                                            <li><Link to={`/profile/messages`}>پیام ها</Link></li>
                                            <li><Link to='/profile/setting'>تنظیمات پروفایل</Link></li>
                                            <li><Link to='/profile/playlist?list=like'>کوییز های لایک شده</Link></li>
                                            <li><Link to='/profile/playlist?list=watch'>کوییز های ذخیره شده</Link></li>
                                            <li><Link to='/profile/playlist?list=history'>تاریخچه ی شما</Link></li>
                                            <li><button onClick={() => Logout(cookies.USER_REFRESH_TOKEN, removeCookie)}>خروج</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Search />
                        
                        <div className={`hidden md:flex md:justify-center items-center relative`}>
                            <div className="flex space-x-reverse space-x-7">
                                {/* <button className="header__btn">
                                    <Link to="/blog"> وبلاگ </Link>
                                </button> */}
                                {/* <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                                <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button> */}
                                <Link to='/contents?s=newest'>کوییز و تست ها</Link>
                                <button className='header__btn' onClick={() => setCategorySubMenu(!categorySubMenu)}>کتگوری ها</button>
                            </div>
                            
                            <div className={`absolute top-20 left-12 border-2 bg-[#0e0202f3] border-[#690D11] rounded-lg ${categorySubMenu ? '' : 'hidden'}`}>
                                <div className='relative px-4 py-4'>
                                    <ul className='flex flex-col'>
                                        <li><Link to="/contents/movie-&-series">فیلم و سریال 🎬</Link></li>
                                        <li><Link to="/contents/celebrity">سلبریتی ✨</Link></li>
                                        {/* <li><Link to="/contents/psychology">روانشناسی 🧠</Link></li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Link to="/" className="flex items-center justify-center header__logo">
                            <span className='bloodRiver ml-1 text-[1.6rem]'>uizzland</span>
                            <img
                                src='/static/img/Q-small.png'
                                alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشsearchناسی'
                                width={24}
                                height={35}
                            />
                        </Link>
                    </div>
                </div>

                <div className='space-x-3 space-x-reverse md:hidden'>
                    {
                        userProfile.userDetail ?
                        <Link to={`/profile/${userProfile.userDetail?.username}`}>
                            {bigHead()}
                        </Link>
                        :
                        <div className='p-4'>
                            <a href='/login'>
                                <button onClick={() => props.onClick()} className={`px-10 py-1 h-fit bloodRiver_bg flex rounded-2xl text-white`}>ورود</button>
                            </a>
                        </div>
                    }
                </div>

            </header>

            <div className='relative md:hidden'>
                <div className={`header__menu w-screen h-screen fixed text-right z-20
                                top-0 right-0
                                ${searchMobileOpen ? '' : 'slideMenu-hide'}
                                pr-8 pt-5`
                }>
                    <button onClick={openCloseSearchMobile} className="header__menu__closeBtn" aria-label="Close Menu Button">
                        <svg className='w-8 h-8 text-white' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <input
                        type='text'
                        className='text-center absolute top-1/4 w-[70%] bg-transparent border-b-2 border-[#690D11] text-[1.5rem] outlne-none text-white'
                        ref={mobileSearchInput}
                        placeholder='کوییزلند رو بگرد...'
                        onKeyPress={(e) => keyPressedOnInput(e)}
                    />
                </div>
            </div>

            <div className='relative md:hidden'>
                <div className={`header__menu fixed text-right z-20
                                top-0 right-0
                                ${menuOpen ? '' : 'slideMenu-hide'}
                                pr-8 pt-5`}>
                    <button onClick={openCloseMenu} className="header__menu__closeBtn" aria-label="Close Menu Button">
                        <svg className='w-8 h-8 text-white' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <div className='relative mt-5'>
                    {
                        userProfile.userDetail ?
                        <React.Fragment>
                            <hr className='border-[#690D11] '/>
                            
                            <ul className='flex flex-col mt-5 space-y-5'>
                                <li className='text-lg'><Link to={`/profile/${userProfile.userDetail?.username}`}>پروفایل</Link></li>
                                <li className='text-lg'><Link to={`/profile/messages`}>پیام ها</Link></li>
                                <li className='text-lg'><Link to='/profile/setting'>تنظیمات پروفایل</Link></li>
                                <li className='text-lg'><Link to='/profile/playlist?list=like'>کوییز های لایک شده</Link></li>
                                <li className='text-lg'><Link to='/profile/playlist?list=watch'>کوییز های ذخیره شده</Link></li>
                                <li className='text-lg'><Link to='/profile/playlist?list=history'>تاریخچه ی شما</Link></li>
                                <li><button onClick={() => Logout(cookies.USER_REFRESH_TOKEN, removeCookie)}>خروج</button></li>
                            </ul>
                        </React.Fragment>
                        :
                        <a href='/login'>
                            <button onClick={() => props.onClick()} className={`px-10 py-1 h-fit bloodRiver_bg flex rounded-2xl text-white`}>ورود</button>
                        </a>
                    }
                        
                    </div>

                    <div className='relative mt-5'>
                        <hr className='border-[#690D11] '/>
                        <h3 className='text-xl'>کتگوری ها</h3>
                        <ul className='flex mt-3 space-x-3 space-x-reverse'>
                            <li className='text-lg'><Link to="/contents/movie-&-series">فیلم و سریال 🎬</Link></li>
                            <li className='text-lg'><Link to="/contents/celebrity">سلبریتی ✨</Link></li>
                            {/* <li className='text-lg'><Link to="/contents/psychology">روانشناسی 🧠</Link></li> */}
                        </ul>
                    </div>
                    <div className='relative mt-5'>
                        <hr className='border-[#690D11] '/>
                        <h3 className='text-xl'>کوییز و تست ها</h3>
                        <ul className='flex mt-3 space-x-6 space-x-reverse'>
                            <li className='text-lg'><Link to="/contents?s=newest"> جدیدترین </Link></li>
                            <li className='text-lg'><Link to="/contents?s=trend"> محبوب ترین </Link></li>
                            <li className='text-lg'><Link to="/contents?s=views"> پربازدیدترین </Link></li>
                        </ul>
                    </div>
                    <div className='relative mt-5'>
                        <hr className='border-[#690D11] '/>
                        <ul className='mt-3 space-y-3'>
                            {/* <li className='text-lg'><Link to="/blog"> وبلاگ </Link></li> */}
                            {/* <li className='text-lg'><Link to="/guide"> راهنما </Link></li> */}
                            <li className='text-lg'><a href="mailto:support@quizzland.net">تماس با ما</a></li>
                            {/* <li className='flex space-x-3 space-x-reverse text-lg' onClick={changeTheme}>
                                <span>
                                    تم حالت  
                                </span>
                                {
                                    theme == 'light' ? 
                                    <svg class="h-6 w-6 text-yellow-500"  viewBox="0 0 24 24"  fill="yellow"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="5" />  <line x1="12" y1="1" x2="12" y2="3" />  <line x1="12" y1="21" x2="12" y2="23" />  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />  <line x1="1" y1="12" x2="3" y2="12" />  <line x1="21" y1="12" x2="23" y2="12" />  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                    : 
                                    <svg class="h-6 w-6 text-indigo-500"  viewBox="0 0 24 24"  fill="black"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                }
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Header;