import React, { useEffect, useState, useRef } from 'react'
import { message, Rate } from 'antd';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { InlineReactionButtons, InlineShareButtons } from 'sharethis-reactjs';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

import axios from 'axios'
import Header from '../components/header'

import { log, replaceFunction, fadeIn, popUpShow, popUpHide, takeParameterFromUrl } from '../components/base'
import BackBtn from '../components/backBtn'
import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import SkeletonLoading from '../components/skeletonLoading';

const Result = () => {
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [questionCount, setQuestionCount] = useState(null)
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null)
    const [rateChangeable, setRateChangeable] = useState(true)
    const [resultGif, setResultGif] = useState()
    const [fanName, setFanName] = useState()
    const [title, setTitle] = useState()
    const [id, setId] = useState()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setQuestionCount(params.get('qc'))
        setCorrectAnswersCount(params.get('cc'))
        setFanName(params.get('fn'))
        setTitle(params.get('qt'))
        setId(params.get('id'))

        const resultGifIndexInUrl = (window.location.search).indexOf('rg=') + 3
        setResultGif((window.location.search).slice(resultGifIndexInUrl,))

        detailOfResult(params.get('s'), params.get('fn'))
        getSuggestionsQuiz(params.get('sc'))

        document.querySelector('html').style = `background: None`
        setLoadState(true)
    }, [])

    useEffect(() => {
        {
            suggestionQuizzes &&
                showPopUpSuggestion()
        }
    }, [suggestionQuizzes])

    const customIcons = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        4: <SmileOutlined />,
        5: <SmileOutlined />,
    };

    const detailOfResult = (score, fanName) => {
        if (score > 80) {
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`🤯 واااو، تو دیگه کی هستی ترکوندی`)
        }
        else if (score > 60) {
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`😎 ایول\n! تو یک ${fanName} واقعی هستی `)
        }
        else if (score > 40) {
            setResultScore(`🙂 ${score}%`)
            setResultSubtitle('عالیه، فقط یکم با یه فن بودن فاصله داری')
        }
        else if (score > 20) {
            setResultScore(`😉 ${score}%`)
            setResultSubtitle('بیشتر تلاش کن. میتونی انجامش بدی')
        }
        else if (score >= 0) {
            setResultScore(`😭 ${score}%`)
            setResultSubtitle('😅 میتونی سریع کوییز رو از اول بدی تا کسی نیومده\n😀 یا کوییز رو کلا عوض کنی بری بعدی')
        }
        else {
            setResultScore(`👀`)
            setResultSubtitle('😰 خطا در محاسبه امتیاز\n.لطفا بعدا امتحان کنید و یا در غیر اینصورت به پشتیبانی اطلاع دهید')
        }
    }

    const tryAgainTheQuiz = () => {
        window.history.go(-1)
    }

    const getSuggestionsQuiz = (subCategory) => {
        axios.get(`/api/quiz/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=4&public=true`)
            .then((res) => { setSuggestionQuizzes(res.data.results) })
        setContentLoaded(true)
    }

    const showPopUpSuggestion = () => {
        setTimeout(() => {
            popUpShow(document.querySelector('.result__popUpQuizSuggester'))

            document.querySelector('.result__popUpQuizSuggester').style.pointerEvents = 'all'
            document.querySelector('body').style.overflow = 'hidden'
            document.querySelector('#land').style.pointerEvents = 'none'
            document.querySelector('#land').style.overflow = 'none'
            document.querySelector('.header').style.filter = 'blur(7px)'
            document.querySelector('.result__container').style.filter = 'blur(7px)'
            document.querySelector('h2').style.filter = 'blur(7px)'
            document.querySelector('.quizContainer').style.filter = 'blur(7px)'

            setTimeout(() => {
                fadeIn(document.querySelector('.result__popUpQuizSuggester__closeBtn'))
            }, 2000)
        }, 10000)
    }

    const closePopUpQuizSuggester = () => {
        popUpHide(document.querySelector('.result__popUpQuizSuggester'))

        document.querySelector('.result__popUpQuizSuggester').style.pointerEvents = 'none'
        document.querySelector('body').style.overflow = 'auto'
        document.querySelector('#land').style.pointerEvents = 'all'
        document.querySelector('.header').style.filter = 'blur(0)'
        document.querySelector('.result__container').style.filter = 'blur(0)'
        document.querySelector('h2').style.filter = 'blur(0)'
        document.querySelector('.quizContainer').style.filter = 'blur(0)'
    }

    const chooseUniqueQuizToSuggest = () => {
        if (suggestionQuizzes[0]?.title === title) {
            if (suggestionQuizzes[1]) {
                return suggestionQuizzes[1]
            }
            else {  // there is no unique quiz, don't show the pop up
                setSuggestionQuizzes(false)
                return suggestionQuizzes[0]
            }
        }
        else {
            return suggestionQuizzes[0]
        }
    }

    const pushRate = async (value) => {
        setRateChangeable(false)

        const adminDetail = {
            username: process.env.ADMINUSERNAME,
            password: process.env.ADMINPASSWORD,
        }

        let authToken

        await axios.post('/api/token/obtain/', adminDetail)
            .then((req) => {
                authToken = req.data.access
            })

        const now = new Date().getTime()

        let lastRate
        let RateCount

        await axios.get(`/api/quiz/${id}/?&timestamp=${now}&public=true`)
            .then((req) => {
                lastRate = req.data.rate
                RateCount = req.data.rate_count
            })

        const view = {
            rate: lastRate == 0 ? 5 : (lastRate + value) / 2,
            rate_count: RateCount + 1
        }

        const headers = {
            'Authorization': "JWT " + authToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }

        await axios.put(`/api/quiz/${id}/`, view, { headers })
            .then(res => {
                res.status == 200 &&
                    message.success('از نظر شما بسیار سپاس گذاریم')
            })
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>نتیجه کوییز | کوییزلند </title>
                <meta name="description" content="نتیجه کوییز انجام شده" />
                <meta name="keywords" content="کوییز, کوییزلند" />
            </Helmet>

            <div className="result__container relative">
                <div className="flex justify-center result__title">
                    <h5 className="text-right">نتیجه  {title}</h5>
                </div>
                <div className="flex justify-center beforeAfterDecor items-center">
                    <h1 className="text-center result__subtitle">{resultSubtitle}</h1>
                </div>
                <div className="justify-center block w-full mx-auto result md:container space-sm md:flex items-center">
                    <div className="flex justify-center result__img md:mx-16 items-center">
                        {<img src={resultGif} className='object-contain rounded-lg' width={540} alt={resultGif} />}
                    </div>
                    <div className="result__score mt-5 text-center text-[2rem]">
                        <h5>
                            {resultScore}
                        </h5>
                    </div>
                    <div className="mt-5 mb-14 text-[1.5rem] text-center result__detail">
                        <h5>پاسخ 🟢: <span>{correctAnswersCount}</span></h5>
                        <h5>پاسخ 🔴: <span>{questionCount - correctAnswersCount}</span></h5>
                    </div>
                </div>

                <div className='container px-20 mx-auto'>
                    <div className="text-lg text-center mb-4 space-sm">
                        <h5>{`دوستات رو به چالش بکش  \n ببین در حد تو ${fanName} هستن`}</h5>

                        <InlineShareButtons
                            config={{
                                alignment: 'center',
                                color: 'social',
                                enabled: true,
                                font_size: 16,
                                labels: 'null',
                                language: 'en',
                                networks: [
                                    'whatsapp',
                                    'telegram',
                                    'twitter',
                                    'sharethis',
                                ],
                                padding: 10,
                                radius: 10,
                                show_total: false,
                                size: 45,


                                url: window.location.href,
                                // image: quizResult?.thumbnail,
                                title: quizTitle,
                            }}
                        />

                    </div>

                    <h2 className='flex justify-center text-lg items-center space-sm'>این کوییز چطور بود؟</h2>

                    <Rate
                        character={({ index }) => customIcons[index + 1]}
                        allowClear={true}
                        disabled={rateChangeable ? false : true}
                        className='flex justify-center my-3 biggerRate'
                        onChange={value => {
                            const currentQuiz = takeParameterFromUrl('qt')
                            const lastRatedQuiz = localStorage.getItem('lastRatedQuiz')

                            // check if rated before (last time)
                            if (lastRatedQuiz == currentQuiz) {
                                message.warning('! شما قبلا به این کوییز امتیاز داده اید')
                            } else {
                                localStorage.setItem('lastRatedQuiz', currentQuiz)
                                pushRate(value)
                            }
                        }}
                    />

                </div>

            </div>

            <h2 className='text-lg text-center space-med beforeAfterDecor'>کوییز های مشابه</h2>

            {SkeletonLoading(contentLoaded)}

            <ul className="md:w-4/5 m-auto mt-5 flex flex-wrap align-baseline justify-center">
                {
                    suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                }
            </ul>

            {
                suggestionQuizzes && chooseUniqueQuizToSuggest() &&
                <div className='result__popUpQuizSuggester fixed popUp-hide bg-[#8b0000f2] p-8 w-11/12 md:w-[42rem] mx-8 grid grid-cols-1 rounded-lg pointer-events-none'>
                    <button className='absolute text-3xl result__popUpQuizSuggester__closeBtn left-4 top-4' onClick={() => {
                        closePopUpQuizSuggester();
                    }}> X </button>

                    <div>
                        <h3 className='result__popUpQuizSuggester__headline text-lg text-[#ffb3b3]'>پیشنهاد برای کوییز بعدیت :</h3>

                        <Link to={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().slug, ' ', '-')}`}>
                            <h3 className="flex text-lg result__popUpQuizSuggester__title">
                                {chooseUniqueQuizToSuggest().title}
                            </h3>
                        </Link>
                    </div>
                    <Link to={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().slug, ' ', '-')}`}>
                        <div className='result__popUpQuizSuggester__thumbnail mt-5 overflow-hidden rounded-lg shadow-[0_0_10px_black] h-[11rem] md:h-[21rem]'>
                            <img
                                src={chooseUniqueQuizToSuggest().thumbnail}
                                alt={`${chooseUniqueQuizToSuggest().subCategory} | ${chooseUniqueQuizToSuggest().title}`}
                                width={1920}
                                height={1080}
                                className='object-cover'
                            />
                        </div>
                    </Link>
                </div>
            }

            <BackBtn />

            <button onClick={tryAgainTheQuiz} className='tryAgain btn text-center px-2 py-1 rounded-lg' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره کوییز</button>

        </React.Fragment>
    );
}

export default Result;