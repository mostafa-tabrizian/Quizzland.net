import React, { useState, useEffect } from 'react'

import SkeletonLoading from '../components/skeletonLoading';

import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer';
import { Carousel } from 'antd';

import Header from '../components/header'
import { log, replaceFunction, isItMobile, isItDesktop } from '../components/base'
import QuizContainer from '../components/quizContainer'
import QuizPointyContainer from '../components/quizPointyContainer'
import LoadingScreen from '../components/loadingScreen'


const Index = () => {
    const [recommendedQuizzes, setRecommendedQuizzes] = useState([])

    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    const [quiz_new_celebrity, setQuiz_new_celebrity] = useState([])
    const [quiz_new_movieSeries, setQuiz_new_movieSeries] = useState([])
    const [quiz_new, setQuiz_new] = useState([])
    const [quiz_monthly, setQuiz_monthly] = useState([])

    const [pointy_new_psychology, setPointy_new_psychology] = useState([])
    const [pointy_new, setPointy_new] = useState([])
    const [pointy_monthly, setPointy_monthly] = useState([])

    const [loadMoreQuiz, setLoadMoreQuiz] = useState([])

    const [quiz_new_ref, quiz_new_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [pointy_new_ref, pointy_new_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [quiz_monthly_ref, quiz_monthly_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [pointy_monthly_ref, pointy_monthly_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [quiz_new_celebrity_ref, quiz_new_celebrity_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [quiz_new_movieSeries_ref, quiz_new_movieSeries_inView] = useInView({ threshold: 0, triggerOnce: true, });
    const [pointy_new_psychology_ref, pointy_new_psychology_inView] = useInView({ threshold: 0, triggerOnce: true, });

    const [loadMoreQuiz_ref, loadMoreQuiz_inView] = useInView({ threshold: 0, triggerOnce: true, })

    useEffect(() => {
        grabData()
        recommendationQuiz()
        setLoadState(true)
        if (document.getElementById('html')) {
            document.getElementById('html').style = 'background: #121212'
        }
    }, [])

    const grabAndSortMostVisitedCategories = (interest) => {
        if (interest !== null) {
            let hightestVisitedCategory = [];

            for (let category in interest) {
                hightestVisitedCategory.push([category, interest[category]]);
            }

            hightestVisitedCategory.sort(function (a, b) {
                return b[1] - a[1];
            });

            return hightestVisitedCategory
        }
    }

    const recommendationQuiz = async () => {
        try {
            const interest = JSON.parse(localStorage.getItem('interest'))['categoryWatchedCounter']
            const hightestVisitedCategory = grabAndSortMostVisitedCategories(interest)
            const top1stUserCategory = hightestVisitedCategory[0][0]
            const top2ndUserCategory = hightestVisitedCategory[1][0]
            const top3rdUserCategory = hightestVisitedCategory[2][0]

            let matchedQuizzes = []

            const search_top_1st_category = await axios.get(`/api/quiz_new/?subCategory__icontains=${top1stUserCategory}&limit=4&public=true`)
            Array.prototype.push.apply(matchedQuizzes, search_top_1st_category.data.results)

            const search_top_2nd_category = await axios.get(`/api/quiz_new/?subCategory__icontains=${top2ndUserCategory}&limit=2&public=true`)
            Array.prototype.push.apply(matchedQuizzes, search_top_2nd_category.data.results)

            const search_top_3rd_category = await axios.get(`/api/quiz_new/?subCategory__icontains=${top3rdUserCategory}&limit=2&public=true`)
            Array.prototype.push.apply(matchedQuizzes, search_top_3rd_category.data.results)

            const recommendedQuizzesList = () => {
                return (
                    matchedQuizzes.length >= 4 &&
                    <div className="mb-8 mt-[5rem]">

                        <div className="mb-8 quizContainer__header">
                            <h2 className=''>پیشنهادی های کوییزلند به شما</h2>
                        </div>

                        <div>
                            <ul className="flex flex-wrap align-baseline">
                                <QuizContainer quizzes={matchedQuizzes} bgStyle='trans' />
                            </ul>
                        </div>
                    </div>
                )
            }

            setRecommendedQuizzes([])
            setRecommendedQuizzes(recommendedQuizzesList)
        } catch (e) {
            return log('No Recommending -- New User')
        }
    }

    const grabData = async () => {
        const quiz_new = await axios.get(`/api/quiz_new/?limit=8&public=true`)
        setQuiz_new(quiz_new.data.results)

        const quiz_monthly = await axios.get(`/api/quiz_monthly/?limit=8&public=true`)
        setQuiz_monthly(quiz_monthly.data.results)

        const pointy_new = await axios.get(`/api/pointy_new/?limit=8&public=true`)
        setPointy_new(pointy_new.data.results)

        const pointy_monthly = await axios.get(`/api/pointy_monthly/?limit=8&public=true`)
        setPointy_monthly(pointy_monthly.data.results)

        const pointy_new_psychology = await axios.get(`/api/pointy_new/?categoryKey=3&limit=8&public=true`)
        setPointy_new_psychology(pointy_new_psychology.data.results)

        const quiz_new_movieSeries = await axios.get(`/api/quiz_new/?categoryKey=1&limit=8&public=true`)
        setQuiz_new_movieSeries(quiz_new_movieSeries.data.results)

        const quiz_new_celebrity = await axios.get(`/api/quiz_new/?categoryKey=2&limit=8&public=true`)
        setQuiz_new_celebrity(quiz_new_celebrity.data.results)

        const loadMoreQuiz = await axios.get(`/api/quiz_new/?limit=36&offset=8&public=true`)
        setLoadMoreQuiz(loadMoreQuiz.data.results)

        setContentLoaded(true)
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

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

            <div className='md:w-4/5 m-auto'>

                <div className={`hero hidden md:flex justify-center items-center bg-gradient-to-t from-[#3d191a] via-transparent p-3 rounded-lg m-auto`}>
                    {/* <div className="hero_path absolute right-0 top-[-12rem] md:top-[-16rem] h-[45rem] md:h-[60rem] w-[100%]"></div> */}

                    <div className='relative mr-5 mb-[-3rem] drop-shadow-[10px_15px_10px_black] hidden md:block'>
                        <div className='pointer-events-none'>
                            <img
                                src='/static/img/Q.png'
                                width={175}
                                height={252}
                                alt='لوگوی کوییزلند'
                            />
                        </div>
                    </div>

                    <div className='hero__start text-right mr-9 mb-[50%] lg:mb-0 lg:mr-4'>
                        <h1 className='relative text-[3rem] mb-2'>
                            اینجا <span className='bloodRiver'>کوییزلندِ</span>
                        </h1>
                        <h2 className='text-[1.3rem] max-w-[26rem] drop-shadow-[0_0_25px_black]'>
                            جایی که میتونی خودت رو به عنوان یه فن به بقیه ثابت کنی پس اگر آماده ای بزن بریم 😎
                        </h2>

                        <div className='relative'>
                            <input
                                type='text'
                                className='pl-4 pr-12 py-1 rounded-full text-right bg-black shadow-black text-base mt-5 mb-5'
                                placeholder={`کوییزت رو سریع تر پیدا کن`}
                                onKeyPress={e => {if (e.key == 'Enter') { window.open(`/search?q=${e.target.value}`, '_blank') }}}
                            />
                            <svg className='w-5 h-5 absolute top-[1.7rem] right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                                <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
                                <path data-name="layer1" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round"/>
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
                <div className='hidden md:flex mt-20 justify-center w-full space-x-10'>
                    <div className='w-7/12 mr-5 relative'>
                        <div className='absolute left-0 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline'>
                            <h2 className='text-[1rem]'>
                                کوییزلند 🔥
                            </h2>
                            <h2>
                                #1
                            </h2>
                        </div>
                        <Link to={`/quiz/${quiz_monthly[0] && replaceFunction(quiz_monthly[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={quiz_monthly[0]?.thumbnail} alt="" />
                        </Link>
                        <div className='absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1'>
                            <h4>
                                {quiz_monthly[0] && quiz_monthly[0].title}
                            </h4>
                        </div>
                    </div>
                    <div className='w-5/12 relative'>
                        <div className='absolute left-0 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline'>
                            <h4 className='translate-y-[4px]'>
                                🕚
                            </h4>
                            <h2 className='text-[1rem]'>
                                جدیدترینِ کوییزلند
                            </h2>
                        </div>
                        <Link to={`/quiz/${quiz_new[0] && replaceFunction(quiz_new[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={quiz_new[0]?.thumbnail} alt="" />
                        </Link>
                        <div className='absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1'>
                            <h4>
                                {quiz_new[0] && quiz_new[0].title}
                            </h4>
                        </div>
                    </div>
                </div>

                <Carousel autoplay dotPosition='top' className='md:hidden block mb-20'>
                    <div className='w-7/12 mr-5 relative'>
                        <div className='absolute left-0 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline'>
                            <h2 className='text-[1rem]'>
                                کوییزلند 🔥
                            </h2>
                            <h2>
                                #1
                            </h2>
                        </div>
                        <Link to={`/quiz/${quiz_monthly[0] && replaceFunction(quiz_monthly[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={quiz_monthly[0]?.thumbnail} alt="" />
                        </Link>
                        <div className='absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1'>
                            <h4>
                                {quiz_monthly[0] && quiz_monthly[0].title}
                            </h4>
                        </div>
                    </div>
                    <div className='w-5/12 relative'>
                        <div className='absolute left-0 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline'>
                            <h4 className='translate-y-[4px]'>
                                🕚
                            </h4>
                            <h2 className='text-[1rem]'>
                                جدیدترینِ کوییزلند
                            </h2>
                        </div>
                        <Link to={`/quiz/${quiz_new[0] && replaceFunction(quiz_new[0].slug, ' ', '-')}`}>
                            <img className='w-full h-[21rem] object-cover rounded-xl' src={quiz_new[0]?.thumbnail} alt="" />
                        </Link>
                        <div className='absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1'>
                            <h4>
                                {quiz_new[0] && quiz_new[0].title}
                            </h4>
                        </div>
                    </div>
                </Carousel>

                {recommendedQuizzes}

                <div className="mb-8 md:mt-[10rem]"> 
                    <span id='scroll' />

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>جدیدترین کوییز ها</h2>
                        <Link to="/sort?s=newest" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={quiz_new_ref}>
                        {
                            quiz_new_inView &&
                            <QuizContainer quizzes={quiz_new} bgStyle={'trans'} />
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

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>بهترین کوییز های این ماه</h2>
                        <Link to="/sort?s=monthly" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={quiz_monthly_ref}>
                        {
                            quiz_monthly_inView &&
                            <QuizContainer quizzes={quiz_monthly} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>جدیدترین تست ها</h2>
                        <Link to="/sort?s=newest_test" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={pointy_new_ref}>
                        {
                            pointy_new_inView &&
                            <QuizPointyContainer quizzes={pointy_new} bgStyle='trans' />
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

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>بهترین تست های این ماه</h2>
                        <Link to="/sort?s=monthly_test" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={pointy_monthly_ref}>
                        {
                            pointy_monthly_inView &&
                            <QuizPointyContainer quizzes={pointy_monthly} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>کوییز سلبریتی</h2>
                        <Link to="/sort?s=newest&c=celebrity" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={quiz_new_celebrity_ref}>
                        {
                            quiz_new_celebrity_inView &&
                            <QuizContainer quizzes={quiz_new_celebrity} bgStyle='trans' />
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

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>کوییز فیلم و سریال</h2>
                        <Link to="/sort?s=newest&c=movie-&-series" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={quiz_new_movieSeries_ref}>
                        {
                            quiz_new_movieSeries_inView &&
                            <QuizContainer quizzes={quiz_new_movieSeries} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>تست روانشناسی</h2>
                        <Link to="/sort?s=newest&c=psychology" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="flex flex-wrap align-baseline" ref={pointy_new_psychology_ref}>
                        {
                            pointy_new_psychology_inView &&
                            <QuizPointyContainer quizzes={pointy_new_psychology} bgStyle='trans' />
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
                    <div className="flex justify-between mb-8 quizContainer__header items-center">
                        <h2>کوییز های بیشتر</h2>
                        <Link to="/sort?s=newest" className="text-[1rem] text-left px-3 py-1 rounded-lg border-2 border-red-900"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

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