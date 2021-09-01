import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { Helmet } from "react-helmet";

import { log } from './base'
import Search from './search'

import '/static/css/style.css'

const logo = '/static/img/Q2.png'
const nightModeIcon = '/static/img/lightMode.png'

const Header = (props) => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [nightMode, setNightMode] = useState(true)

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {

        if (nightMode) {
            if (localStorage.getItem('lightMode') !== 'true') {
                require('/static/css/nightTheme.css')
            }
        }
    }, [nightMode])
    
    // if (navigator.userAgent.indexOf("Firefox") !== -1 ) {
    //     if (localStorage.getItem('alertUFHB') !== 'true') {
    //         alert('لطفا از مرورگر کروم یا غیره استفاده کنید \n در مرورگر شما (فایرفاکس) برخی دیزاین ها قابل اجرا نیست')
    //         localStorage.setItem('alertUFHB', 'True')
    //     }
    // }

    const componentChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            checkIfShouldShowNightModeBtn()

        })(window.history);
    }

    const checkIfShouldShowNightModeBtn = () => {
        const pageUrl = window.location.pathname.split('/')

        if (pageUrl.includes('quiz')) {
            setNightMode(false)
        } else {
            setNightMode(true)
        }
    }

    const nightModeTurnOnOff = () => {

        if (localStorage.getItem('lightMode') === 'true') {
            localStorage.setItem('lightMode', false)
            window.location.reload();
        } else {
            require('/static/css/nightTheme.css')
            localStorage.setItem('lightMode', true)
            window.location.reload();
        }
    }

    const nightModeIconChanger = () => {
        if (localStorage.getItem('lightMode') === 'true') {
            return {
                background: `url('${nightModeIcon}') no-repeat center center`
            }
        }
    }

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseCategoryNavigation = () => {
        setCategoryNavigationOpen(categoryNavigationOpen ? false : true)

        if (quizNavigationOpen) {
            setQuizNavigationOpen(false)
        }
    }
    
    const openCloseQuizNavigation = () => {
        setQuizNavigationOpen(quizNavigationOpen ? false : true)

        if (categoryNavigationOpen) {
            setCategoryNavigationOpen(false)
        }
    }

    return (
        <React.Fragment>
            
            <Helmet>
                <title>{props.title || 'کوییزلند | کوییز - تست و تریویا | کوییز هایی از فیلم و سریال و سلبریتی ها'}</title>
                <meta name="description" content={props.description || 'سایت کوییزلند وب‌ سایت کوییز و تست برای کتگوری های متنوع همچون کوییز سلبریتی ها, کوییز های فیلم و سریال, کوییز های گیمینگ و تست های روانشناسی معتبر از سایت های رسمی و باحال ترین کوییز ها'} />
                <meta name="keywords" content={props.keywords || 'کوییز, سایت بازی کوییز, بازی کوییز, بازی کوییز, کوییزلند, کوییزلند, کوییز, کوییز های فیلم و سریال, کوییز های سلبریتی و آدم های معروف, خواننده, بازیگر, کوییز های گیمینگ, تست های روانشناسی معتبر, کوییز های باحال, کوییز های فان, بهترین وب سایت کوییز, بهترین وب سایت تست'} />
            </Helmet>

            <header className="header pos-rel">

                <nav className="flex flex-ai-c flex-jc-sb">

                    <div className="flex flex-ai-c">
                        <Link to="/" className='header__logo flex flex-jc-sb flex-ai-c hideForDesktop'>
                            <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال، گیمینگ و کوییز های روانشناسی و خودشناسی" />
                            <h3>uizzland</h3>
                        </Link>
                        <Search/>
                    </div>

                    <div className={`header__links pos-rel ${props.colorOfHeader} hideForMobile hoverAnimation flex flex-ai-c`}>
                        <Link className="header__logo flex flex-jc-sb flex-ai-c" to="/">
                            <h3>uizzland</h3>
                            <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال، گیمینگ و کوییز های روانشناسی و خودشناسی" />
                        </Link>
                        <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری‌ ها</button>
                        <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button>
                        <Link to="/guide">راهنما</Link>
                        <Link to="/contact">تماس با ما</Link>

                        {
                            nightMode &&
                            <div className="nightMode__container" title="تبدیل به حالت شب/روز">
                                <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                            </div>
                        }
                    </div>

                    <ul className={`header__categories ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${categoryNavigationOpen && 'subHeader__open'}`}>
                        <li><a href="/category/movie-series">🎬 فیلم و سریال</a></li>
                        <li><a href="/category/celebrity">✨ سلبریتی</a></li>
                        <li><a href="/category/psychology">🧠 روانشناسی</a></li>
                    </ul>
                    <ul className={`header__quizzes ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${quizNavigationOpen && 'subHeader__open'}`}>
                        <li><Link to="/sort?q=newest">⏳ جدیدترین ها</Link></li>
                        <li><Link to="/sort?q=bestest">👑 بهترین ها</Link></li>
                        <li><Link to="/sort?q=monthlyBestest">👑 بهترین های ماه</Link></li>
                        <li><HashLink to="/#sort">📚 مرتب شده</HashLink></li>
                    </ul>

                    {/* Menu */}
                    <button type="button" onClick={openCloseMenu} className={`header__menu__openBtn header__btn pos-abs ${props.colorOfHeader} hideForDesktop`} aria-label="Menu Button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div className={`header__menu pos-fix tx-al-r hideForDesktop ${!menuOpen && 'slideMenu-hide'}`}>
                        <button onClick={openCloseMenu} className="header__btn-bg pos-abs header__menu__closeBtn" aria-label="Close Menu Button"></button>
                        <div className="header__menu__inner grid grid-jc-c">
                            <div className="header__menu__inner__category">
                                <h4>کتگوری ها</h4>
                                <ul>
                                    <li><a href="/category/movie-series">🎬 فیلم و سریال</a></li>
                                    <li><a href="/category/celebrity">✨ سلبریتی</a></li>
                                    <li><a href="/category/psychology">🧠 روانشناسی</a></li>
                                </ul>
                            </div>
                            <div className="header__menu__inner__nav">
                                <h4>کویز ها</h4>
                                <ul className="header__menu__inner__quizzes tx-al-r">
                                    <li><Link to="/sort?q=newest">جدیدترین ها</Link></li>
                                    <li><Link to="/sort?q=bestest">بهترین ها</Link></li>
                                    <li><Link to="/sort?q=monthlyBestest">بهترین های ماه</Link></li>
                                    <li><HashLink to="/#sort">مرتب شده</HashLink></li>
                                </ul>
                            </div>
                            <div className="header__menu__inner__other">
                                <ul>
                                    <li><Link to="/guide">راهنما</Link></li>
                                    <li><Link to="/contact">تماس با ما</Link></li>

                                    {/* Night Mode */}
                                    {nightMode &&
                                        <div className="nightMode__container" title="تبدیل به حالت شب و بالعکس">
                                            <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                                        </div>
                                    }   
                                </ul>
                            </div>
                        </div>
                    </div>

                </nav>

                {/* <LoadingScreen /> */}

            </header>
        </React.Fragment>
    );
}
 
export default Header;