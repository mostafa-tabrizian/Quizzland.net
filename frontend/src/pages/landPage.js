import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from '@mui/material/Skeleton';

import axios from '../components/axiosApi';
import { log, keyPressedOnInput, replaceFunction, isItMobile, sortByNewest, sortByMonthlyViews } from '../components/base'
const TestContainer = React.lazy(() => import('../components/testContainer')) 
const QuizContainer = React.lazy(() => import('../components/quizContainer')) 
const LoadingScreen = React.lazy(() => import('../components/loadingScreen')) 

// const Suggestions = React.lazy(() => import('../components/suggestions')) 

const Index = () => {
    const [loadState, setLoadState] = useState()

    const [tests, setTests] = useState([])
    const [tests_monthly, setTests_monthly] = useState([])
    const [quizzesData , setQuizzesData] = useState([])
    const [quizzesShow , setQuizzesShow] = useState([])
    // const [quizTrends, setTrendsQuiz] = useState([])

    // const [tests_celebrity, setTests_celebrity] = useState([])
    // const [tests_movieSeries, setTests_movieSeries] = useState([])
    // const [tests_psychology, setTests_psychology] = useState([])

    // const [loadMoreQuiz, setLoadMoreQuiz] = useState([])

    // const [content_monthly_ref, content_monthly_inView] = useInView({ threshold: 0, triggerOnce: true, });

    // const [tests_celebrity_ref, tests_celebrity_inView] = useInView({ threshold: 0, triggerOnce: true, });
    // const [tests_movieSeries_ref, tests_movieSeries_inView] = useInView({ threshold: 0, triggerOnce: true, });
    // const [tests_psychology_ref, tests_psychology_inView] = useInView({ threshold: 0, triggerOnce: true, });

    // const [loadMoreQuiz_ref, loadMoreQuiz_inView] = useInView({ threshold: 0, triggerOnce: true, })

    useEffect(() => {
        grabData()
        setLoadState(true)
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [])

    const grabData = async () => {
        const now = new Date().getTime()

        // const quiz = await axios.get(`/api/quizView/?limit=70&public=true&timestamp=${now}`)
        // .catch(err => {log(err.response)})
        
        await axios.get(`/api/testView/?limit=70&public=true&timestamp=${now}`)
            .then(res => {
                const data = res.data.results
                setTests(data.sort(sortByNewest).slice(0, 12))
                setTests_monthly(data.sort(sortByMonthlyViews).slice(0, 12))
            })
        
        await axios.get(`/api/quizV2View/?public=true`)
            .then((res => {
                const data = res.data.sort(sortByMonthlyViews)
                setQuizzesData(data)
                setQuizzesShow(data)
                // setTrendsQuiz(data.sort(sortByMonthlyViews))
            }))
            
        // .catch(err => {log(err.response)})
        // const content = quiz.data.results.concat(test.data.results)

        // setTests_movieSeries(content.filter(quiz => quiz.categoryKey.title_english == 'Movie & Series').sort(sortByNewest).slice(0, 12))
        // setTests_celebrity(content.filter(quiz => quiz.categoryKey.title_english == 'Celebrity').sort(sortByNewest).slice(0, 12))
        // setTests_psychology(content.filter(quiz => quiz.categoryKey.title_english == 'Psychology').sort(sortByNewest).slice(0, 12))
        // setLoadMoreQuiz(content.sort(sortByNewest).slice(13, 69))
    }

    const quizzes = (e) => {
        const value = e.target.value
        let filteredData = []
        
        if (value.toLowerCase().trim().length) {
            const filteredDataByTitle = quizzesData.filter(a => a.title.toLowerCase().includes(value.toLowerCase()))
            const filteredDataBySlug = quizzesData.filter(a => a.slug.toLowerCase().includes(value.toLowerCase()))
            filteredData = filteredDataByTitle.concat(filteredDataBySlug)
        }
        
        if (filteredData.length) {
            setQuizzesShow([])
            setTimeout(() => {
                setQuizzesShow(filteredData.slice(0, 10))
            }, 300)
        } else {
            setQuizzesShow([])
            setTimeout(() => {
                setQuizzesShow(quizzesData.slice(0, 10))
            }, 300)
        }
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


            <div className="relative z-0 mr-4 md:m-auto md:w-4/5 md:bg-[url('/static/img/bubbles.webp')] bg-no-repeat bg-top ">
                <div className={`hero mt-20 hidden md:flex  justify-center items-center bg-gradient-to-t backdrop-blur-md from-[#8b181f] via-transparent p-3 rounded-lg`}>

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
                                className={`pl-4 pr-12 py-1 rounded-full text-right bg-[#060101] text-[0.9rem] w-[20rem] mt-5 mb-5`}
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
                    <div className='w-7/12'>
                        <Carousel
                            autoPlay={true}
                            interval={3000}
                            transitionTime={500}
                            showStatus={false}
                            dynamicHeight={true}
                            showIndicators={false}
                        >
                            {/* <div className='flex'> */}
                                {/* <div className='relative ml-5'>
                                    <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                        <h2 className='text-[1rem]'>
                                            کوییز 🔥
                                        </h2>
                                        <h2>
                                            #2
                                        </h2>
                                    </div>
                                    <Link to={`/play/${quizTrends[1]?.slug && replaceFunction(quizTrends[1]?.slug, ' ', '-')}`}>
                                        <LazyLoadImage
                                            src={quizTrends[1]?.thumbnail}
                                            alt={`${quizTrends[1]?.title}`}
                                            className='w-[21rem] h-[21rem] object-cover rounded-xl'
                                            effect="blur"
                                            placeholder={<Skeleton variant="rounded" animation="wave" width={210} height={120} />}
                                        />
                                    </Link>
                                    <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                        <h2>
                                            {quizTrends[1]?.title}
                                        </h2>
                                    </div>
                                </div>
                                <div className='relative ml-5'>
                                    <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                        <h2 className='text-[1rem]'>
                                            کوییز 🔥🔥
                                        </h2>
                                        <h2>
                                            #1
                                        </h2>
                                    </div>
                                    <Link to={`/play/${quizTrends[0]?.slug && replaceFunction(quizTrends[0]?.slug, ' ', '-')}`}>
                                        <LazyLoadImage
                                            src={quizTrends[0]?.thumbnail}
                                            alt={`${quizTrends[0]?.title}`}
                                            className='w-[21rem] h-[21rem] object-cover rounded-xl'
                                            effect="blur"
                                            placeholder={<Skeleton variant="rounded" animation="wave" width={210} height={120} />}
                                        />
                                    </Link>
                                    <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                        <h2>P
                                            {quizTrends[0]?.title}
                                        </h2>
                                    </div>
                                </div>
                            </div> */}
                            <div className='relative ml-6'>
                                <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                    <h2 className='text-[1rem]'>
                                        تست 🔥
                                    </h2>
                                    <h2>
                                        #1
                                    </h2>
                                </div>
                                <Link to={`/test/${tests_monthly[0] && replaceFunction(tests_monthly[0].slug, ' ', '-')}`}>
                                    <LazyLoadImage
                                        src={tests_monthly[0]?.thumbnail}
                                        alt={`${tests_monthly.subCategory} | ${tests_monthly.title}`}
                                        className='w-[21rem] h-[21rem] object-cover rounded-xl'
                                        effect="blur"
                                        placeholder={<Skeleton variant="rounded" animation="wave" width={210} height={120} />}
                                    />
                                </Link>
                                <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                    <h2>
                                        {tests_monthly[0] && tests_monthly[0].title}
                                    </h2>
                                </div>
                            </div>
                        </Carousel>
                    </div>

                    <div className='relative'>
                        <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                            <h2 className='translate-y-[4px]'>
                                🕚
                            </h2>
                            <h2 className='text-[1rem]'>
                                جدیدترین تست
                            </h2>
                        </div>
                        <Link to={`/${tests[0]?.type}/${tests[0] && replaceFunction(tests[0].slug, ' ', '-')}`}>
                            <LazyLoadImage
                                src={tests[0]?.thumbnail}
                                alt={`${tests_monthly.subCategory} | ${tests_monthly.title}`}
                                className='w-full h-[21rem] object-cover rounded-xl'
                                effect="blur"
                                placeholder={<Skeleton variant="rounded" animation="wave" width={210} height={120} />}
                            />
                        </Link>
                        <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                            <h2>
                                {tests[0] && tests[0].title}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className='md:hidden'>
                    <Carousel
                        autoPlay={true}
                        interval={3000}
                        transitionTime={500}
                        showStatus={false}
                        dynamicHeight={true}
                        showIndicators={false}
                    >
                        <Link to={`/test/${tests[0] && replaceFunction(tests[0].slug, ' ', '-')}`}>
                            <div className='relative'>
                                <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                <h4 className='translate-y-[4px]'>
                                    🕚
                                </h4>
                                <h2 className='text-[1rem]'>
                                    جدیدترین تست
                                </h2>
                            </div>

                            <img className='w-full h-[21rem] object-cover rounded-xl' src={tests[0]?.thumbnail} alt="" />
                            
                                <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                    <h4>
                                        {tests[0] && tests[0].title}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                        <Link to={`/test/${tests_monthly[0] && replaceFunction(tests_monthly[0].slug, ' ', '-')}`}>
                            <div className='relative'>
                                <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                    <h2 className='text-[1rem]'>
                                        تست 🔥
                                    </h2>
                                    <h2>
                                        #1
                                    </h2>
                                </div>

                                <img className='w-full h-[21rem] object-cover rounded-xl' src={tests_monthly[0]?.thumbnail} alt="" />

                                <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                    <h4>
                                        {tests_monthly[0] && tests_monthly[0].title}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                        {/* <Link to={`/play/${quizTrends[0]?.slug && replaceFunction(quizTrends[0].slug, ' ', '-')}`}>
                            <div className='relative'>
                                <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                    <h2 className='text-[1rem]'>
                                        کوییز 🔥🔥
                                    </h2>
                                    <h2>
                                        #1
                                    </h2>
                                </div>

                                <img className='w-full h-[21rem] object-cover rounded-xl' src={quizTrends[0]?.thumbnail} alt="" />

                                <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                    <h4>
                                        {quizTrends[0]?.title}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                        <Link to={`/play/${quizTrends[1]?.slug && replaceFunction(quizTrends[1].slug, ' ', '-')}`}>
                            <div className='relative'>
                                <div className={`absolute left-0 z-10 top-0 m-3 rounded-xl bg-[#060102] px-4 py-1 flex space-x-3 items-baseline`}>
                                    <h2 className='text-[1rem]'>
                                        کوییز 🔥
                                    </h2>
                                    <h2>
                                        #2
                                    </h2>
                                </div>

                                <img className='w-full h-[21rem] object-cover rounded-xl' src={quizTrends[1]?.thumbnail} alt="" />

                                <div className={`absolute bottom-0 text-[1rem] right-0 m-3 bg-[#060102] rounded-xl px-4 py-1`}>
                                    <h4>
                                        {quizTrends[1]?.title}
                                    </h4>
                                </div>
                            </div>
                        </Link> */}
                    </Carousel>
                </div>

                {/* <Suggestions /> */}

                <div className="space-y-8">
                    <div className="flex items-center justify-between testContainer__header">
                        <h3>کوییز های کوییزلند</h3>
                        <Link to="/contents?s=newest&c=quiz" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><h4>مشاهده همه</h4></Link>
                    </div>

                    <div className='relative'>
                        <input type="text" onChange={(e) => quizzes(e)} placeholder='جستجوی کوییز ها...' className='pl-12 pr-12 py-1 bg-transparent text-[0.9rem] border border-red-900 rounded-lg focus:outline-none' />
                        <svg className='absolute w-5 h-5 top-[0.4rem] right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                            <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#681e1e" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
                            <path data-name="layer1" fill="none" stroke="#681e1e" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round" />
                        </svg>
                    </div>

                    <ul className="flex flex-wrap align-baseline">
                        <QuizContainer quizzes={quizzesShow} bgStyle={'trans'} />
                    </ul>
                </div>

                <div className="mb-8 md:mt-[10rem]">
                    <span id='scroll' />

                    <div className="flex items-center justify-between mb-8 testContainer__header">
                        <h3>تست های کوییزلند</h3>
                        <Link to="/contents?s=newest&c=test" className="px-3 py-1 text-left border-2 border-red-900 rounded-lg"><h4>مشاهده همه</h4></Link>
                    </div>

                    <ul className="flex flex-col flex-wrap align-baseline md:flex-row">
                        <TestContainer tests={tests} bgStyle={'trans'} />
                    </ul>

                </div>

            </div>

        </React.Fragment>
    );
}

export default Index;