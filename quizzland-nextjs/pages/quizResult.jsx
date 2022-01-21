import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
// import {InlineReactionButtons, InlineShareButtons} from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link'

import { log, replaceFunction, fadeIn, popUpShow, popUpHide } from '../components/base'
import BackBtn from '../components/backBtn'
import Layout from '../components/layout'
// import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
// import SkeletonLoading from '../components/skeletonLoading'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Result = () => {
    const [score, setScore] = useState(0)
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState(null)
    const [resultGif, setResultGif] = useState(null)
    const [loadState, setLoadState] = useState(null)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState(null)
    const [contentLoaded, setContentLoaded] = useState(false)
    const [questions, setQuestions] = useState(null)
    const [correctAnswersCounter, setCorrectAnswersCounter] = useState(null)
    const [quizResult, setQuizResult] = useState(null)

    useEffect(() => {
        async () => {
            document.querySelector('html').style=`background: None`
            setLoadState(true)
            setQuestions(JSON.parse(localStorage.getItem('resultQuestions')))
            setCorrectAnswersCounter(localStorage.getItem('resultCorrectAnswersCounter'))
            setQuizResult(JSON.parse(localStorage.getItem('quizResult')))
            
            if(JSON.parse(localStorage.getItem('quizResult')) === null) {
                window.location.href = "/404";
            }
        }
    }, [])

    useEffect(() => {
        detailOfResult()
        calculateTheResultScore()
        getSuggestionsQuiz()
    }, [score, quizResult])

    useEffect(() => {
        {
            suggestionQuizzes &&
            showPopUpSuggestion()
        }
    }, suggestionQuizzes)

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const calculateTheResultScore = () => {
        const questionsCounter = questions && questions.length
        if (questionsCounter && correctAnswersCounter) {
            const score = ((correctAnswersCounter / questionsCounter) * 100).toFixed(0)
            setScore(score)
        }
    }

    const detailOfResult = () => {
        if (score > 80){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`🤯 واااو، تو دیگه کی هستی ترکوندی`)
            setResultGif(quizResult && quizResult.GIF100)
        }
        else if (score > 60){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`😎 ایول\n! تو یک ${quizResult && quizResult.fan_name} واقعی هستی `)
            setResultGif(quizResult && quizResult.GIF80)
        }
        else if (score > 40){
            setResultScore(`🙂 ${score}%`)
            setResultSubtitle('عالیه، فقط یکم با یه فن بودن فاصله داری')
            setResultGif(quizResult && quizResult.GIF60)
        }
        else if (score > 20){
            setResultScore(`😉 ${score}%`)
            setResultSubtitle('بیشتر تلاش کن. میتونی انجامش بدی')
            setResultGif(quizResult && quizResult.GIF40)
        }
        else if (score >= 0){
            setResultScore(`😭 ${score}%`)
            setResultSubtitle('😅 میتونی سریع کوییز رو از اول بدی تا کسی نیومده\n😀 یا کوییز رو کلا عوض کنی بری بعدی')
            setResultGif(quizResult && quizResult.GIF20)
        }
        else {
            setResultScore(`👀`)
            setResultSubtitle('😰 خطا در محاسبه امتیاز\n.لطفا بعدا امتحان کنید و یا در غیر اینصورت به پشتیبانی اطلاع دهید')
        }
    }

    const tryAgainTheQuiz = () => {
        window.history.go(-1)
    }

    const getSuggestionsQuiz = () => {
        quizResult &&
        axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${replaceFunction(quizResult.subCategory, ' ', '+')}&limit=4`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
        setContentLoaded(true)
    }

    const showPopUpSuggestion = () => {
        setTimeout(() => {
            popUpShow(document.querySelector('.result__popUpQuizSuggester'))

            document.querySelector('body').style.overflow = 'hidden'
            document.querySelector('body').style.pointerEvents = 'none'
            // document.querySelector('body').style.overflow = 'none'
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

        document.querySelector('body').style.overflow = 'auto'
        document.querySelector('body').style.pointerEvents = 'all'
        document.querySelector('.header').style.filter = 'blur(0)'
        document.querySelector('.result__container').style.filter = 'blur(0)'
        document.querySelector('h2').style.filter = 'blur(0)'
        document.querySelector('.quizContainer').style.filter = 'blur(0)'
    }

    const chooseUniqueQuizToSuggest = () => {
        if (suggestionQuizzes[0].title === quizResult && quizResult.title) {
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

    return (
        <>
            <Layout>

                
                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>نتیجه کوییز | کوییزلند </title>
                    <meta name="description" content="نتیجه کوییز انجام شده" />
                    <meta name="keywords" content="کوییز, کوییزلند" />
                </Head>

                <div className="result__container">
                    <div className="result__title flex flex-jc-c">
                        <h5 className="tx-al-r">&quot نتیجه  &quot {quizResult && quizResult.title}</h5>
                    </div>
                    <div className="beforeAfterDecor flex flex-jc-c flex-ai-c">
                        <h1 className="result__subtitle tx-al-c">{resultSubtitle}</h1>
                    </div>
                    <div className="result wrapper-med space-sm flex flex-ai-c flex-jc-c">
                        <div className="result__img flex flex-jc-c flex-ai-c">
                            {
                                resultGif &&
                                <Image src={resultGif} width='320' height='320' alt={quizResult && quizResult.subCategory}/>
                            }
                        </div>
                        <div className="result__score">{resultScore}</div>
                        <div className="result__detail tx-al-r">
                            <h5>تعداد پاسخ های درست: <span className="result__detail__correctTime">{correctAnswersCounter}</span></h5>
                            <h5>تعداد پاسخ های غلط: <span className="result__detail__wrongTime">{questions && questions.length - correctAnswersCounter}</span></h5>
                        </div>
                    </div>

                    <div className='wrapper-med'>
                        <div className="result__share space-sm tx-al-c">
                            <h5>{`دوستات رو به چالش بکش  \n ببین در حد تو ${quizResult && quizResult.fan_name} هستن`}</h5>

                            {/* <InlineShareButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    color: 'social',      // set the color of buttons (social, white)
                                    enabled: true,        // show/hide buttons (true, false)
                                    font_size: 16,        // font size for the buttons
                                    labels: 'null',        // button labels (cta, counts, null)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    networks: [           // which networks to include (see SHARING NETWORKS)
                                        'whatsapp',
                                        'telegram',
                                        'twitter',
                                        'sharethis',
                                    ],
                                    padding: 10,          // padding within buttons (INTEGER)
                                    radius: 10,            // the corner radius on each button (INTEGER)
                                    show_total: false,
                                    size: 45,             // the size of each button (INTEGER)

                                    // OPTIONAL PARAMETERS
                                    url: `https://www.quizzland.net/quiz/${replaceFunction(quizResult && quizResult.title, ' ', '-')}`,
                                    image: quizResult && quizResult.thumbnail,  // (defaults to og:image or twitter:image)
                                    title: quizResult && quizResult.title,            // (defaults to og:title or twitter:title)
                                }}
                            /> */}

                        </div>

                        <h2 className='flex flex-jc-c flex-ai-c space-sm'>این کوییز چطور بود؟</h2>
                        
                        <div>
                            {/* <InlineReactionButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    enabled: true,        // show/hide buttons (true, false)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    min_count: 0,         // hide react counts less than min_count (INTEGER)
                                    padding: 12,          // padding within buttons (INTEGER)
                                    reactions: [          // which reactions to include (see REACTIONS)
                                        'slight_smile',
                                        'heart_eyes',
                                        'laughing',
                                        'astonished',
                                        'sob',
                                        'rage'
                                    ],
                                    size: 45,             // the size of each button (INTEGER)
                                    spacing: 8,           // the spacing between buttons (INTEGER)

                                // OPTIONAL PARAMETERS
                                url: `https://www.quizzland.net/quiz/${replaceFunction(quizResult && quizResult.title, ' ', '-')}`,
                                image: quizResult && quizResult.thumbnail,  // (defaults to og:image or twitter:image)
                                title: quizResult && quizResult.title,            // (defaults to og:title or twitter:title)
                                }}
                            /> */}
                        </div>
                        
                    </div>

                </div>

                <h2 className='tx-al-c space-med beforeAfterDecor'>کوییز های مشابه</h2>

                {/* {SkeletonLoading(contentLoaded)} */}

                <ul className="quizContainer flex wrapper-med">
                    {
                        suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                    }
                </ul>

                {
                    suggestionQuizzes &&
                    <div className='result__popUpQuizSuggester pos-fix popUp-hide'>
                        <button className='result__popUpQuizSuggester__closeBtn fadeOut pos-abs' onClick={() => {
                            closePopUpQuizSuggester();
                        }}> X </button>

                        <div>
                            <h3 className='result__popUpQuizSuggester__headline'>پیشنهاد برای کوییز بعدیت :</h3>
                            <Link href={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().title, ' ', '-')}`}>
                                <a>
                                    <h3 className="result__popUpQuizSuggester__title flex">
                                        {chooseUniqueQuizToSuggest().title}
                                    </h3>
                                </a>
                            </Link>
                        </div>
                        <Link href={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().title, ' ', '-')}`}>
                            <a>
                                <div className='result__popUpQuizSuggester__thumbnail'>
                                    <Image
                                        src={chooseUniqueQuizToSuggest().thumbnail}
                                        alt={`${chooseUniqueQuizToSuggest().subCategory} | ${chooseUniqueQuizToSuggest().title}`}
                                        blurDataURL={chooseUniqueQuizToSuggest().thumbnail}
                                        width='500'
                                        height='500'
                                        placeholder='blur'
                                    />
                                </div>
                            </a>
                        </Link>
                    </div>
                }

                <BackBtn />
                
                <button onClick={tryAgainTheQuiz} className='tryAgain btn tx-al-c' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره کوییز</button>
            
            </Layout>
        </>
    );
}
 
export default Result;