import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import { StickyShareButtons } from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

import Layout from '../../components/layout'
import { log, replaceFunction, makeDatePublishFormatForQuizDetail, isItDesktop, isItMobile, isItIPad } from '../../components/base'
// import LoadingScreen from '../../components/loadingScreen'
import QuizContainer from '../../components/quizContainer'
// import SkeletonLoading from '../../components/'

const logo = '../images/Q-small.png'
const speakerIconOn = '/images/speakerOn.png'
const speakerIconOff = '/images/speakerOff.png'

let quiz = 'null'
let advertPos = 0
let quizCounter = 1

const Quiz = () => {
    const router = useRouter()
    const { quizTitle } = router.query

    const [questions, setQuestions] = useState(null)
    const [correctAnswersCounter, setCorrectAnswersCounter] = useState(0)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [correctAnswerOption, setCorrectAnswerOption] = useState(0)
    const [wrongAnswerOption, setWrongAnswerOption] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [ableToSelectOption, setAbleToSelectOption] = useState(true)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState(null)
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState(null)
    const [SFXAllowed, setSFXAllowed] = useState(null)
    const [showQuestionChangingHelper, setShowQuestionChangingHelper] = useState(false)
    const [showingAdverts, setShowingAdverts] = useState(false)
    const [SFXCorrect, setSFXCorrect] = useState(null)
    const [SFXWrong, setSFXWrong] = useState(null)
    const [quiz, setQuiz] = useState(null)

    const result = useRef(null)

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const quizTitleReplacedWithHyphen = () => {
        return replaceFunction(quizTitle, '-', '+')
    }

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
        setSFXCorrect(new Audio('../sounds/SFXCorrect.mp3'))
        setSFXWrong(new Audio('../sounds/SFXWrong.mp3'))
    }, [quizTitle])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const SFXLocalStorage = () => {
        if (localStorage.getItem('SFXAllowed')) {
            setSFXAllowed(localStorage.getItem('SFXAllowed'))
        } else {
            localStorage.setItem('SFXAllowed', 'true')
            setSFXAllowed('true')
        }
    }

    const applyBackground = (background) => {
        document.querySelector('html').style = `background: url('${background}') center/cover no-repeat fixed !important`
    }

    const grabData = () => {
        if (quizTitle != undefined) {
            const grabQuiz = async () => {
                return await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?title__iexact=${quizTitleReplacedWithHyphen()}&limit=1`).then((res) => res.data.results[0])
            }

            const grabQuestions = async () => {
                return await axiosLimited.get(`${API_URL}/dbAPI/questions/?title__iexact=${quizTitleReplacedWithHyphen()}`)
            }

            grabQuiz().then((quiz) => {
                try {
                    sendCategoryAsInterest(quiz.subCategory)
                    applyBackground(quiz.background)
                    setQuiz(quiz)
                }
                catch {
                    window.location.href = "/404";
                }
            })

            grabQuestions().then((question) => {
                setQuestions(question.data)
                getSuggestionsQuiz(question.data[0].subCategory)
                setContentLoaded(true)
            })
        }
    }

    const sendCategoryAsInterest = (category) => {
        const interest = JSON.parse(localStorage.getItem('interest'))

        if (interest !== null) {
            if (category in interest['categoryWatchedCounter']) {
                const oldValue = interest['categoryWatchedCounter'][category]
                let interestNew = JSON.parse(localStorage.getItem('interest'))
                interestNew['categoryWatchedCounter'][category] = oldValue + 1
                localStorage.setItem('interest', JSON.stringify(interestNew))

            } else {
                let interestNew = JSON.parse(localStorage.getItem('interest'))
                interestNew['categoryWatchedCounter'][category] = 1
                localStorage.setItem('interest', JSON.stringify(interestNew))
            }
        } else {
            localStorage.setItem('interest', JSON.stringify({ categoryWatchedCounter: { [category]: 1 } }))
        }
    }

    const ImGifTextAnswerShowOrHide = (questionId, hideOrShow) => {
        const question = document.querySelectorAll('.quiz__container')[questionId - 1]
        if (hideOrShow == 'block') {
            question.querySelector('.quiz__answerText').classList.remove('answerHide')
            question.querySelector('.quiz__answerText').classList.add('answerShow')

            question.querySelector('.quiz__answerImGif').classList.remove('answerHide')
            question.querySelector('.quiz__answerImGif').classList.add('answerShow')
        }
        else if (hideOrShow == 'none') {
            question.querySelector('.quiz__answerText').classList.remove('answerShow')
            question.querySelector('.quiz__answerText').classList.add('answerHide')

            question.querySelector('.quiz__answerImGif').classList.remove('answerShow')
            question.querySelector('.quiz__answerImGif').classList.add('answerHide')
        }
    }

    const playSFX = (userSelection) => {
        let userChose = parseInt(userSelection.id.slice(-1))
        let correctAnswer = parseInt(questions[currentQuestionNumber - 1].answer)

        const SFXAllowed = localStorage.getItem('SFXAllowed')
        if (userChose !== correctAnswer) {
            setWrongAnswerOption(parseInt(userChose))
            if (SFXAllowed === 'true') {
                SFXWrong.volume = .5
                SFXWrong.play()
            }
        } else {
            setCorrectAnswersCounter(prev => prev + 1)
            if (SFXAllowed === 'true') {
                SFXCorrect.volume = .5
                SFXCorrect.play()
            }
        }
    }

    const checkTheSelectedOption = (userSelection) => {
        let correctAnswer = parseInt(questions[currentQuestionNumber - 1].answer)

        playSFX(userSelection)
        setCorrectAnswerOption(correctAnswer)
        ImGifTextAnswerShowOrHide(currentQuestionNumber, 'block')
    }

    const amountOfPauseCalculator = () => {
        let amountOfPause = 1500
        const currentQuestions = questions[currentQuestionNumber - 1]
        if (currentQuestions && currentQuestions.answer_text !== '') {
            amountOfPause += 2000
        }
        if (!(currentQuestions && currentQuestions.answer_imGif.includes('NotExist'))) {
            amountOfPause += 2000
        }
        return amountOfPause
    }

    const makeEveryOptionLowOpacity = (type) => {
        const allOptions = document.querySelectorAll('.quiz__options__textLabel')

        if (type === 'low') {
            for (let i = 0; i < allOptions.length; i++) {
                allOptions[i].style.opacity = .5
            }
        }

        else if (type === 'high') {
            for (let i = 0; i < allOptions.length; i++) {
                allOptions[i].style.opacity = 1
            }
        }
    }

    const selectedOption = (props) => {
        if (ableToSelectOption) {
            setTimeout(() => {
                document.querySelector('.quiz__questions').scrollIntoView()
            }, 300)

            setAbleToSelectOption(false)
            setAbleToGoNext(true)
            makeEveryOptionLowOpacity('low')
            checkTheSelectedOption(props.target)

            if (autoQuestionChanger) {
                setTimeout(() => {
                    goNextQuestionOrEndTheQuiz()
                }, amountOfPauseCalculator())
            } else {
                setTimeout(() => {
                    if (showQuestionChangingHelper !== 'never' && !(isItDesktop())) {
                        setShowQuestionChangingHelper(true)
                    }
                }, 5000)
            }
        }
    }

    const questionShowIfNotNull = (question) => {
        if (question !== null) {
            return <p className='quiz__question text-center'> {question} </p>
        }
    }

    const restartTheStateOfQuestion = () => {
        ImGifTextAnswerShowOrHide(currentQuestionNumber, 'none')
        // setAbleToGoNext(false)
        setCorrectAnswerOption(0)
        setWrongAnswerOption(0)
        makeEveryOptionLowOpacity('high')

        setTimeout(() => {
            setAbleToSelectOption(true)
        }, 1300)
    }

    let sumOfTheWidthMarginAndPaddingOfQuestionForSliding

    if (isItDesktop() || isItIPad()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 46.20
    }
    else if (isItMobile()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 22.8
    }


    const goNextQuestionOrEndTheQuiz = () => {
        if (ableToGoNext || autoQuestionChanger || showingAdverts) {
            setShowQuestionChangingHelper('never')

            if (currentQuestionNumber !== questions.length) {
                restartTheStateOfQuestion()
                plusOneToTotalAnsweredQuestions()
                setCurrentMoveOfQuestions(prev => prev - sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

                // log('go next...')

                // advertPos -= 48
                // document.querySelector('.adverts_between').style.transform = `translate(${advertPos}rem)`

                if (typeof (window) !== 'undefined' && !(window.navigator.userAgent.includes('Windows'))) {  // if mobile, scroll to top
                    window.scrollTo(0, 0);
                }

            } else {
                setQuizEnded(true)
                setTimeout(() => {
                    try {
                        localStorage.setItem('resultQuiz', JSON.stringify(quiz))
                        localStorage.setItem('resultQuestions', JSON.stringify(questions))
                        localStorage.setItem('resultCorrectAnswersCounter', correctAnswersCounter)
                        result.current.click()
                    } catch {
                        log("Can't show the result from localStorage!")
                    }
                }, 3500)
            }
        }
    }

    let questionCounterForId = 1
    const questionOptionsCheckBetweenStringOrImg = (question) => {
        questionCounterForId += 1
        if (question.option_1st) {
            return (
                <div className="flex justify-center w-[20rem] md:w-[30rem]">
                    <form className='quiz__options p-4 w-[100%] md:grid text-[5vw] md:text-[1.6vw] justify-center' action="">
                        {question.option_1st !== ('') &&
                            <> <input
                                onClick={selectedOption}
                                type="radio"
                                name="answer" className='opacity-0 absolute'
                                id={`${questionCounterForId}-1`}
                            />
                                <label
                                    className={`quiz__options__textLabel
                                            border-2 border-solid border-[#adadad]
                                            p-1 block max-w-[100%] md:max-width-[14rem]
                                            md:h-[auto] md:pr-4 md:m-2 rounded-xl
                                            cursor-pointer
                                            ${correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''}
                                            ${wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''}
                                            ${!ableToSelectOption ? 'pointerOff' : ''}
                                        `}
                                    id={`${questionCounterForId}-1`}
                                    htmlFor={`${questionCounterForId}-1`}
                                >
                                    {question.option_1st}
                                </label>
                            </>
                        }
                        {question.option_2nd !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-2`} /> <label className={`quiz__options__textLabel border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer ${correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> {question.option_2nd} </label> </>}
                        {question.option_3rd !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-3`} /> <label className={`quiz__options__textLabel border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer ${correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> {question.option_3rd} </label> </>}
                        {question.option_4th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-4`} /> <label className={`quiz__options__textLabel border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer ${correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> {question.option_4th} </label> </>}
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex justify-center">
                    <form className='quiz_options pt-4 grid grid-cols-2 md:flex md:space-x-3 justify-center relative' data={question.answer} action="">
                        {!(question.option_img_1st.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-1`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> <Image src={question.option_img_1st} blurDataURL='/images/Q-512.png' placeholder='blur' width='520' height='624' alt={question.title} title={question.title} className="quiz__imgOption rounded-xl object-contain object-top" /> </label> </>}
                        {!(question.option_img_2nd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-2`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> <Image src={question.option_img_2nd} blurDataURL='/images/Q-512.png' placeholder='blur' width='520' height='624' alt={question.title} title={question.title} className="quiz__imgOption rounded-xl object-contain object-top" /> </label> </>}
                        {!(question.option_img_3rd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-3`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> <Image src={question.option_img_3rd} blurDataURL='/images/Q-512.png' placeholder='blur' width='520' height='624' alt={question.title} title={question.title} className="quiz__imgOption rounded-xl object-contain object-top" /> </label> </>}
                        {!(question.option_img_4th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='opacity-0 absolute' id={`${questionCounterForId}-4`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> <Image src={question.option_img_4th} blurDataURL='/images/Q-512.png' placeholder='blur' width='520' height='624' alt={question.title} title={question.title} className="quiz__imgOption rounded-xl object-contain object-top" /> </label> </>}
                    </form>
                </div>
            )
        }
    }

    const answerOfQuestionIfExistShow = (question) => {
        if (question.answer_text) {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: question.answer_text
                    }}>
                </div>
            )
        }
    }

    const gifAnswerOfQuestionIfExistShow = (question) => {
        if (!(question.answer_imGif.includes('NotExist.jpg'))) {
            return <Image
                src={question.answer_imGif}
                width='1366'
                height='768'
                className='object-contain'
                alt={question.title}
                title={question.title}
                blurDataURL='/images/Q-512.png'
                placeholder='blur'
            />
        }
    }

    const isSafari = typeof (window) !== 'undefined' && navigator.userAgent.indexOf("Chrome") != -1 === false && navigator.userAgent.indexOf("Chrome") != -1

    let quizCounter = 0

    const quizQuestions = () => {

        return (
            questions && questions.map(question => {
                quizCounter += 1

                // if (quizCounter == 2) {
                //     // log('adverts')
                //     // setShowingAdverts(true)  // causing error

                //     return (
                //         <>
                //             <div className='adverts_between flex justify-center' id='mediaad-cpLp'></div>

                //             <div className={`quiz__questionChanger__container absolute ${currentQuestionNumber == 2 ? 'fadeIn' : 'fadeOut'}`}>
                //                 <button onClick={autoQuestionChanger ? () => { return } : goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger absolute quiz__questionChanger__next btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                //             </div>
                //         </>

                //     )
                // }

                // else {
                return (
                    <div key={question.id}
                        style={{ transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)` }}
                        className={`quiz__container relative darkGls`}>

                        <span className='block right-2 top-[-.5rem] z-10 absolute text-[3rem] text-red-900'>
                            {questionCounterForId}
                        </span>

                        {questionShowIfNotNull(question.question)}

                        <div>
                            {!question.question_img.includes('NotExist') &&
                                <Image
                                    src={question.question_img}
                                    width='1366'
                                    height='768'
                                    alt={question.title}
                                    className='rounded-xl object-contain object-top'
                                    title={question.title}
                                    blurDataURL='/images/Q-512.png'
                                    placeholder='blur'
                                />}
                        </div>

                        {questionOptionsCheckBetweenStringOrImg(question)}

                        <div className={`quiz__answerText answerHide text-right`}>
                            {answerOfQuestionIfExistShow(question)}
                        </div>

                        <div className={`quiz__answerImGif answerHide`} id='quiz__answerImGif'>
                            {gifAnswerOfQuestionIfExistShow(question)}
                        </div>
                    </div>
                )
                // }
            })
        )
    }

    const quizQuestionsForSafari = () => {
        return (
            questions && questions.map(question => {
                return (
                    <div key={question.id} style={{ left: `${currentMoveOfQuestions}rem` }} className="quiz__container relative darkGls">
                        {questionShowIfNotNull(question.question)}

                        {
                            !question.question_img.includes('NotExist') &&
                            <Image
                                src={question.question_img}
                                width='1366'
                                height='768'
                                className='rounded-xl object-contain object-top'
                                alt={question.title}
                                title={question.title}
                                blurDataURL='/images/Q-512.png'
                                placeholder='blur'
                            />
                        }

                        {questionOptionsCheckBetweenStringOrImg(question)}

                        <div className={`quiz__answerText answerHide text-right`}>
                            {answerOfQuestionIfExistShow(question)}
                        </div>

                        <div className={`quiz__answerImGif answerHide`}>
                            {gifAnswerOfQuestionIfExistShow(question)}
                        </div>
                    </div>
                )
            })
        )
    }

    const plusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev + 1)
    }

    const showTheTagsIfNotNull = () => {
        const splittedTags = quiz.tags.split('،')
        return (
            splittedTags.map(tag => {
                return <li key={tag}><h2><Link href={`/search?s=${replaceFunction(tag, ' ', '+')}`} ><a rel='tag'>{tag}</a></Link></h2></li>
            })
        )
    }

    const getSuggestionsQuiz = (subCategory) => {
        axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8`)
            .then((res) => { setSuggestionQuizzes(res.data.results) })
    }

    const SFXController = () => {
        const changeToThis = SFXAllowed === 'true' ? 'false' : 'true'
        setSFXAllowed(changeToThis)
        localStorage.setItem('SFXAllowed', changeToThis)
    }

    const currentUrl = () => {
        return `https://www.quizzland.net/quiz/${replaceFunction(quizTitle, ' ', '-')}`
    }

    let firstTouch
    const touchScreenStart = (e) => {
        const positionOfStartTouch = e.changedTouches[0].clientX
        firstTouch = positionOfStartTouch
    }

    const touchScreenEnd = (e) => {
        const positionOfEndTouch = e.changedTouches[0].clientX
        if (positionOfEndTouch - firstTouch <= -100) {
            if (!(autoQuestionChanger)) {
                goNextQuestionOrEndTheQuiz()
            }
        }
    }

    return (
        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{`کوییزلند | کوییز ${replaceFunction(decodeURI(quizTitle), '+', ' ')}`}</title>

                    <link rel="canonical" href={quizTitle && currentUrl()} />

                    <meta name="description" content={`با ${questions && questions.length} سوال جذاب و فان. ببین میتونی بالای 80% بزنی | ${quiz && quiz.title} ${quiz && quiz.subCategory} کوییز از`} />
                    <meta name="keywords" content="کوییز, کوییزلند" />
                    <meta name="msapplication-TileImage" content={quiz && quiz.thumbnail} />
                    <meta property="og:site_name" content="کوییزلند" />
                    <meta property="og:title" content={quiz && quiz.title} />
                    <meta property="og:description" content={`با ${questions && questions.length} سوال جذاب و فان. ببین میتونی بالای 80% بزنی | ${quiz && quiz.title} ${quiz && quiz.subCategory} کوییز از`} />
                    <meta property="og:image" content={quiz && quiz.thumbnail} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="300" />
                    <meta property="og:image:height" content="300" />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={quizTitle && currentUrl()} />

                    <script type="application/ld+json">
                        {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "${quiz && quiz.title}",
                            "image": [
                                "${quiz && quiz.thumbnail}",
                                "${quiz && quiz.background}"
                            ],
                            "datePublished": "${quiz && quiz.publish}",
                            "dateModified": "${quiz && quiz.publish}",
                            "author": {
                                "@type": "Person",
                                "name": "مصطفی تبریزیان",
                                "url": "https://www.quizzland.net/contact"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "کوییزلند",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://www.quizzland.net${logo}"
                                }
                            }
                        }
                    `}
                    </script>
                </Head>

                {/* {quiz.title &&
                    <StickyShareButtons
                        config={{
                            alignment: 'left',    // alignment of buttons (left, right)
                            color: 'social',      // set the color of buttons (social, white)
                            enabled: true,        // show/hide buttons (true, false)
                            font_size: 16,        // font size for the buttons
                            hide_desktop: false,  // hide buttons on desktop (true, false)
                            labels: 'counts',     // button labels (cta, counts, null)
                            language: 'en',       // which language to use (see LANGUAGES)
                            min_count: 10,         // hide react counts less than min_count (INTEGER)
                            networks: [           // which networks to include (see SHARING NETWORKS)
                                'whatsapp',
                                'telegram',
                                'twitter',
                                'sms',
                                'sharethis',
                            ],
                            padding: 9,          // padding within buttons (INTEGER)
                            radius: 15,            // the corner radius on each button (INTEGER)
                            show_total: true,     // show/hide the total share count (true, false)
                            show_mobile: true,    // show/hide the buttons on mobile (true, false)
                            show_toggle: false,    // show/hide the toggle buttons (true, false)
                            size: 38,             // the size of each button (INTEGER)
                            top: 450,             // offset in pixels from the top of the page
                            url: quizTitle && currentUrl()
                        }}
                    />
                } */}

                <div className={`${quizEnded ? 'fadeIn' : 'fadeOut'}`}>
                    <div className={'loadingScreen fixed flex justify-center flex-ai-c'}></div>
                    <div className='countingResult loadingScreen fixed flex justify-center flex-ai-c'>
                        ___ در حال محاسبه نتیجه کوییز___
                    </div>
                </div>

                <div className='SFXController absolute' onClick={() => { SFXController() }} >
                    <button type="button">
                        <Image
                            src={SFXAllowed === 'true' ? speakerIconOn : speakerIconOff}
                            width='24'
                            height='24'
                            alt='کوییزلند | Quizzland'
                        />
                    </button>
                </div>

                <div className="quiz__head relative text-right" id="quiz__head">
                    {/* {
                        !(contentLoaded) &&
                        <div className='flex justify-center flex-ai-c'>
                            <div className={`skeletonLoading skeletonLoading__quizTitle text-center wrapper-sm`}></div>
                        </div>
                    } */}

                    <div className="text-center">
                        <h1>{quiz && quiz.title}</h1>
                    </div>

                    <div className="quiz__detail flex justify-center flex-ai-c">
                        {/* {
                            !(contentLoaded) &&
                            <div className={`flex`} style={{height: '8rem'}}>
                                <div className='skeletonLoading skeletonLoading__quizInfo text-center'></div>
                                <div className='skeletonLoading skeletonLoading__quizInfo text-center'></div>
                            </div>
                        } */}
                        {
                            contentLoaded &&
                            <>
                                <h5>تعداد سوال ها: {questions && questions.length}</h5>
                                <h5>{quiz && makeDatePublishFormatForQuizDetail(quiz.publish)}</h5>
                            </>
                        }
                    </div>

                    {
                        contentLoaded &&
                        <div onClick={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch relative center flex justify-center flex-ai-c`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                            <h6>تغییر خودکار</h6>
                            <button className="quiz__autoQuestionChangerSwitch__btn btn">
                                <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : ''} relative`}></div>
                            </button>
                        </div>
                    }

                </div>

                {/* {isItDesktop() &&
                    <hr className='divider'></hr>
                } */}

                {/* {
                    contentLoaded &&
                    <div className={`quiz__questionCounter relative flex justify-center flex-ai-c`}>
                        <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                        سوال شماره
                    </div>
                } */}

                <div className={`text-center ${showQuestionChangingHelper === true ? 'fadeIn' : 'fadeOut'}`}>
                    <h5>برای رفتن به سوال بعدی از راست به چپ بکشید!</h5>
                </div>

                <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions relative flex justify-center text-center`} tag="quiz">
                    <div className={`quiz__hider flex relative`}>
                        {/* {
                            !(contentLoaded) &&
                            <div className={`skeletonLoading skeletonLoading__quizQuestion text-center wrapper-sm`}></div>
                        } */}

                        {
                            isSafari ? quizQuestionsForSafari() : quizQuestions()
                        }

                        {
                            contentLoaded && isItDesktop() &&
                            <div className={`
                                    quiz__questionChanger__container absolute
                                    top-40 right-[5%]
                                     ${ableToGoNext ? 'fadeIn' : 'fadeOut'}`
                            }>
                                <button onClick={autoQuestionChanger ? () => { return } : goNextQuestionOrEndTheQuiz}
                                    className={`
                                            quiz__questionChanger absolute
                                            quiz__questionChanger__next btn
                                            ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}
                                        `}
                                    aria-label='Next Question'></button>
                            </div>
                        }
                    </div>
                </div>

                <div>
                    <h7 className='quiz__tags__title flex justify-center flex-ai-c beforeAfterDecor'>تگ های کوییز</h7>
                    <ul className='quiz__tags flex justify-center flex-ai-c'>
                        {quiz && showTheTagsIfNotNull()}
                    </ul>
                </div>

                {/* Adverts */}
                <div className='adverts_center' id='mediaad-bNpr'></div>

                <div className='space-med'>
                    <h7 className='quiz__tags__title flex justify-center flex-ai-c beforeAfterDecor'>کوییز های مشابه</h7>

                    {/* {SkeletonLoading(contentLoaded)} */}

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right">
                        {
                            suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                        }
                    </ul>
                </div>


                <h7 className='quiz__tags__title flex justify-center flex-ai-c beforeAfterDecor'>مطالب پیشنهادی</h7>

                {/* Adverts */}
                <div className='adverts_center' id='mediaad-dESu'></div>

                <Link href='/quizResult' ><a ref={result} className='noVis'></a></Link>

            </Layout>
        </>
    );
}

export default Quiz;