import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { gapi } from 'gapi-script'
import { useGoogleLogout } from 'react-google-login'
import { useCookies } from "react-cookie";
import { useSnackbar } from 'notistack'
import { BigHead } from "@bigheads/core";
import axios from 'axios';

import { log, getTheme, keyPressedOnInput } from './base'
import Search from './search/searchInput'
import Notification from './user/notification'
import userProfileDetail from '../components/user/userProfileDetail'
import userStore from '../../src/store/userStore'
import BackdropLoading from './bacdropLoading';
import LoginForm from './user/loginForm';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchMobileOpen, setSearchMobileOpen] = useState(false)
    const [profileSubMenu, setProfileSubMenu] = useState(false)
    const [categorySubMenu, setCategorySubMenu] = useState(null)
    const [theme, setTheme] = useState('dark')
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    
    const mobileSearchInput = useRef()

    const [cookies, setCookie, removeCookie] = useCookies(['USER_ACCESS_TOKEN', 'USER_REFRESH_TOKEN']);

    const [userProfile, userActions] = userStore()

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        gapiLoad()
        getUserData()
        setTheme(getTheme())
    }, [])

    useEffect(() => {
        setProfileSubMenu(false)
        setCategorySubMenu(false)
        setMenuOpen(false)
    }, [location])

    const gapiLoad = () => {
        const startGapiClient = () => {
            gapi.client.init({
                clientId: process.env.GOOGLE_LOGIN_CLIENT,
                scope: ''
            })
        }
        gapi.load('client:auth2', startGapiClient)
    }
    
    const getUserData = async () => {
        const userProfileDetailData = await userProfileDetail()

        if (userProfileDetailData == 'inactive') {
            removeCookie('USER_ACCESS_TOKEN', {path: '/'})
            removeCookie('USER_REFRESH_TOKEN', {path: '/'})
            enqueueSnackbar('اکانت شما غیرفعال شده است. لطفا با پشتیبانی تماس بگیرید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
        } else {
            userActions.setUser(userProfileDetailData)
        }
    }

    const { signOut } = useGoogleLogout({
        clientId: process.env.GOOGLE_LOGIN_CLIENT,
        onLogoutSuccess: () => {log('google 1')},
        onFailure: () => {log('google 2')},
    })

    const handleLogout = async () => {
        setLoading(true)
        
        try {
            signOut()
        }
        catch (e) {
            log('signOut google error')
            log(e)
        }
        
        try {
            await axios.post('/api/blacklist/', {"refresh_token": cookies.USER_REFRESH_TOKEN,})
                .catch(err => {
                    log(err)
                    log(err.response)
                })
    
            removeCookie('USER_ACCESS_TOKEN', {path: '/'})
            removeCookie('USER_REFRESH_TOKEN', {path: '/'})
            
            axios.defaults.headers['Authorization'] = null;
            signOut()         
            window.location.reload()
        } catch (e) {
            log('logout error:')
            log(e)
        }
    };

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseSearchMobile = () => {
        setSearchMobileOpen(searchMobileOpen ? false : true)
    }

    const changeTheme = () => {
        const updateTheme = theme == 'dark' ? 'light' : 'dark'
        setTheme(updateTheme)
        localStorage.setItem('theme', updateTheme)
        window.location.reload()
    }
    
    return (
        <React.Fragment>
            <Helmet>
                <script type="text/javascript">
                    {`
                        var head = document.getElementsByTagName("head")[0];
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.async=1;
                        script.src = "https://s1.mediaad.org/serve/Quizzland.net/loader.js" ;
                        head.appendChild(script); 
                    `}
                </script>

                <script type="text/javascript">
                    {`
                        (function(){
                        var now = new Date();
                        var head = document.getElementsByTagName('head')[0];
                        var script = document.createElement('script');
                        script.async = true;
                        var script_address = 'https://cdn.yektanet.com/js/Quizlqnd.com/native-Quizlqnd.com-18610.js';
                        script.src = script_address + '?v=' + now.getFullYear().toString() + '0' + now.getMonth() + '0' + now.getDate() + '0' + now.getHours();
                        head.appendChild(script);
                        })();
                    `}
                </script>

                <script>
                    {`
                        (function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:2587894,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
                </script>
            </Helmet>

            <BackdropLoading loadingStatue={loading} />

            <header className={`relative z-10 ${theme == 'dark' ? 'bg-[#0601017c]' : 'bg-[#ffffff82]' } rounded-md backdrop-blur-md p-5`}>
                <div>
                    <div className='items-center justify-center hidden md:flex'>
                        <Link to="/" className="flex items-center justify-between header__logo">
                            <span className='bloodRiver ml-1 text-[1.6rem]'>uizzland</span>
                            <img
                                src='/static/img/Q-small.png'
                                alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشsearchناسی'
                                width={24}
                                height={35}
                            />
                        </Link>
                    </div>

                    <div className='absolute hidden left-10 top-5 md:block hover:cursor-pointer' onClick={changeTheme}>
                        {
                            theme == 'dark' ? 
                            <svg class="h-6 w-6 text-indigo-500"  viewBox="0 0 24 24"  fill="black"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            : 
                            <svg class="h-6 w-6 text-yellow-500"  viewBox="0 0 24 24"  fill="yellow"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="5" />  <line x1="12" y1="1" x2="12" y2="3" />  <line x1="12" y1="21" x2="12" y2="23" />  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />  <line x1="1" y1="12" x2="3" y2="12" />  <line x1="21" y1="12" x2="23" y2="12" />  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                        }
                    </div>

                    <div className="header text-xl flex md:grid md:grid-cols-3 justify-between md:max-w-[85%] relative md:mx-auto md:p-4">

                        <div className='flex items-center md:hidden'>
                            <button onClick={openCloseSearchMobile} className='flex items-center header__btn' type="button">
                                <svg className={`w-8 h-8 ${theme == 'dark' ? 'text-white' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <button type="button" onClick={openCloseMenu} className={`header__btn mr-5 `} aria-label="Menu Button">
                                <svg className={`w-8 h-8 ${theme == 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
                            </button>
                        </div>

                        <div className='relative flex-col hidden px-8 space-x-5 md:justify-center md:flex'>
                            <div className='flex items-center space-x-3 space-x-reverse'>   
                                {
                                    userProfile.userDetail?
                                    <div className='flex items-center space-x-3 space-x-reverse hover:cursor-pointer' onClick={() => setProfileSubMenu(!profileSubMenu)}>
                                        <div className='w-24 h-24'>
                                            {
                                                userProfile.userDetail?.avatar &&
                                                <BigHead {...JSON.parse(userProfile.userDetail?.avatar)} />
                                            }
                                        </div>
                                        
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
                                    </div>
                                    :
                                    <LoginForm />
                                }
                            </div>

                            <div className={`absolute top-20 right-36 border-2 ${theme == 'dark' ? 'bg-[#0e0202f3]' : 'bg-[#f0f0f0]  shadow-[0_5px_15px_#b3b3b3]'} border-[#690D11] rounded-lg ${profileSubMenu ? '' : 'hidden'}`}>
                                <div className='relative px-4 py-4 max-w-[14rem]'>
                                    <div>
                                        <ul className='flex flex-col'>
                                            <li><Link to={`/profile/${userProfile.userDetail?.username}`}>پروفایل شما</Link></li>
                                            <li><Link to='/profile/setting'>تنظیمات اکانت</Link></li>
                                            <li><Link to='/profile/playlist?list=like'>کوییز های لایک شده</Link></li>
                                            <li><Link to='/profile/playlist?list=watch'>کوییز های پلی لیست شما</Link></li>
                                            <li><Link to='/profile/playlist?list=history'>تاریخچه کوییز های شما</Link></li>
                                            <li><button onClick={() => handleLogout()}>خروج</button></li>
                                        </ul>
                                    </div>

                                    <hr />

                                    <div>
                                        <h2>اطلاعیه برای شما</h2>
                                            {userProfile.userDetail && <Notification user={userProfile.userDetail?.id} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`hidden md:flex md:justify-center items-center relative`}>
                            <div className="flex space-x-reverse space-x-7">
                                {/* <button className="header__btn">
                                    <Link to="/blog"> وبلاگ </Link>
                                </button> */}
                                {/* <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                                <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button> */}
                                <Link to='/sort?s=newest'>کوییز و تست ها</Link>
                                <button className='header__btn' onClick={() => setCategorySubMenu(!categorySubMenu)}>کتگوری ها</button>
                            </div>
                            
                            <div className={`absolute top-20 left-12 border-2 ${theme == 'dark' ? 'bg-[#0e0202f3]' : 'bg-[#f0f0f0] shadow-[0_5px_15px_#b3b3b3]'} border-[#690D11] rounded-lg ${categorySubMenu ? '' : 'hidden'}`}>
                                <div className='relative px-4 py-4'>
                                    <ul className='flex flex-col'>
                                        <li><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                                        <li><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                                        <li><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Search />
                        
                        <div>
                            <Link to="/" className='flex items-center justify-between header__logo md:hidden'>
                                <span className='bloodRiver ml-1 text-[1.6rem]'>uizzland</span>
                                <img
                                    src='/static/img/Q-small.png'
                                    alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                    width={24}
                                    height={35}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='block mt-4 space-x-3 space-x-reverse md:hidden'>
                    {
                        userProfile.userDetail ?
                            <Link to={`/profile/${userProfile.userDetail?.username}`}>
                                <div className='flex items-center'>
                                    <div className='w-20 h-24'>
                                        {
                                            userProfile.userDetail?.avatar &&
                                            <BigHead {...JSON.parse(userProfile.userDetail?.avatar)} />
                                        }
                                    </div>
                                    <div className='flex space-x-1 space-x-reverse'>
                                    {
                                        (userProfile.userDetail?.first_name == '' && userProfile.userDetail?.last_name == '') ?
                                        <div>
                                            {userProfile.userDetail?.username}
                                        </div>
                                        :
                                        <div className='flex space-x-1 space-x-reverse'>
                                            <div>
                                                {userProfile.userDetail?.first_name}
                                            </div>
                                            <div>
                                                {userProfile.userDetail?.last_name}
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </Link>
                            :
                            <LoginForm />
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
                        <svg className={`w-8 h-8 ${theme == 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <input
                        type='text'
                        className={`text-center absolute top-1/4 w-[70%] bg-transparent border-b-2 border-[#690D11] text-[1.5rem] outlne-none ${theme == 'dark' ? 'text-white' : 'text-black'}`}
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
                        <svg className={`w-8 h-8 ${theme == 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <div className='relative mt-5'>
                    {
                        userProfile.userDetail ?
                        <React.Fragment>
                            <hr className='border-[#690D11] '/>
                            
                            <h4>اطلاعیه برای شما</h4>
                            <div className='mt-2'>
                                <Notification user={userProfile.userDetail?.id} />
                            </div>

                            <hr className='border-[#690D11] '/>
                            
                            <ul className='flex flex-col mt-5 space-y-5'>
                                <li className='text-lg'><Link to={`/profile/${userProfile.userDetail?.username}`}>پروفایل شما</Link></li>
                                <li className='text-lg'><Link to='/profile/setting'>تنظیمات اکانت</Link></li>
                                <li className='text-lg'><Link to='/profile/playlist?list=like'>کوییز های لایک شده</Link></li>
                                <li className='text-lg'><Link to='/profile/playlist?list=watch'>کوییز های پلی لیست شما</Link></li>
                                <li className='text-lg'><Link to='/profile/playlist?list=history'>تاریخچه کوییز های شما</Link></li>
                                <li><button onClick={() => handleLogout()}>خروج</button></li>
                            </ul>
                        </React.Fragment>
                        :
                        <LoginForm />
                    }
                        
                    </div>

                    <div className='relative mt-5'>
                        <hr className='border-[#690D11] '/>
                        <h3 className='text-xl'>کتگوری ها</h3>
                        <ul className='flex mt-3 space-x-3 space-x-reverse'>
                            <li className='text-lg'><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                            <li className='text-lg'><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                            <li className='text-lg'><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                        </ul>
                    </div>
                    <div className='relative mt-5'>
                        <hr className='border-[#690D11] '/>
                        <h3 className='text-xl'>کوییز و تست ها</h3>
                        <ul className='flex mt-3 space-x-6 space-x-reverse'>
                            <li className='text-lg'><Link to="/sort?s=newest"> جدیدترین </Link></li>
                            <li className='text-lg'><Link to="/sort?s=trend"> محبوب ترین </Link></li>
                            <li className='text-lg'><Link to="/sort?s=views"> پربازدیدترین </Link></li>
                        </ul>
                    </div>
                    <div className='relative mt-5'>
                        <hr className='border-[#690D11] '/>
                        <ul className='mt-3 space-y-3'>
                            {/* <li className='text-lg'><Link to="/blog"> وبلاگ </Link></li> */}
                            {/* <li className='text-lg'><Link to="/guide"> راهنما </Link></li> */}
                            <li className='text-lg'><Link to="/contact"> تماس با ما </Link></li>
                            <li className='flex space-x-3 space-x-reverse text-lg' onClick={changeTheme}>
                                <span>
                                    تم حالت  
                                </span>
                                {
                                    theme == 'dark' ? 
                                    <svg class="h-6 w-6 text-indigo-500"  viewBox="0 0 24 24"  fill="black"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                    : 
                                    <svg class="h-6 w-6 text-yellow-500"  viewBox="0 0 24 24"  fill="yellow"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="5" />  <line x1="12" y1="1" x2="12" y2="3" />  <line x1="12" y1="21" x2="12" y2="23" />  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />  <line x1="1" y1="12" x2="3" y2="12" />  <line x1="21" y1="12" x2="23" y2="12" />  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Header;