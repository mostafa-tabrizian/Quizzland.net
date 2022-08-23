import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer';
import { Carousel } from 'antd';
import axios from 'axios'

import skeletonQuiz from '../components/skeletonQuiz';
import { log, keyPressedOnInput, getTheme, replaceFunction, isItMobile, sortByNewest, sortByMonthlyViews } from '../components/base'
import QuizContainer from '../components/quizContainer'
import LoadingScreen from '../components/loadingScreen'
import Suggestions from '../components/suggestions';

const Index = () => {
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [theme, setTheme] = useState('dark')

    const [content_new, setContent_new] = useState([])
    const [content_monthly, setContent_monthly] = useState([])

    const [content_new_celebrity, setContent_new_celebrity] = useState([])
    const [content_new_movieSeries, setContent_new_movieSeries] = useState([])
    const [content_new_psychology, setContent_new_psychology] = useState([])

    const [loadMoreQuiz, setLoadMoreQuiz] = useState([])

    const [content_new_ref, content_new_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [content_monthly_ref, content_monthly_inView] = useInView({ threshold: 0, triggerOnce: true, });

    const [content_new_celebrity_ref, content_new_celebrity_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [content_new_movieSeries_ref, content_new_movieSeries_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [content_new_psychology_ref, content_new_psychology_inView] = useInView({ threshold: 0, triggerOnce: true, });

    const [loadMoreQuiz_ref, loadMoreQuiz_inView] = useInView({ threshold: 0, triggerOnce: true, })

    useEffect(() => {
        grabData()
        setLoadState(true)
        
        const theme = getTheme()
        setTheme(theme)
        document.querySelector('body').style = `background: ${theme == 'dark' ? '#060101' : 'white'}`
    }, [])

    const grabData = async () => {
        const quiz = await axios.get(`/api/quizView/?limit=70&public=true`)
        // .catch(err => {log(err.response)})
        const pointy = await axios.get(`/api/testView/?limit=70&public=true`)
        // .catch(err => {log(err.response)})
        const content = quiz.data.results.concat(pointy.data.results)

        setContent_new(content.sort(sortByNewest).slice(0, 20))
        setContent_monthly(content.sort(sortByMonthlyViews).slice(0, 20))
        setContent_new_movieSeries(content.filter(quiz => quiz.categoryKey.title_english == 'Movie & Series').sort(sortByNewest).slice(0, 20))
        setContent_new_celebrity(content.filter(quiz => quiz.categoryKey.title_english == 'Celebrity').sort(sortByNewest).slice(0, 20))
        setContent_new_psychology(content.filter(quiz => quiz.categoryKey.title_english == 'Psychology').sort(sortByNewest).slice(0, 20))
        setLoadMoreQuiz(content.sort(sortByNewest).slice(21, 69))
        setContentLoaded(true)
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Helmet>
                <title>کوییزلند | Quizzland</title>
                <meta name="description" content="سایت کوییزلند وب‌ سایت کوییز و تست برای کتگوری های متنوع همچون سلبریتی , فیلم و سریال و تست های روانشناسی معتبر از سایت های رسمی و کوییزهای باحال دیگه" />
                <meta name="keywords" content="کوییز, سایت بازی کوییز, بازی کوییز, بازی کوییز, کوییزلند, کوییزلند, کوییز, کوییز های فیلم و سریال, کوییز های سلبریتی و آدم های معروف, خواننده, بازیگر, کوییز های تست های روانشناسی معتبر, کوییز های باحال, کوییز های فان, بهترین وب سایت کوییز, بهترین وب سایت تست، کوییز تیلور سویفت، کوییز فرندز، کوییز مارول" />
                <link rel='canonical' href='https://www.quizzland.net/' />

                <script type='application/ld+json'>
                    {`
                        {
                            "@context": "https://schema.org/",
                            "@type": "WebSite",
                            "name": "کوییزلند",
                            "url": "https://quizzland.net",
                            "potentialAction": {
                                    "@type": "SearchAction",
                                    "target": "https://www.quizzland.net/search?s={search_term_string}",
                                    "query-input": "required name=search_term_string"
                            }
                        }
                    `}
                </script>
            </Helmet>

            <div className="bg-[url('/static/img/bubbles.webp')] bg-no-repeat bg-top drop-shadow-[5px_11px_12px_black] hidden md:block absolute w-screen h-screen top-0"></div>

            <div className='relative z-0 mx-4 md:m-auto md:w-4/5'>

                <div className={`hero hidden md:flex justify-center items-center bg-gradient-to-t backdrop-blur-md from-[#8b181f] via-transparent p-3 rounded-lg m-auto`}>

                    <div className='relative ml-5 mb-[-3rem] drop-shadow-[10px_15px_10px_black] hidden md:block'>
                        <div className='pointer-events-none'>
                            <img
                                src='/static/img/Q.webp'
                                width={175}
                                height={252}
                                alt='لوگوی کوییزلند'
                            />
                        </div>
                    </div>

                    <div className='hero__start text-right mr-9 mb-[50%] lg:mb-0 lg:mr-4'>
                        <h1 className='relative flex text-[3rem] mb-2'>
                            اینجا <h1 className='mr-4 bloodRiver'>کوییزلندِ</h1>
                        </h1>
                        <h2 className='text-[1.3rem] max-w-[26rem] drop-shadow-[0_0_25px_black]'>
                            جایی که میتونی خودت رو به عنوان یه فن به بقیه ثابت کنی پس اگر آماده ای بزن بریم 😎
                        </h2>

                        <div className='relative'>
                            <input
                                type='text'
                                className={`pl-4 pr-12 py-1 rounded-full text-right ${theme == 'dark' ? 'bg-[#060101]' : 'bg-[#f0f0f0]' } text-[0.9rem] w-[20rem] mt-5 mb-5`}
                                placeholder={`چیزی مد نظرته؟ اینجا پیداش کن...`}
                                onKeyPress={(e) => keyPressedOnInput(e)}
                            />
                            <svg className='w-5 h-5 absolute top-[1.6rem] right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                                <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
                                <path data-name="layer1" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round" />
                            </svg>
                        </div>
                        {/* <button
                            onClick={() => {document.getElementById('scroll').scrollIntoView()}}
                            className='
                                items-center btn text-[1.6rem] py-[.5rem] px-[3rem]
                                radius-[5rem] inline-flex shadow-[inset_6px_0_22px_black]
                                relative z-1
                        '>
                            <span>
                                <svg className="w-6 h-6 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </span>
                            بزن بریم
                            
                        </button> */}
                    </div>
                </div>

                {/* sliders */}
                <div className='justify-center hidden w-full mt-20 space-x-10 md:flex'>
                    <div className='relative w-7/12 ml-5'>
                        <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } px-4 py-1 flex space-x-3 items-baseline`}>
                            <h2 className='text-[1rem]'>
                                کوییزلند 🔥
                            </h2>
                            <h2>
                                #1
                            </h2>
                        </div>
                        <Link to={`/${content_monthly[0]?.type}/${content_monthly[0] && replaceFunction(content_monthly[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={content_monthly[0]?.thumbnail} alt="" />
                        </Link>
                        <div className={`absolute bottom-0 text-[1rem] right-0 m-3 ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } rounded-xl px-4 py-1`}>
                            <h2>
                                {content_monthly[0] && content_monthly[0].title}
                            </h2>
                        </div>
                    </div>
                    <div className='relative w-5/12'>
                        <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } px-4 py-1 flex space-x-3 items-baseline`}>
                            <h2 className='translate-y-[4px]'>
                                🕚
                            </h2>
                            <h2 className='text-[1rem]'>
                                جدیدترینِ کوییزلند
                            </h2>
                        </div>
                        <Link to={`/${content_new[0]?.type}/${content_new[0] && replaceFunction(content_new[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={content_new[0]?.thumbnail} alt="" />
                        </Link>
                        <div className={`absolute bottom-0 text-[1rem] right-0 m-3 ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } rounded-xl px-4 py-1`}>
                            <h2>
                                {content_new[0] && content_new[0].title}
                            </h2>
                        </div>
                    </div>
                </div>

                <Carousel autoplay dotPosition='top' className='block mb-20 md:hidden'>
                    <div className='relative w-7/12 mr-5'>
                        <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } px-4 py-1 flex space-x-3 items-baseline`}>
                            <h2 className='text-[1rem]'>
                                کوییزلند 🔥
                            </h2>
                            <h2>
                                #1
                            </h2>
                        </div>
                        <Link to={`/quiz/${content_monthly[0] && replaceFunction(content_monthly[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={content_monthly[0]?.thumbnail} alt="" />
                        </Link>
                        <div className={`absolute bottom-0 text-[1rem] right-0 m-3 ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } rounded-xl px-4 py-1`}>
                            <h4>
                                {content_monthly[0] && content_monthly[0].title}
                            </h4>
                        </div>
                    </div>
                    <div className='relative w-5/12'>
                        <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } px-4 py-1 flex space-x-3 items-baseline`}>
                            <h4 className='translate-y-[4px]'>
                                🕚
                            </h4>
                            <h2 className='text-[1rem]'>
                                جدیدترینِ کوییزلند
                            </h2>
                        </div>
                        <Link to={`/quiz/${content_new[0] && replaceFunction(content_new[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={content_new[0]?.thumbnail} alt="" />
                        </Link>
                        <div className={`absolute bottom-0 text-[1rem] right-0 m-3 ${theme == 'dark' ? 'bg-[#060102]' : 'bg-[#f0f0f0]' } rounded-xl px-4 py-1`}>
                            <h4>
                                {content_new[0] && content_new[0].title}
                            </h4>
                        </div>
                    </div>
                </Carousel>

                <Suggestions />

                <div className="mb-8 md:mt-[10rem]">
                    <span id='scroll' />

                    <div className="flex items-center justify-between mb-8 quizContainer__header">
                        <h4>جدیدترین ها</h4>
                        <Link to="/sort?s=newest" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><div>نتایج بیشتر</div></Link>
                    </div>

                    {skeletonQuiz(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={content_new_ref}>
                        {
                            content_new_inView &&
                            <QuizContainer quizzes={content_new} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-WSYR'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-KlKX'></div>
                }

                <div className="mb-8">

                    <div className="flex items-center justify-between mb-8 quizContainer__header">
                        <h4>محبوب ترین ها</h4>
                        <Link to="/sort?s=trend" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><div>نتایج بیشتر</div></Link>
                    </div>

                    {skeletonQuiz(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={content_monthly_ref}>
                        {
                            content_monthly_inView &&
                            <QuizContainer quizzes={content_monthly} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-kvDM'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-OheS'></div>
                }

                <div className="mb-8">

                    <div className="flex items-center justify-between mb-8 quizContainer__header">
                        <h4>کوییز سلبریتی</h4>
                        <Link to="/sort?s=newest&c=2" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><div>نتایج بیشتر</div></Link>
                    </div>

                    {skeletonQuiz(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={content_new_celebrity_ref}>
                        {
                            content_new_celebrity_inView &&
                            <QuizContainer quizzes={content_new_celebrity} bgStyle='trans' />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-niPM'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-QCZY'></div>
                }

                <div className="mb-8">

                    <div className="flex items-center justify-between mb-8 quizContainer__header">
                        <h4>کوییز فیلم و سریال</h4>
                        <Link to="/sort?s=newest&c=1" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><div>نتایج بیشتر</div></Link>
                    </div>

                    {skeletonQuiz(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={content_new_movieSeries_ref}>
                        {
                            content_new_movieSeries_inView &&
                            <QuizContainer quizzes={content_new_movieSeries} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="flex items-center justify-between mb-8 quizContainer__header">
                        <h4>تست روانشناسی</h4>
                        <Link to="/sort?s=newest&c=3" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><div>نتایج بیشتر</div></Link>
                    </div>

                    {skeletonQuiz(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={content_new_psychology_ref}>
                        {
                            content_new_psychology_inView &&
                            <QuizContainer quizzes={content_new_psychology} bgStyle='trans' />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-bXEw'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-qBZW'></div>
                }

                <div className="mt-8 mb-8">
                    <div className="flex items-center justify-between mb-8 quizContainer__header">
                        <h4>کوییز های بیشتر</h4>
                        <Link to="/sort?s=newest" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><div>نتایج بیشتر</div></Link>
                    </div>

                    {skeletonQuiz(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={loadMoreQuiz_ref}>
                        {
                            loadMoreQuiz_inView &&
                            <QuizContainer quizzes={loadMoreQuiz} bgStyle='trans' />
                        }
                    </ul>

                </div>
            </div>

        </React.Fragment>
    );
}

export default Index;