import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { Popover } from 'antd';

import { log } from './base'
import Search from './search'
import userProfileDetail from '../components/userProfileDetail'
import axiosInstance from './axiosApi';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileSubMenu, setProfileSubMenu] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [categorySubMenu, setCategorySubMenu] = useState(null)

    const mobileSearchInput = useRef()

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(async () => {
        setUserProfile(await userProfileDetail())
    }, [])

    const componentChangeDetector = () => {
        (function (history) {

            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

        })(window.history);
    }

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('api/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            window.location.reload()
            return response;
        }
        catch (e) {
            console.log(e);
        }
    };

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const searchInputMobile = (
        <input
            type='text'
            className={`text-right bg-transparent text-lg outline-none text-black`}
            ref={mobileSearchInput}
            onKeyPress={e => { if (e.key == 'Enter') { window.open(`/search?q=${e.target.value}`, '_blank') } }}
        />
    )

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

            <header className='mb-10 relative z-10 bg-[#0601017c] p-4 rounded-md backdrop-blur-md'>
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

                    <div className="header text-xl flex md:grid md:grid-cols-3 justify-between md:max-w-[85%] relative md:mx-auto md:p-4">

                        <div className='flex items-center md:hidden'>
                            <Popover placement="bottomRight" title='' content={searchInputMobile} trigger="click">
                                <button className='flex items-center header__btn' type="button">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </Popover>

                            <button type="button" onClick={openCloseMenu} className={`header__btn mr-5 `} aria-label="Menu Button">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
                            </button>
                        </div>

                        <div className='relative flex-col hidden px-8 space-x-5 md:justify-center md:flex'>
                            <div className='flex items-center space-x-3 space-x-reverse'>
                                {
                                    userProfile?.avatar?
                                    <img className="" src={userProfile.avatar} alt={userProfile.username} />
                                    :
                                    <svg className="h-10 w-10 text-[#ac272e]"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                }
                                {
                                    userProfile ?
                                    <h2 onClick={() => setProfileSubMenu(!profileSubMenu)} className='hover:cursor-pointer'>
                                        <div className='flex items-center'>
                                            <div className='flex space-x-1 space-x-reverse'>
                                                <div>
                                                    {userProfile.first_name}
                                                </div>
                                                <div>
                                                    {userProfile.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </h2>
                                    :
                                    <Link to='/login' className='px-4 h-fit border-2 border-[#690D11] rounded-lg'>ورود</Link>
                                }
                            </div>

                            <div className={`absolute top-14 border-2 bg-[#1d1313] border-[#690D11] rounded-lg ${profileSubMenu ? '' : 'hidden'}`}>
                                <div className='relative px-4 py-4'>
                                    <div>
                                        <ul className='flex flex-col'>
                                            <li><Link to={`/profile/${userProfile?.username}`}>پروفایل شما</Link></li>
                                            <li><Link to='/setting'>تنظیمات اکانت</Link></li>
                                            <li><button onClick={() => handleLogout()}>خروج</button></li>
                                        </ul>
                                    </div>

                                    <hr />

                                    <div>
                                        <h2>اطلاعیه ها</h2>
                                        <div>
                                            <ul>
                                                <li><p className='text-sm'>هیچ اطلاعیه ای ندارید!</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className={`hidden md:flex md:justify-center items-center relative`}>
                            <div className="space-x-reverse space-x-7">
                                {/* <button className="header__btn">
                                    <Link to="/blog"> وبلاگ </Link>
                                </button> */}
                                {/* <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                                <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button> */}
                                <Link to='/sort?s=newest' className='text-xl'>کوییز و تست ها</Link>
                                <button className='header__btn' onClick={() => setCategorySubMenu(!categorySubMenu)}>کتگوری ها</button>
                            </div>
                            
                            <div className={`absolute top-14 left-4 border-2 bg-[#1d1313] border-[#690D11] rounded-lg ${categorySubMenu ? '' : 'hidden'}`}>
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

                        {/* Menu */}

                        <div className={`header__menu fixed text-right h-screen m-[-1rem] z-10 w-[100vw]
                                        bg-[#1d1313] top-0 right-0
                                        md:hidden ${menuOpen ? '' : 'slideMenu-hide'}
                                        pr-8 pt-5`}>
                            <button onClick={openCloseMenu} className="header__menu__closeBtn" aria-label="Close Menu Button">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>

                            <div className='mt-5'>
                            {
                                userProfile ?
                                <React.Fragment>
                                    <h4 className='text-xl'>اطلاعات اکانت</h4>
                                    <ul className='flex space-x-6 space-x-reverse'>
                                        <li className='text-lg'><Link to={`/profile/${userProfile?.username}`}>پروفایل شما</Link></li>
                                        <li className='text-lg'><Link to='/setting'>تنظیمات اکانت</Link></li>
                                        <li className='text-lg'><Link to='/logout'>خروج</Link></li>
                                    </ul>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Link to='/login'>ورود</Link>
                                    <Link to='/register'>ثبت نام</Link>
                                </React.Fragment>
                            }
                                
                            </div>

                            <div className='mt-5'>
                                <h4 className='text-xl'>کتگوری ها</h4>
                                <ul className='flex space-x-3 space-x-reverse'>
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                                </ul>
                            </div>
                            <div className='mt-5'>
                                <h4 className='text-xl'>کوییز و تست ها</h4>
                                <ul className='flex space-x-6 space-x-reverse'>
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=newest"> جدیدترین </Link></li>
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=trend"> محبوب ترین </Link></li>
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=views"> پربازدیدترین </Link></li>
                                </ul>
                            </div>
                            <div className='mt-5'>
                                <ul className='flex space-x-6 space-x-reverse'>
                                    {/* <li className='text-lg' onClick={openCloseMenu}><Link to="/blog"> وبلاگ </Link></li> */}
                                    {/* <li className='text-lg' onClick={openCloseMenu}><Link to="/guide"> راهنما </Link></li> */}
                                    <li className='text-lg' onClick={openCloseMenu}><Link to="/contact"> تماس با ما </Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='block md:hidden'>
                    {
                        userProfile ?
                            <Link to={`/profile/${userProfile.username}`}>
                                <div className='flex items-center'>
                                    <svg class="h-10 w-10 ml-3 text-[#ac272e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className='flex space-x-1 space-x-reverse'>
                                        <div>
                                            {userProfile.first_name}
                                        </div>
                                        <div>
                                            {userProfile.last_name}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            :
                            <React.Fragment>
                                <Link to='/login'>ورود</Link>
                                <Link to='/register'>ثبت نام</Link>
                            </React.Fragment>
                    }
                </div>

            </header>

        </React.Fragment>
    );
}

export default Header;