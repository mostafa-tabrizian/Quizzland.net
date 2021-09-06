import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Helmet } from "react-helmet";
import {InlineReactionButtons} from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, fadeIn, popUpShow, popUpHide } from './base'
import BackBtn from './backBtn'
import LoadingScreen from './loadingScreen'
import Header from './hotHeader'
import QuizContainer from './quizContainer'

const Result = (props) => {
    const [state, setState] = useState(props.location.state)
    const [score, setScore] = useState(0)
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultGif, setResultGif] = useState()
    const [clipboard, setClipboard] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()

    useEffect(async () => {
        calculateTheResultScore()
        setLoadState(true)
        getSuggestionsQuiz()
        showPopUpSuggestion()

        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
    }, [])

    useEffect(() => {
        detailOfResult()
    }, [score])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 1000, maxRPS: 2 })

    const questions = JSON.parse(localStorage.getItem('resultQuestions'))
    const correctAnswersCounter = localStorage.getItem('resultCorrectAnswersCounter')
    const resultQuiz = JSON.parse(localStorage.getItem('resultQuiz'))
    let clipboardRef = useRef(null)

    const calculateTheResultScore = () => {
        const questionsCounter = questions.length
        if (questionsCounter && correctAnswersCounter) {
            const score = ((correctAnswersCounter / questionsCounter) * 100).toFixed(0)
            setScore(score)
        }
    }

    const detailOfResult = () => {
        if (score > 80){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`🤯 واااو، تو دیگه کی هستی ترکوندی`)
            setResultGif(<img src={`${resultQuiz.GIF100}`} alt={resultQuiz.GIF2} />)
        }
        else if (score > 60){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`😎 ایول\n! تو یک ${resultQuiz.fan_name} واقعی هستی `)
            setResultGif(<img src={`${resultQuiz.GIF80}`}  alt={resultQuiz.GIF4} />)
        }
        else if (score > 40){
            setResultScore(`🙂 ${score}%`)
            setResultSubtitle('عالیه، فقط یکم با یه فن بودن فاصله داری')
            setResultGif(<img src={`${resultQuiz.GIF60}`}  alt={resultQuiz.GIF6} />)
        }
        else if (score > 20){
            setResultScore(`😉 ${score}%`)
            setResultSubtitle('بیشتر تلاش کن. میتونی انجامش بدی')
            setResultGif(<img src={`${resultQuiz.GIF40}`}  alt={resultQuiz.GIF8} />)
        }
        else if (score >= 0){
            setResultScore(`😭 ${score}%`)
            setResultSubtitle('😅 میتونی سریع کوییز رو از اول بدی تا کسی نیومده\n😀 یا کوییز رو کلا عوض کنی بری بعدی')
            setResultGif(<img src={`${resultQuiz.GIF20}`}  alt={resultQuiz.GIF10} />)
        }
        else {
            setResultScore(`👀`)
            setResultSubtitle('😰 خطا در محاسبه امتیاز\n.لطفا بعدا امتحان کنید و یا در غیر اینصورت به پشتیبانی اطلاع دهید')
        }
    }

    const copyResultAndQuizLink = () => {
        const quizUrl = `${window.location.origin}/quiz/${replaceFunction(resultQuiz.title, ' ', '-')}`

        const messageShare =
            `من تو کوییز ${resultQuiz.title} (${resultScore}) درصد درست زدم . تو چقدر میتونی بزنی ؟
            \n -----------------------------------------
            \n ${quizUrl}`

        setClipboard(messageShare)
        clipboardRef.select()
        document.execCommand('copy')
    }

    const tryAgainTheQuiz = () => {
        window.history.go(-1)
    }

    const getSuggestionsQuiz = () => {
        axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${replaceFunction(resultQuiz.subCategory, ' ', '+')}&limit=4`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    const showPopUpSuggestion = () => {
        setTimeout(() => {
            popUpShow(document.querySelector('.result__popUpQuizSuggester'))

            document.querySelector('body').style.overflow = 'hidden'
            document.querySelector('#quizRoot').style.pointerEvents = 'none'
            document.querySelector('#quizRoot').style.overflow = 'none'
            document.querySelector('.header').style.filter = 'blur(7px)'
            document.querySelector('.result__container').style.filter = 'blur(7px)'
            document.querySelector('h2').style.filter = 'blur(7px)'
            document.querySelector('.quizContainer').style.filter = 'blur(7px)'

            setTimeout(() => {
                fadeIn(document.querySelector('.result__popUpQuizSuggester__closeBtn'))
            }, 3000)
        }, 10000)
    }

    const closePopUpQuizSuggester = () => {
        popUpHide(document.querySelector('.result__popUpQuizSuggester'))

        document.querySelector('body').style.overflow = 'auto'
        document.querySelector('#quizRoot').style.pointerEvents = 'all'
        document.querySelector('.header').style.filter = 'blur(0)'
        document.querySelector('.result__container').style.filter = 'blur(0)'
        document.querySelector('h2').style.filter = 'blur(0)'
        document.querySelector('.quizContainer').style.filter = 'blur(0)'
    }

    const chooseUniqueQuizToSuggest = () => {
        if (suggestionQuizzes[0].title === resultQuiz.title) {
            if (suggestionQuizzes[1]) {
                return suggestionQuizzes[1]
            }
            else {
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

            <Header />

            <Helmet>
                <title>نتیجه کوییز | کوییزلند </title>
                <meta name="description" content="نتیجه کوییز انجام شده" />
                <meta name="keywords" content="کوییز, کوییزلند" />
            </Helmet>

            <div className="result__container">
                <div className="result__title flex flex-jc-c">
                    <h5 className="tx-al-r">"نتیجه‌ کوییز  "{resultQuiz.title}</h5>
                </div>
                <div className="beforeAfterDecor flex flex-jc-c flex-ai-c">
                    <h1 className="result__subtitle tx-al-c">{resultSubtitle}</h1>
                </div>
                <div className="result wrapper-med space-sm flex flex-ai-c flex-jc-c">
                    <div className="result__img flex flex-jc-c flex-ai-c">
                        {resultGif}
                    </div>
                    <div className="result__score">{resultScore}</div>
                    <div className="result__detail tx-al-r">
                        <h5>تعداد پاسخ های درست:‌ <span className="result__detail__correctTime">{correctAnswersCounter}</span></h5>
                        <h5>تعداد پاسخ های غلط: <span className="result__detail__wrongTime">{questions.length - correctAnswersCounter}</span></h5>
                    </div>
                </div>

                <div className='wrapper-med'>
                    <div className="result__share space-sm tx-al-c">
                        <h5>{'دوستات رو به چالش بکش  \n ببین میتونن بیشتر از تو بیارن'}</h5>
                        <button onClick={copyResultAndQuizLink} className='result__share__btn btn' aria-label="Copy Result For Share" data-clipboard-target='.result__clipboard' type="button">🙋🏻‍♂️ اشتراک گذاری</button>
                        {/* <h6 className={`result__share__message ${clipboard === null && 'noVis'}`}>نتیجه و لینک کوییز کپی شد</h6> */}
                    </div>

                    <h2 className='flex flex-jc-c flex-ai-c space-med'>این کوییز چطور بود؟</h2>
                    
                    <div>
                        <InlineReactionButtons
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
                                url: `https://quizzland.net/quiz/${replaceFunction(resultQuiz.title, ' ', '-')}`, // (defaults to current url)
                            }}
                        />
                    </div>
                    
                </div>

            </div>

            <textarea ref={(value) => clipboardRef = value} value={clipboard} className="result__clipboard pos-abs" />

            <h2 className='tx-al-c space-med beforeAfterDecor'>کوییز های مشابه</h2>

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
                        <a href={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().title, ' ', '-')}`}>
                            <h3 className="result__popUpQuizSuggester__title flex">
                                {chooseUniqueQuizToSuggest().title}
                            </h3>
                        </a>
                    </div>
                    <a href={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().title, ' ', '-')}`}>
                        <div className='result__popUpQuizSuggester__thumbnail'>
                            <img src={chooseUniqueQuizToSuggest().thumbnail} alt={`${chooseUniqueQuizToSuggest().subCategory} | ${chooseUniqueQuizToSuggest().title}`} loading='lazy' />
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