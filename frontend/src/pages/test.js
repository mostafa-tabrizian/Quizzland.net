import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import Skeleton from '@mui/material/Skeleton';
import UserStore from '../store/userStore';

import axios from '../components/axiosApi'
import { log, getTheme, replaceFunction, isItDesktop, isItMobile, isItIPad } from '../components/base'
// import Trivia from '../components/quiz/trivia'
import Test from '../components/quiz/test'
import LoadingScreen from '../components/loadingScreen'
import TestHeader from '../components/quiz/testHeader'
const LikeCommentButton = React.lazy(() => import('../components/user/likeCommentButton'))
import AddView from '../components/addView';
import axiosInstance from '../components/axiosAuthApi';
// const SkeletonTestContainer = React.lazy(() => import('../components/skeletonTestContainer'))
const TestContainer = React.lazy(() => import('../components/testContainer'))

const logo = '/static/img/Q-small.png'

const TestQuiz = (props) => {
    const [questions, setQuestions] = useState([])
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(localStorage.getItem('autoQuestionChanger') == 'true')
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [quizEnded, setQuizEnded] = useState(false)
    const [quizSlug, setQuizSlug] = useState(replaceFunction(window.location.pathname.split('/')[2], '-', '+'))
    const [contentLoaded, setContentLoaded] = useState(false)
    // const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [SFXAllowed, setSFXAllowed] = useState(localStorage.getItem('SFXAllowed') == 'true')
    const [quiz, setQuiz] = useState(null)
    const [quizSlugReplacedWithHyphen, setQuizSlugReplacedWithHyphen] = useState()
    const [theme, setTheme] = useState('dark')
    const [its404, set404] = useState(false)

    const location = useLocation();

    const result = useRef(null)
    const quizDetailRef = useRef(null)
    // const recaptchaRef = useRef(null)
    
    const { enqueueSnackbar } = useSnackbar()
    
    const [userProfile, userActions] = UserStore()

    useEffect(() => {
        scrollToTop()
    }, quizSlug)
    
    useEffect(() => {
        fetchQuiz()
    }, quizSlugReplacedWithHyphen)
    
    useEffect(() => {
        const question_background = document.querySelector('#question_background')
        question_background && (document.querySelectorAll('#question_background').forEach((q) => q.style = `background: ${quiz?.question_background}`))
        document.querySelector('body').style = `background: #060101`
    })
    
    useEffect(() => {
        const slug = replaceFunction(window.location.pathname.split('/')[2], '-', '+')
        setQuizSlug(slug)
        setQuizSlugReplacedWithHyphen(slug)
        const theme = getTheme()
        setTheme(theme)
    }, [location]);

    // const checkRecaptcha = async () => {
    //     const recaptchaResponse = await recaptchaRef.current.executeAsync()

    //     return await axios.get(`/api/recaptcha?r=${recaptchaResponse}`,)
    //         .then(res => {
    //             log(res)
                
    //             if (res.data != 'True') {
    //                 message.error('block user because not human')
    //                 return false
    //             } else {
                    
    //                 return true
    //             }
    //         })
    //         .catch(err => {
    //             log(err.response)
    //         })
    // }

    const scrollToTop = () => {
        document.querySelector("body").scrollTo(0, 0)
    }

    const applyBackground = () => {
        const quizBg = document.querySelector('#quizBg')
        const background = quizDetailRef.current.background

        quizBg &&
            (quizBg.style = `background-image: url('${background}'); background-size: cover; background-position: center`)
    }

    const fetchQuiz = async () => {
        quizSlugReplacedWithHyphen &&
            await axios.get(`/api/testView/?slug__iexact=${quizSlugReplacedWithHyphen}&limit=1&public=true`).then((res) => res.data.results[0])
                .then(async (quizData) => {
                    quizDetailRef.current = quizData
                    setQuiz(quizData)

                    sendCategoryAsInterest()
                    // await getSuggestionsQuiz()
                    applyBackground()

                    await axios.get(`/api/questionsPointyView/?quizKey=${quizData.id}&public=true`)
                        .then((questionData) => {
                            setQuestions(questionData.data)
                            setContentLoaded(true)
                        })
                        .catch(err => {
                            log(err.response)
                        })
                })
                .catch((err) => {
                    log(err)
                    log(err.response)
                    set404(true)
                })
    }

    const sendCategoryAsInterest = () => {
        const interest = JSON.parse(localStorage.getItem('interest'))
        const category = quizDetailRef.current.subCategory

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

    const SFXClick = new Audio('/static/sound/SFXClick.mp3')

    const playSFX = () => {
        if (SFXAllowed) {
            SFXClick.volume = .5
            SFXClick.play()
        }
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

    const takeSelectedOptionValue = (userSelection) => {
        let userChose = userSelection.id
        const currentQuestionNumber = parseInt(userChose.split('-')[0])

        for (let i = 1; i <= 10; i++) {
            if (document.getElementById(`inputLabel ${currentQuestionNumber}-${i}`)) {
                document.getElementById(`inputLabel ${currentQuestionNumber}-${i}`).style.opacity = .5
                document.getElementById(`inputLabel ${currentQuestionNumber}-${i}`).style.borderColor = 'white'
            }
        }

        document.getElementById(`inputLabel ${userChose}`).style.opacity = 1
        document.getElementById(`inputLabel ${userChose}`).style.background = (theme == 'light' ? 'white' : '#000000bf')
        document.getElementById(`inputLabel ${userChose}`).style.borderColor = '#6a0d11'
    }



    const fetchUserHistory = async () => {
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/historyView/?timestamp=${now}`)
            .then(res => {
                return res.data
            })
            .catch(err => {
                log(err.response)
            })
    }

    const userPlayedThisQuizBefore = async (quiz) => {
        const userHistory = await fetchUserHistory()
        let playedBefore = false

        for (let quizIndex in userHistory) {
            if (userHistory[quizIndex].quizV2_id?.slug === quiz?.slug) {
                playedBefore = true
                break
            }
        }
        
        return playedBefore
    }

    const postToHistory = async (quiz) => {
        if (!userProfile.userDetail) {
            return
        }

        const playedBefore = await userPlayedThisQuizBefore(quiz)

        if (!playedBefore) {
            const payload = {
                user_id: {
                    username: userProfile.userDetail.id
                },
                quizV2_id: {
                    id: quiz?.id
                },
                test_id: {
                    id: 0
                }
            }
    
            await axiosInstance.post(`/api/historyView/`, payload)
                .then(res => {
                    log(res)
                })
                .catch(err => {
                    log(err)
                    log(err.response)
                })
        }
    }

    const halfTheQuestions = Math.floor(questions.length / 2)

    const ifHalfQuizAddView = () => {
        if (currentQuestionNumber == halfTheQuestions) {  // && userProfile.userDetail
            AddView(`test`, quizDetailRef.current.id)
            postToHistory()
        }
    }

    const selectedOption = async (props) => {
        playSFX()
        takeSelectedOptionValue(props.target)
        ifHalfQuizAddView()

        if (autoQuestionChanger) {
            setTimeout(() => {
                goNextQuestionOrEndTheQuiz()
            }, 2000)
        } else {
            setAbleToGoNext(true)

            setTimeout(() => {
                if (document.querySelector('.quiz__container').style.transform == 'translate(0rem)' && !(isItDesktop())) {
                    TutorialForHowToChangeTheQuestion()
                }
            }, 5000)
        }
    }

    const restartTheStateOfQuestion = () => {
        setAbleToGoNext(false)
        makeEveryOptionLowOpacity('high')
    }

    let sumOfTheWidthMarginAndPaddingOfQuestionForSliding

    
    // class quiz__container all x size in rem
    if (isItDesktop() || isItIPad()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = (460.8 + 1.6 + 1.6 + 80) / 16  // width + padding-l + padding-r + margin-r
    }
    else if (isItMobile()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = ((351.988 + 1.6 + 1.6 + 8 + 80) / 16)  // width + padding-l + padding-r + margin-l + margin-r
    }

    const goNextQuestionOrEndTheQuiz = () => {
        if (ableToGoNext || autoQuestionChanger) {
            if (currentQuestionNumber !== questions?.length) {
                restartTheStateOfQuestion()
                plusOneToTotalAnsweredQuestions()
                setCurrentMoveOfQuestions(prev => prev - sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

                // if (typeof (window) !== 'undefined' && !(window.navigator.userAgent.includes('Windows'))) {
                //     window.scrollTo(0, 0);
                // }

            } else {
                setQuizEnded(true)
                localStorage.setItem('qd', JSON.stringify(quiz))
                localStorage.setItem('qr', calculateTheResult())
                result.current.click()
            }
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
        return <LazyLoadImage
            src={question.answer_imGif}
            width={1366}
            className='object-contain object-top pb-4 m-auto'
            alt={question.title}
            title={question.title}
        />
    }

    const isSafari = typeof (window) !== 'undefined' && navigator.userAgent.indexOf("Chrome") != -1 === false && navigator.userAgent.indexOf("Chrome") != -1

    const quizQuestions = (browser) => {
        return (
            questions?.map(question => {
                return (
                    <div key={question.id}
                        style={
                            browser == 'safari' ?
                                { left: `${currentMoveOfQuestions}rem` }
                                :
                                { transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)` }
                        }
                        className={`
                            quiz__container relative mr-20 ml-2 md:ml-0 md:pt-3
                            p-[0.1rem] transition-all duration-1000 ease-in-out w-full
                        `}
                    >
                        <div className='mt-3 w-[22rem] md:w-[29rem]'>

                            {
                                (question.question !== null && question.question !== '') &&
                                <div id='question_background' className='py-1 rounded-xl flex overflow-auto items-center h-[17rem]' >
                                    <div className='absolute z-10 top-6 right-7 md:right-3 questionNumberShadow mix-blend-hard-light'>
                                        {questions.indexOf(question) + 1}
                                    </div>
                                    <p className='p-3 text-[2rem] w-full quiz_question mix-blend-hard-light text-center backdrop-blur-2xl rounded-xl'> {question.question} </p>
                                </div>
                            }

                            {
                                !question?.question_img?.includes('NotExist') &&
                                <div className='my-3'>
                                    <div className='absolute z-10 top-6 right-7 md:right-3 questionNumberShadow mix-blend-hard-light'>
                                        {questions.indexOf(question) + 1}
                                    </div>
                                    <LazyLoadImage
                                        src={question?.question_img}
                                        alt={question.title}
                                        className='object-cover object-top rounded-xl'
                                        title={question.title}
                                        effect="blur"
                                        placeholder={<Skeleton variant="rounded" animation="wave" width={466} height={266} />}
                                    />
                                    <a href={question?.question_img} target='_blank'><span className='text-[.7rem] block text-white'>در صورت عدم نمایش اینجا را کلیک کنید</span></a>
                                </div>
                            }
                        </div>

                        <Test
                            question={question}
                            selectedOption={selectedOption}
                        />
                    </div>
                )
            })
        )
    }

    const plusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev + 1)
    }

    const minusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev - 1)
    }

    const goLastQuestion = () => {
        if (currentQuestionNumber !== 1) {
            minusOneToTotalAnsweredQuestions()
            setCurrentMoveOfQuestions(prev => prev + sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

        } else {
            enqueueSnackbar('شما سوال اول هستید', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
        }
    }

    const calculateTheResult = () => {
        const allOptions = document.querySelectorAll('input[type=radio]')
        const optionPoints = ['option_point_1st', 'option_point_2nd', 'option_point_3rd', 'option_point_4th', 'option_point_5th', 'option_point_6th', 'option_point_7th', 'option_point_8th', 'option_point_9th', 'option_point_10th']

        const firstQuestionId = allOptions[0].getAttribute('id')
        const firstQuestionIndex = parseInt(firstQuestionId.split('-')[0])

        let totalPoints = 0
        for (let i = 0; i < allOptions.length; i++) {
            const questionId = allOptions[i].getAttribute('id')
            const currentQuestionId = parseInt(questionId.split('-')[0])
            const currentQuestionNumber = currentQuestionId - firstQuestionIndex
            const OptionSelected = parseInt(questionId.split('-')[1]) - 1

            if (allOptions[i].checked) {
                const pointOfOptions = questions[currentQuestionNumber][optionPoints[OptionSelected]]
                totalPoints += pointOfOptions
            }
        }

        return totalPoints
    }

    const showTheTagsIfNotNull = () => {
        const splittedTags = quiz.tags.split('،')
        return (
            splittedTags.map(tag => {
                return (
                    <li key={tag} className='px-3 py-1 text-white rounded-lg'>
                        <h4>
                            <Link
                                to={`/tags/${replaceFunction(tag, ' ', '+')}`}
                                rel='tag'
                                target='_blank'
                            >
                                {tag}
                            </Link>
                        </h4>
                    </li>
                )
            })
        )
    }

    // const getSuggestionsQuiz = async () => {
    //     const category = quizDetailRef.current.categoryKey.id
    //     const subCategory = quizDetailRef.current.subCategory

    //     const quiz = await axios.get(`/api/quizView/?subCategory__iexact=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
    //     const pointy = await axios.get(`/api/testView/?subCategory__iexact=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
    //     let content = quiz.data.results.concat(pointy.data.results)

    //     if (content.length != 8) {
    //         const quizByCategory = await axios.get(`/api/quizView/?category__exact=${category}&limit=8&public=true`)
    //         const pointyByCategory = await axios.get(`/api/testView/?category__exact=${category}&limit=8&public=true`)
    //         content = content.concat(quizByCategory.data.results.concat(pointyByCategory.data.results))
    //     }

    //     setSuggestionQuizzes(content.slice(0, 8))
    // }

    const currentUrl = () => {
        return `https://www.quizzland.net/test/${replaceFunction(quizSlug, ' ', '-')}`
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
    
    const SFXController = (statue) => {
        setSFXAllowed(statue)
        localStorage.setItem('SFXAllowed', statue)
    }

    const changeAutoQuestionChanger = (statue) => {
        setAutoQuestionChanger(statue)
        localStorage.setItem('autoQuestionChanger', statue)
    }

    return (
        <div>
            <LoadingScreen loadState={contentLoaded} />

            <Helmet>
                <title>{`${replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`}</title>

                <link rel="canonical" href={currentUrl()} />

                <meta name="description" content={`${replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`} />
                <meta name="keywords" content="کوییز, کوییزلند" />
                <meta name="msapplication-TileImage" content={quiz?.thumbnail} />
                <meta property="og:site_name" content="کوییزلند" />
                <meta property="og:title" content={`${replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`} />
                <meta property="og:description" content={`${replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`} />
                <meta property="og:image" content={quiz?.thumbnail} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="300" />
                <meta property="og:image:height" content="300" />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl()} />

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "${replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند",
                            "image": [
                                "${quiz?.thumbnail}",
                                "${quiz?.background}"
                            ],
                            "datePublished": "${quiz?.publish}",
                            "dateModified": "${quiz?.publish}",
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
            </Helmet>

            {/* <ReCAPTCHA
                sitekey={process.env.RECAPTCHA_SITE_KEY}
                size='invisible'
                hl='fa'
                theme="dark"
                ref={recaptchaRef}
                onErrored={(e) => log(`er ${e}`)}
            /> */}

            <div>
                {
                    !its404
                        ?
                        <div className="ltr">
                            <div id='quizBg'></div>

                            <div className={`
                            fixed left-0 backdrop-blur-3xl backdrop-brightness-75
                            top-0 w-screen h-screen z-20 ${quizEnded ? 'fadeIn' : 'fadeOut'}
                            flex flex-col items-center justify-center 
                        `}>
                                <div>
                                    <div className='absolute w-10 h-10 bg-red-800 rounded-full animate-ping'></div>
                                    <div className='w-10 h-10 bg-red-800 rounded-full'></div>
                                </div>
                                <div className='mt-5'>
                                    <h2>
                                        در حال محاسبه نتیجه کوییز
                                    </h2>
                                </div>
                            </div>

                            <TestHeader quizDetail={quiz} contentLoaded={contentLoaded} questionsLength={questions?.length} autoQuestionChanger={autoQuestionChanger} changeAutoQuestionChanger={changeAutoQuestionChanger} SFXAllowed={SFXAllowed} SFXController={SFXController} />

                            {quiz?.id && <LikeCommentButton quiz={quiz} quizType='test' />}

                            {
                                contentLoaded && isItDesktop() &&
                                <div className={`
                                quiz__questionChanger__container relative
                                top-24
                                ${ableToGoNext ? 'fadeIn' : 'fadeOut'}
                            `}>
                                    <button onClick={autoQuestionChanger ? () => { return } : goNextQuestionOrEndTheQuiz}
                                        aria-label='Next Question'
                                        className={`
                                        quiz__questionChanger absolute
                                        quiz__questionChanger__next btn
                                        ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}
                                    `}
                                    >

                                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>

                                    </button>
                                    <button
                                        onClick={goLastQuestion}
                                        aria-label='Next Question'
                                        className={`
                                            quiz__questionChanger absolute quiz__questionChanger__last
                                            btn
                                        `}
                                    >
                                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                                    </button>
                                </div>
                            }

                            <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions mb-4 relative flex justify-center text-center mt-12 md:mt-0`} tag="quiz">
                                <div className={`quiz__hider mt-5 flex relative`}>
                                    {
                                        !(contentLoaded) &&
                                        <div className='mt-5 overflow-hidden shadow-lg skeletonQuiz skeletonQuiz__quizQuestion shadow-zinc-800 rounded-xl'></div>
                                    }

                                    {
                                        isSafari ? quizQuestions('safari') : quizQuestions('otherBrowser')
                                    }
                                </div>
                            </div>

                            <div>
                                <h3 className='flex items-center justify-center text-white quiz__tags__title beforeAfterDecor'>تگ های کوییز</h3>
                                <ul className='flex flex-wrap items-baseline justify-center my-5 space-x-3 space-y-2 space-x-reverse quiz__tags max-w-[35rem] mx-auto'>
                                    {quiz && showTheTagsIfNotNull()}
                                </ul>
                            </div>

                            {/* Adverts */}

                            {/* <div className='mt-5 adverts_center' id='mediaad-bNpr'></div> */}

                            {/* <div className='mx-4 mt-10'>
                                <h3 className='flex items-center justify-center mb-5 text-white quiz__tags__title beforeAfterDecor'>کوییز های مشابه</h3>

                                <ul className="flex flex-col md:flex-row flex-wrap md:w-[70rem] mx-auto my-10">
                                    {
                                        suggestionQuizzes && <TestContainer tests={suggestionQuizzes} bgStyle={'bg'} />
                                    }
                                </ul>
                            </div> */}


                            {/* <h7 className='flex items-center justify-center quiz__tags__title beforeAfterDecor'>مطالب پیشنهادی</h7> */}

                            {/* Adverts */}
                            {/* <div className='adverts_center' id='mediaad-dESu'></div> */}


                            <Link
                                to={`/result`}
                                ref={result}
                                className='noVis'
                            ></Link>

                        </div>
                        :
                        <div>
                            <div className="pageNotFound text-[18rem] h-[13rem] md:h-[34rem] md:absolute md:left-1/2 md:top-1/2 items-center flex md:text-[50rem]">404</div>

                            <div class="basicPage wrapper-sm relative" style={{ background: (theme == 'light' ? '#f0f0f0' : '#0000008c'), backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1' }}>
                                <h1> 🤔 اوپس! کوییز مورد نظر پیدا نشد </h1>
                                <div class="mt-5">
                                    <h2>
                                        نیست یا در حال حاضر غیر فعال شده
                                    </h2>
                                </div>
                                <div className='mt-10'>
                                    <div className='px-4 py-2 border-2 border-red-900 rounded-xl'>
                                        <h2>
                                            <Link to='/contents?s=trend&c=test'>
                                                مشاهده بهترین تست های این ماه
                                            </Link>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                }

            </div>
        </div>
    );
}

export default TestQuiz;