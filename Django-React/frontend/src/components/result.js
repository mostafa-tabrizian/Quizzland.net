import React, { useEffect, useState, useRef } from 'react'

import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import {InlineReactionButtons, InlineShareButtons} from 'sharethis-reactjs';
import axiosInstance from './axiosApi'
import Header from './header'

import { log, replaceFunction, fadeIn, popUpShow, popUpHide } from './base'
import BackBtn from './backBtn'
import LoadingScreen from './loadingScreen'
import QuizContainer from './quizContainer'
import SkeletonLoading from './skeletonLoading'

const Result = () => {
    const [score, setScore] = useState(0)
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultGif, setResultGif] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [questions, setQuestions] = useState(null)
    const [correctAnswersCounter, setCorrectAnswersCounter] = useState(null)
    const [quizResult, setQuizResult] = useState(null)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('resultQuiz')) === null) {
            window.location.href = "/404";
        } else {
            document.querySelector('html').style=`background: None`
            setLoadState(true)
            setQuestions(JSON.parse(localStorage.getItem('resultQuestions')))
            setCorrectAnswersCounter(localStorage.getItem('resultCorrectAnswersCounter'))
            setQuizResult(JSON.parse(localStorage.getItem('resultQuiz')))
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
    }, [suggestionQuizzes])

    const calculateTheResultScore = () => {
        const questionsCounter = questions?.length
        if (questionsCounter && correctAnswersCounter) {
            const score = ((correctAnswersCounter / questionsCounter) * 100).toFixed(0)
            setScore(score)
        }
    }

    const detailOfResult = () => {
        if (score > 80){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`🤯 واااو، تو دیگه کی هستی ترکوندی`)
            setResultGif(quizResult?.GIF100)
        }
        else if (score > 60){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`😎 ایول\n! تو یک ${quizResult?.fan_name} واقعی هستی `)
            setResultGif(quizResult?.GIF80)
        }
        else if (score > 40){
            setResultScore(`🙂 ${score}%`)
            setResultSubtitle('عالیه، فقط یکم با یه فن بودن فاصله داری')
            setResultGif(quizResult?.GIF60)
        }
        else if (score > 20){
            setResultScore(`😉 ${score}%`)
            setResultSubtitle('بیشتر تلاش کن. میتونی انجامش بدی')
            setResultGif(quizResult?.GIF40)
        }
        else if (score >= 0){
            setResultScore(`😭 ${score}%`)
            setResultSubtitle('😅 میتونی سریع کوییز رو از اول بدی تا کسی نیومده\n😀 یا کوییز رو کلا عوض کنی بری بعدی')
            setResultGif(quizResult?.GIF20)
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
        axiosInstance.get(`/dbAPI/quiz_new/?subCategory__icontains=${quizResult && replaceFunction(quizResult.subCategory, ' ', '+')}&limit=4`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
        setContentLoaded(true)
    }

    const showPopUpSuggestion = () => {
        setTimeout(() => {
            popUpShow(document.querySelector('.result__popUpQuizSuggester'))

            document.querySelector('body').style.overflow = 'hidden'
            document.querySelector('#quizLand').style.pointerEvents = 'none'
            document.querySelector('#quizLand').style.overflow = 'none'
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
        document.querySelector('#quizLand').style.pointerEvents = 'all'
        document.querySelector('.header').style.filter = 'blur(0)'
        document.querySelector('.result__container').style.filter = 'blur(0)'
        document.querySelector('h2').style.filter = 'blur(0)'
        document.querySelector('.quizContainer').style.filter = 'blur(0)'
    }

    const chooseUniqueQuizToSuggest = () => {
        if (suggestionQuizzes[0]?.title === quizResult?.title) {
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
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <Header linkType='Hot'/>

            <Helmet>
                <title>نتیجه کوییز | کوییزلند </title>
                <meta name="description" content="نتیجه کوییز انجام شده" />
                <meta name="keywords" content="کوییز, کوییزلند" />
            </Helmet>

            <div className="result__container">
                    <div className="flex justify-center result__title">
                        <h5 className="text-right">نتیجه  {quizResult?.title}</h5>
                    </div>
                    <div className="flex justify-center beforeAfterDecor flex-ai-c">
                        <h1 className="text-center result__subtitle">{resultSubtitle}</h1>
                    </div>
                    <div className="justify-center block w-full mx-auto result md:container space-sm md:flex flex-ai-c">
                        <div className="flex justify-center result__img md:mx-16 flex-ai-c">
                            {<img src={resultGif} className='object-contain rounded-lg' width={540} alt={resultGif} />}
                        </div>
                        <div className="result__score mt-5 text-center text-[2rem]">
                            <h5>
                                {resultScore}
                            </h5>
                        </div>
                        <div className="mt-5 mb-16 text-lg text-center result__detail">
                            <h5>پاسخ 🟢: <span>{correctAnswersCounter}</span></h5>
                            <h5>پاسخ 🔴: <span>{questions?.length - correctAnswersCounter}</span></h5>
                        </div>
                    </div>

                    <div className='container px-20 mx-auto'>
                        <div className="text-lg text-center result__share space-sm">
                            <h5>{`دوستات رو به چالش بکش  \n ببین در حد تو ${quizResult?.fan_name} هستن`}</h5>

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
                                    url: `https://www.quizzland.net/quiz/${quizResult && replaceFunction(quizResult.title, ' ', '-')}`,
                                    image: quizResult?.thumbnail,  // (defaults to og:image or twitter:image)
                                    title: quizResult?.title,            // (defaults to og:title or twitter:title)
                                }}
                            /> */}

                        </div>

                        <h2 className='flex justify-center text-lg flex-ai-c space-sm'>این کوییز چطور بود؟</h2>
                        
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
                                url: `https://www.quizzland.net/quiz/${quizResult && replaceFunction(quizResult.title, ' ', '-')}`,
                                image: quizResult?.thumbnail,  // (defaults to og:image or twitter:image)
                                title: quizResult?.title,            // (defaults to og:title or twitter:title)
                                }}
                            /> */}
                        </div>
                        
                    </div>

                </div>

                <h2 className='text-lg text-center space-med beforeAfterDecor'>کوییز های مشابه</h2>

                {SkeletonLoading(contentLoaded)}

                <ul className="w-4/5 mx-auto first-letter:w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">
                    {
                        suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                    }
                </ul>

                {
                    suggestionQuizzes && chooseUniqueQuizToSuggest() && 
                    <div className='result__popUpQuizSuggester fixed popUp-hide bg-[#8b0000f2] p-8 w-11/12 md:w-[42rem] mx-8 grid grid-cols-1 rounded-lg pointer-events-auto'>
                        <button className='absolute text-3xl result__popUpQuizSuggester__closeBtn left-4 top-4' onClick={() => {
                            closePopUpQuizSuggester();
                        }}> X </button>

                        <div>
                            <h3 className='result__popUpQuizSuggester__headline text-lg text-[#ffb3b3]'>پیشنهاد برای کوییز بعدیت :</h3>

                            <a href={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().title, ' ', '-')}`}>
                                <h3 className="flex text-lg result__popUpQuizSuggester__title">
                                    {chooseUniqueQuizToSuggest().title}
                                </h3>
                            </a>
                        </div>
                        <a href={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().title, ' ', '-')}`}>
                            <div className='result__popUpQuizSuggester__thumbnail mt-5 overflow-hidden rounded-lg shadow-[0_0_10px_black] h-[11rem] md:h-[21rem]'>
                                <img
                                    src={chooseUniqueQuizToSuggest().thumbnail}
                                    alt={`${chooseUniqueQuizToSuggest().subCategory} | ${chooseUniqueQuizToSuggest().title}`}
                                    width={1920}
                                    height={1080}
                                    className='object-cover'
                                />
                            </div>
                        </a>
                    </div>
                }

            <BackBtn />
            
            <button onClick={tryAgainTheQuiz} className='tryAgain btn tx-al-c' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره کوییز</button>

        </React.Fragment>
    );
}
 
export default Result;