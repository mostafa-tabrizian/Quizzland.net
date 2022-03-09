import React, { useState, useEffect } from 'react'

import SkeletonLoading from './skeletonLoading'

import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer';
import Header from './header'

import { log, isItMobile, isItDesktop, isItIPad } from './base'
import QuizContainer from './quizContainer'
import QuizPointyContainer from './quizPointyContainer'
import LoadingScreen from './loadingScreen'

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
    
    const [loadInfinite1, setLoadInfinite1] = useState([])
    const [loadInfinite2, setLoadInfinite2] = useState([])
    const [loadInfinite3, setLoadInfinite3] = useState([])

    const [quiz_new_ref, quiz_new_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [pointy_new_ref, pointy_new_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [quiz_monthly_ref, quiz_monthly_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [pointy_monthly_ref, pointy_monthly_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [quiz_new_celebrity_ref, quiz_new_celebrity_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [quiz_new_movieSeries_ref, quiz_new_movieSeries_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [pointy_new_psychology_ref, pointy_new_psychology_inView] = useInView({threshold: 0, triggerOnce: true,});
    
    const [loadInfinite1_ref, loadInfinite1_inView] = useInView({threshold: 0, triggerOnce: true,})
    const [loadInfinite2_ref, loadInfinite2_inView] = useInView({threshold: 0, triggerOnce: true,})   
    const [loadInfinite3_ref, loadInfinite3_inView] = useInView({threshold: 0, triggerOnce: true,})
    
    useEffect(() => {
        landPagePathSelector()
        grabData()
        recommendationQuiz()
        setLoadState(true)
        if (document.getElementById('html')) {
            document.getElementById('html').style='background: linear-gradient(135deg, #000000, #390e10) fixed;'
        }
    }, [])

    const grabAndSortMostVisitedCategories = (interest) => {
        if (interest !== null) {
            let hightestVisitedCategory = [];

            for (let category in interest) {
                hightestVisitedCategory.push([category, interest[category]]);
            }
            
            hightestVisitedCategory.sort(function(a, b) {
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
    
            const search_top_1st_category = await axios.get(`/api/quiz_new/?subCategory__icontains=${top1stUserCategory}&limit=4`)
            Array.prototype.push.apply(matchedQuizzes, search_top_1st_category.data.results)
            
            const search_top_2nd_category = await axios.get(`/api/quiz_new/?subCategory__icontains=${top2ndUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_2nd_category.data.results)
            
            const search_top_3rd_category = await axios.get(`/api/quiz_new/?subCategory__icontains=${top3rdUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_3rd_category.data.results)
    
            const recommendedQuizzesList = () => {
                return (
                    matchedQuizzes.length >= 4 &&
                    <div className="mb-8 mt-[5rem]">
    
                        <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                            <h3 className=''>پیشنهادی های کوییزلند به شما</h3>
                        </div>
                        
                        <div>
                            <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">
                                <QuizContainer quizzes={matchedQuizzes} bgStyle='trans' />
                            </ul>
                        </div>
                    </div>
                )
            }
    
            setRecommendedQuizzes([])
            setRecommendedQuizzes(recommendedQuizzesList)
        } catch(e) {
            return log('No Recommending -- New User')
        }
    }

    const grabData = async () => {
        const quiz_new = await axios.get(`/api/quiz_new/?limit=8`)
        setQuiz_new(quiz_new.data.results)
        
        const quiz_monthly = await axios.get(`/api/quiz_monthly/?limit=8`)
        setQuiz_monthly(quiz_monthly.data.results)

        const pointy_new = await axios.get(`/api/pointy_new/?limit=8`)
        setPointy_new(pointy_new.data.results)
        
        const pointy_monthly = await axios.get(`/api/pointy_monthly/?limit=8`)
        setPointy_monthly(pointy_monthly.data.results)

        const pointy_new_psychology = await axios.get(`/api/pointy_new/?category__icontains=psychology&limit=8`)
        setPointy_new_psychology(pointy_new_psychology.data.results)

        const quiz_new_movieSeries = await axios.get(`/api/quiz_new/?category__icontains=movie-&-series&limit=8`)
        setQuiz_new_movieSeries(quiz_new_movieSeries.data.results)

        const quiz_new_celebrity = await axios.get(`/api/quiz_new/?category__icontains=celebrity&limit=8`)
        setQuiz_new_celebrity(quiz_new_celebrity.data.results)
        
        const loadInfinite1 =  await axios.get(`/api/quiz_new/?limit=8&offset=8`)
        setLoadInfinite1(loadInfinite1.data.results)
        const loadInfinite2 =  await axios.get(`/api/quiz_new/?limit=8&offset=24`)
        setLoadInfinite2(loadInfinite2.data.results)
        const loadInfinite3 =  await axios.get(`/api/quiz_new/?limit=8&offset=36`)
        setLoadInfinite3(loadInfinite3.data.results)

        setContentLoaded(true)
    }

    const landPagePathSelector = () => {
        if (isItDesktop()) {
            return {
                background: `url('/static/img/landPage-path.png')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom center',
                backgroundSize: 'cover'
            }
        }
        else {  // mobile or tablet path
            return {
                background: `url('/static/img/landPage-path-mobile.png')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'Bottom center',
                backgroundSize: 'cover'
            
            }
        }
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header linkType='Link'/>

            <Helmet>
                <title>کوییزلند | بهترین و جدیدترین کوییز، تست و تریویا ها</title>
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

            <div className={`hero flex justify-center flex-ai-c`}>
                    <div className="hero_path absolute right-0 top-[-12rem] md:top-[-16rem] h-[45rem] md:h-[60rem] w-[100%]"></div>

                    <div className='relative mr-5 ml-5 drop-shadow-[10px_15px_10px_black] hidden md:block'>
                        <div className='pointer-events-none'>
                            <img
                                src='/static/img/Q.png'
                                width={350}
                                height={500}
                                alt='لوگوی کوییزلند'
                            />
                        </div>
                        <div className='absolute top-0 left-0 pointer-events-none hero_bubbles'>
                            <img
                                src='/static/img/QBubbles.png'
                                width={350}
                                height={500}
                                alt='لوگوی کوییزلند'
                                className='max-w-[104%] w-[104%]'
                            />
                        </div>
                    </div>

                    <div className='hero__start text-right mr-6 mb-[50%] lg:mb-0 lg:mr-4'>
                        <h1 className='relative text-[4.5rem] mb-2'>
                            اینجا کوییزلندِ
                        </h1>
                        <h2 className='text-[1.6rem] max-w-[33rem]
                                        mb-20 ml-3 drop-shadow-[0_0_25px_black]'>
                            جایی که میتونی خودت رو به عنوان یه فن به بقیه ثابت کنی پس اگر آماده ای 😎 
                        </h2>
                        <button
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
                            
                        </button>
                    </div>
                </div>

                {recommendedQuizzes}

                <div className="mb-8 md:mt-[10rem]">
                    <span id='scroll' />

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>جدیدترین کوییز ها</h3>
                        <Link to="/sort?s=newest" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={quiz_new_ref}>
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

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>بهترین کوییز های این ماه</h3>
                        <Link to="/sort?s=monthly" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={quiz_monthly_ref}>
                        {
                            quiz_monthly_inView &&
                            <QuizContainer quizzes={quiz_monthly} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>جدیدترین تست ها</h3>
                        <Link to="/sort?s=newest_test" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={pointy_new_ref}>
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

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>بهترین تست های این ماه</h3>
                        <Link to="/sort?s=monthly_test" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={pointy_monthly_ref}>
                        {
                            pointy_monthly_inView &&
                            <QuizPointyContainer quizzes={pointy_monthly} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>کوییز سلبریتی</h3>
                        <Link to="/sort?s=newest&c=celebrity" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={quiz_new_celebrity_ref}>
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

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>کوییز فیلم و سریال</h3>
                        <Link to="/sort?s=newest&c=movie-&-series" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={quiz_new_movieSeries_ref}>
                        {
                            quiz_new_movieSeries_inView &&
                            <QuizContainer quizzes={quiz_new_movieSeries} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>تست روانشناسی</h3>
                        <Link to="/sort?s=newest&c=psychology" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={pointy_new_psychology_ref}>
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
                    <div className="grid grid-cols-2 mb-8 mr-4 quizContainer__header md:m-auto md:w-4/5 flex-ai-c md:container md:px-20">
                        <h3 className=''>کوییز های بیشتر</h3>
                        <Link to="/sort?s=newest" className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></Link>
                    </div>

                    {SkeletonLoading(contentLoaded)}
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={loadInfinite1_ref}>
                        {
                            loadInfinite1_inView &&
                            <QuizContainer quizzes={loadInfinite1} bgStyle='trans' />
                        }
                    </ul>
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={loadInfinite2_ref}>
                        {
                            loadInfinite2_inView &&
                            <QuizContainer quizzes={loadInfinite2} bgStyle='trans' />
                        }
                    </ul>
                    
                    <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right" ref={loadInfinite3_ref}>
                        {
                            loadInfinite3_inView &&
                            <QuizContainer quizzes={loadInfinite3} bgStyle='trans' />
                        }
                    </ul>
                    
                </div>

        </React.Fragment>
    );
}
 
export default Index;