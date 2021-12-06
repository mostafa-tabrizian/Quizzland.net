import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import { log } from './base'
import Search from '../components/search'

// const nightModeIcon = '../images/lightMode.png'

const Header = (props) => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [pointyNavigationOpen, setPointyNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    // const [nightMode, setNightMode] = useState(true)

    useEffect(() => {
        componentChangeDetector()
    })

    // useEffect(() => {

    //     if (nightMode) {
    //         if (localStorage.getItem('lightMode') !== 'true') {
    //             // require('/static/css/nightTheme.css')
    //         }
    //     }
    // }, [nightMode])

    // if (navigator.userAgent.indexOf("Firefox") !== -1 ) {
    //     if (localStorage.getItem('alertUFHB') !== 'true') {
    //         alert('لطفا از مرورگر کروم یا غیره استفاده کنید \n در مرورگر شما (فایرفاکس) برخی دیزاین ها قابل اجرا نیست')
    //         localStorage.setItem('alertUFHB', 'True')
    //     }
    // }

    const componentChangeDetector = () => {
        (function (history) {

            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

            // checkIfShouldShowNightModeBtn()

        })(window.history);
    }

    // const checkIfShouldShowNightModeBtn = () => {
    //     const pageUrl = window.location.pathname.split('/')

    //     if (pageUrl.includes('quiz')) {
    //         setNightMode(false)
    //     } else {
    //         setNightMode(true)
    //     }
    // }

    // const nightModeTurnOnOff = () => {

    //     if (localStorage.getItem('lightMode') === 'true') {
    //         localStorage.setItem('lightMode', false)
    //         window.location.reload();
    //     } else {
    //         require('../styles/nightTheme.scss')
    //         localStorage.setItem('lightMode', true)
    //         window.location.reload();
    //     }
    // }

    // const nightModeIconChanger = () => {
    //     if (localStorage.getItem('lightMode') === 'true') {
    //         return {
    //             background: `url('${nightModeIcon}') no-repeat center center`
    //         }
    //     }
    // }

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseCategoryNavigation = () => {
        setCategoryNavigationOpen(categoryNavigationOpen ? false : true)
        // close every other panel
        setQuizNavigationOpen(false)
        setPointyNavigationOpen(false)
    }

    const openCloseQuizNavigation = () => {
        setQuizNavigationOpen(quizNavigationOpen ? false : true)
        // close every other panel
        setCategoryNavigationOpen(false)
        setPointyNavigationOpen(false)
    }

    const openClosePointyNavigation = () => {
        setPointyNavigationOpen(pointyNavigationOpen ? false : true)
        // close every other panel
        setCategoryNavigationOpen(false)
        setQuizNavigationOpen(false)
    }

    return (
        <>


            <header className={`header pos-rel`}>

                {/* <Head>
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
                </Head> */}


                <nav className="flex flex-ai-c flex-jc-sb">
                    <div>
                        <Link href="/">
                            <a className='header__logo flex flex-jc-sb flex-ai-c hideForDesktop'>
                                <Image
                                    src='/../public/images/Q-small.png'
                                    alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                    width={24}
                                    height={35}
                                />
                                <span>uizzland</span>
                            </a>
                        </Link>
                    </div>

                    <div className={`header__links pos-rel ${props.colorOfHeader} hideForMobile hoverAnimation flex flex-ai-c`}>
                        <Link href="/">
                            <a className="header__logo flex flex-jc-sb flex-ai-c">
                                <span>uizzland</span>
                                <Image
                                    src='/../public/images/Q-small.png'
                                    alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                    width={24}
                                    height={35}
                                />
                            </a>
                        </Link>

                        <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری‌ ها</button>
                        <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button>
                        <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                        <Link href="/blog"><a>وبلاگ</a></Link>
                        {/* {
                            nightMode &&
                            <div className="nightMode__container" title="تبدیل به حالت شب/روز">
                                <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                            </div>
                        } */}
                    </div>

                    {/* <Search/> */}

                    <ul className={`header__categories ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${categoryNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><Link href="/category/movie-series"><a>🎬 فیلم و سریال</a></Link></li>
                        <li><Link href="/category/celebrity"><a>✨ سلبریتی</a></Link></li>
                        <li><Link href="/category/psychology"><a>🧠 روانشناسی</a></Link></li>
                    </ul>

                    <ul className={`header__quizzes ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${quizNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><Link href="/sort?q=newest"><a> ⏳ جدیدترین ها </a></Link></li>
                        <li><Link href="/sort?q=monthlyBestest"><a> 👑 بهترین های ماه </a></Link></li>
                        <li><Link href="/sort?q=bestest"><a> 👑 بهترین ها </a></Link></li>
                    </ul>

                    <ul className={`header__pointy ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${pointyNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><Link href="/sort?q=newest_test"><a> ⏳ جدیدترین ها </a></Link></li>
                        <li><Link href="/sort?q=monthlyBestest_test"><a> 👑 بهترین های ماه </a></Link></li>
                        <li><Link href="/sort?q=bestest_test"><a> 👑 بهترین ها </a></Link></li>
                    </ul>

                    {/* Menu */}
                    <button type="button" onClick={openCloseMenu} className={`header__menu__openBtn header__btn pos-abs ${props.colorOfHeader} hideForDesktop`} aria-label="Menu Button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div className={`header__menu pos-fix tx-al-r hideForDesktop ${menuOpen ? '' : 'slideMenu-hide'}`}>
                        <button onClick={openCloseMenu} className="header__btn-bg pos-abs header__menu__closeBtn" aria-label="Close Menu Button"></button>
                        <div className="header__menu__inner grid grid-jc-c">
                            <div className="header__menu__inner__category">
                                <h4>کتگوری ها</h4>
                                <ul>
                                    <li><Link href="/category/movie-series"><a >فیلم و سریال 🎬</a></Link></li>
                                    <li><Link href="/category/celebrity"><a>سلبریتی ✨</a></Link></li>
                                    <li><Link href="/category/psychology"><a>روانشناسی 🧠</a></Link></li>
                                </ul>
                            </div>
                            <div className="header__menu__inner__nav">
                                <h4>کویز ها</h4>
                                <ul className="header__menu__inner__quizzes tx-al-r">
                                    <li onClick={openCloseMenu}><Link href="/sort?q=newest"><a> جدیدترین ها </a></Link></li>
                                    <li onClick={openCloseMenu}><Link href="/sort?q=monthlyBestest"><a> بهترین های ماه </a></Link></li>
                                    <li onClick={openCloseMenu}><Link href="/sort?q=bestest"><a> بهترین ها </a></Link></li>
                                </ul>

                                <h4 className='space-med'>تست ها</h4>
                                <ul className="header__menu__inner__quizzes tx-al-r">
                                    <li onClick={openCloseMenu}><Link href="/sort?q=newest_test"><a> جدیدترین ها </a></Link></li>
                                    <li onClick={openCloseMenu}><Link href="/sort?q=monthlyBestest_test"><a> بهترین های ماه </a></Link></li>
                                    <li onClick={openCloseMenu}><Link href="/sort?q=bestest_test"><a> بهترین ها </a></Link></li>
                                </ul>
                            </div>
                            <div className="header__menu__inner__other">
                                <ul>
                                    <li onClick={openCloseMenu}><Link href="/blog"><a> وبلاگ </a></Link></li>
                                    <li onClick={openCloseMenu}><Link href="/guide"><a> راهنما </a></Link></li>
                                    <li onClick={openCloseMenu}><Link href="/contact"><a> تماس با ما </a></Link></li>

                                    {/* Night Mode */}
                                    {/* {nightMode &&
                                        <div className="nightMode__container" title="تبدیل به حالت شب و بالعکس">
                                            <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                                        </div>
                                    }    */}
                                </ul>

                            </div>
                        </div>
                    </div>

                </nav>

                {/* <LoadingScreen /> */}

            </header>
        </>
    );
}

export default Header;