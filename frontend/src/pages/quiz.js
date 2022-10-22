import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { StickyShareButtons } from 'sharethis-reactjs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import Skeleton from '@mui/material/Skeleton';

import axios from '../components/axiosApi'
import { log, getTheme, replaceFunction, isItDesktop, isItMobile, isItIPad } from '../components/base'
import Trivia from '../components/quiz/trivia'
import Test from '../components/quiz/test'

const LoadingScreen = React.lazy(() => import('../components/loadingScreen'))
const QuizHeader = React.lazy(() => import('../components/quiz/quizHeader'))
const LikeCommentButton = React.lazy(() => import('../components/user/likeCommentButton'))
import AddView from '../components/addView';
const SkeletonQuizContainer = React.lazy(() => import('../components/skeletonQuizContainer'))
const QuizContainer = React.lazy(() => import('../components/quizContainer')) 

const logo = '/static/img/Q-small.png'

const Quiz = (props) => {
    const [quizType] = useState(window.location.pathname.split('/')[1])
    const [questions, setQuestions] = useState([])
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [correctAnswerOption, setCorrectAnswerOption] = useState(0)
    const [wrongAnswerOption, setWrongAnswerOption] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(localStorage.getItem('autoQuestionChanger') == 'true')
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [ableToSelectOption, setAbleToSelectOption] = useState(true)
    const [quizEnded, setQuizEnded] = useState(false)
    const [quizSlug, setQuizSlug] = useState(replaceFunction(window.location.pathname.split('/')[2], '-', '+'))
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [SFXAllowed, setSFXAllowed] = useState(localStorage.getItem('SFXAllowed') == 'true')
    const [SFXCorrect, setSFXCorrect] = useState(null)
    const [SFXWrong, setSFXWrong] = useState(null)
    const [SFXClick, setSFXClick] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [quizSlugReplacedWithHyphen, setQuizSlugReplacedWithHyphen] = useState()
    const [questionCounterForId] = useState(1)
    const [theme, setTheme] = useState('dark')
    const [its404, set404] = useState(false)

    const location = useLocation();

    const result = useRef(null)
    const quizDetailRef = useRef(null)
    // const recaptchaRef = useRef(null)
    
    const { enqueueSnackbar } = useSnackbar()

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
        setWhichSFXfile()
    }, [location]);

    const setWhichSFXfile = () => {
        switch (quizType) {
            case 'quiz':
                setSFXCorrect(new Audio('/static/sound/SFXCorrect.mp3'))
                setSFXWrong(new Audio('/static/sound/SFXWrong.mp3'))
                break
            case 'test':
                setSFXClick(new Audio('/static/sound/SFXClick.mp3'))
                break
        }
    }

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
            await axios.get(`/api/${quizType}View/?slug__iexact=${quizSlugReplacedWithHyphen}&limit=1&public=true`).then((res) => res.data.results[0])
                .then(async (quizData) => {
                    quizDetailRef.current = quizData
                    setQuiz(quizData)

                    sendCategoryAsInterest()
                    await getSuggestionsQuiz()
                    applyBackground()

                    let questionAPI
                    switch (quizType) {
                        case 'quiz':
                            questionAPI = 'questionsView'
                            break
                        case 'test':
                            questionAPI = 'questionsPointyView'
                            break
                    }

                    await axios.get(`/api/${questionAPI}/?quizKey=${quizData.id}&public=true`)
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

    const ImGifTextAnswerShowOrHide = (questionId, hideOrShow) => {
        const question = document.querySelectorAll('.quiz__container')[questionId - 1]
        if (hideOrShow == 'block') {
            question.querySelector('.quiz__answerText')?.classList.remove('answerHide')
            question.querySelector('.quiz__answerText')?.classList.add('answerShow')

            question.querySelector('.quiz__answerImGif')?.classList.remove('answerHide')
            question.querySelector('.quiz__answerImGif')?.classList.add('answerShow')
        }
        else if (hideOrShow == 'none') {
            question.querySelector('.quiz__answerText')?.classList.remove('answerShow')
            question.querySelector('.quiz__answerText')?.classList.add('answerHide')

            question.querySelector('.quiz__answerImGif')?.classList.remove('answerShow')
            question.querySelector('.quiz__answerImGif')?.classList.add('answerHide')
        }
    }

    const playSFX_click = () => {
        const SFXAllowed = localStorage.getItem('SFXAllowed')
        if (SFXAllowed === 'true') {
            if (SFXAllowed === 'true') {
                SFXClick.volume = .5
                SFXClick.play()
            }
        }
    }

    const playSFX = (whichSFX) => {
        const SFXAllowed = localStorage.getItem('SFXAllowed')
        
        if (SFXAllowed === 'true') {
            if (whichSFX == 'correct') {
                SFXCorrect.volume = .5
                SFXCorrect.play()
            } else if ( whichSFX == 'wrong') {
                SFXWrong.volume = .5
                SFXWrong.play()
            }
            
        }
    }

    const checkTheSelectedOption = (userSelection) => {
        let userChose = parseInt(userSelection.id.slice(-1))
        let correctAnswer = parseInt(questions[currentQuestionNumber - 1].answer)

        if (userChose == correctAnswer) {
            setCorrectAnswersCount(prev => prev + 1)
            playSFX('correct')
        } else {
            setWrongAnswerOption(parseInt(userChose))
            playSFX('wrong')
        }

        setCorrectAnswerOption(correctAnswer)
        ImGifTextAnswerShowOrHide(currentQuestionNumber, 'block')
    }

    const amountOfPauseCalculator = () => {
        let amountOfPause = 1500
        const currentQuestions = questions[currentQuestionNumber - 1]
        
        if (currentQuestions?.answer_text && currentQuestions?.answer_text !== '') {
            amountOfPause += 2000
        }
        if (currentQuestions?.answer_imGif && !(currentQuestions?.answer_imGif?.includes('NotExist'))) {
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

    const halfTheQuestions = Math.floor(questions.length / 2)

    const ifHalfQuizAddView = () => {
        if (currentQuestionNumber == halfTheQuestions) {  // && userProfile.userDetail
            AddView(`${quizType}View`, quizDetailRef.current.id)
        }
    }

    const selectedOption = async (props) => {
        switch (quizType) {
            case 'quiz':
                if (ableToSelectOption) {
                    // setTimeout(() => {
                    //     document.querySelector('.quiz__questions').scrollIntoView()
                    // }, 300)

                    setAbleToSelectOption(false)
                    setAbleToGoNext(true)
                    makeEveryOptionLowOpacity('low')
                    checkTheSelectedOption(props.target)
                    ifHalfQuizAddView()

                    if (autoQuestionChanger) {
                        setTimeout(() => {
                            goNextQuestionOrEndTheQuiz()
                        }, amountOfPauseCalculator())
                    } else {
                        setTimeout(() => {
                            if (document.querySelector('.quiz__container')?.style.transform == 'translate(0rem)' && !(isItDesktop())) {
                                enqueueSnackbar('برای تغییر سوال، صفحه را بکشید', { variant: 'info', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                        }, 5000)
                    }
                }
                break
            case 'test':
                playSFX_click()
                setWrongAnswerOption(parseInt(props.target.id.slice(-1)))
                takeSelectedOptionValue(props.target)

                if (autoQuestionChanger) {
                    setTimeout(() => {
                        goNextQuestionOrEndTheQuiz()
                    }, amountOfPauseCalculator())
                } else {
                    setAbleToGoNext(true)

                    setTimeout(() => {
                        if (document.querySelector('.quiz__container').style.transform == 'translate(0rem)' && !(isItDesktop())) {
                            TutorialForHowToChangeTheQuestion()
                        }
                    }, 5000)
                }
                break
        }
    }

    const restartTheStateOfQuestion = () => {
        ImGifTextAnswerShowOrHide(currentQuestionNumber, 'none')
        setAbleToGoNext(false)
        setCorrectAnswerOption(0)
        setWrongAnswerOption(0)
        makeEveryOptionLowOpacity('high')

        setTimeout(() => {
            setAbleToSelectOption(true)
        }, 1300)
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
                switch (quizType) {
                    case 'quiz':
                        localStorage.setItem('qt', 'quiz')
                        localStorage.setItem('qr', JSON.stringify({ ql: questions?.length, qc: correctAnswersCount }))
                        break
                    case 'test':
                        localStorage.setItem('qt', 'test')
                        localStorage.setItem('qr', calculateThePoints())
                        break
                }
                result.current.click()
            }
        }
    }

    const returnQuiz = (question) => {
        switch (quizType) {
            case 'quiz':
                return <Trivia
                    question={question}
                    selectedOption={selectedOption}
                    questionCounterForId={questionCounterForId}
                    ableToSelectOption={ableToSelectOption}
                    wrongAnswerOption={wrongAnswerOption}
                    correctAnswerOption={correctAnswerOption}
                />

            case 'test':
                return <Test
                    question={question}
                    selectedOption={selectedOption}
                />
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

                        {returnQuiz(question)}

                        {
                            quizType == 'quiz' && question?.answer_text &&
                            <div className={`quiz__answerText py-4 px-8 answerHide text-right ${theme == 'light' ? 'bg-[#ffffff82]' : 'bg-[#0000007c]'} backdrop-blur-xl mt-4 rounded-lg`}>
                                {answerOfQuestionIfExistShow(question)}
                            </div>
                        }

                        {
                            quizType == 'quiz' && !(question.answer_imGif.includes('NotExist.jpg')) &&
                            <div className={`quiz__answerImGif answerHide quiz__answerImGif ${theme == 'light' ? 'bg-[#ffffff82]' : 'bg-[#0000007c]'} backdrop-blur-xl mt-4 rounded-lg`}>
                                {gifAnswerOfQuestionIfExistShow(question)}
                            </div>
                        }
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

    const calculateThePoints = () => {
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

    const getSuggestionsQuiz = async () => {
        const category = quizDetailRef.current.categoryKey.id
        const subCategory = quizDetailRef.current.subCategory

        const quiz = await axios.get(`/api/quizView/?subCategory__iexact=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
        const pointy = await axios.get(`/api/testView/?subCategory__iexact=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
        let content = quiz.data.results.concat(pointy.data.results)

        if (content.length != 8) {
            const quizByCategory = await axios.get(`/api/quizView/?category__exact=${category}&limit=8&public=true`)
            const pointyByCategory = await axios.get(`/api/testView/?category__exact=${category}&limit=8&public=true`)
            content = content.concat(quizByCategory.data.results.concat(pointyByCategory.data.results))
        }

        setSuggestionQuizzes(content.slice(0, 8))
    }

    const currentUrl = () => {
        return `https://www.quizzland.net/${quizType}/${replaceFunction(quizSlug, ' ', '-')}`
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
                {quiz?.title &&
                    <StickyShareButtons
                        config={{
                            alignment: 'left',
                            color: 'social',
                            enabled: true,
                            font_size: 16,
                            hide_desktop: false,
                            labels: 'counts',
                            language: 'en',
                            min_count: 10,
                            networks: [
                                'whatsapp',
                                'telegram',
                                'twitter',
                                'sms',
                                'sharethis',
                            ],
                            padding: 9,
                            radius: 15,
                            show_total: true,
                            show_mobile: true,
                            show_toggle: false,
                            size: 38,
                            top: 450,
                            url: currentUrl()
                        }}
                    />
                }

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

                            <QuizHeader quizDetail={quiz} contentLoaded={contentLoaded} questionsLength={questions?.length} autoQuestionChanger={autoQuestionChanger} changeAutoQuestionChanger={changeAutoQuestionChanger} SFXAllowed={SFXAllowed} SFXController={SFXController} />

                            {quiz?.id && <LikeCommentButton quizId={quiz?.id} quizType={quizType} />}

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
                                    {
                                        quizType == 'test' &&
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
                                    }
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

                            <div className='mx-4 mt-10'>
                                <h3 className='flex items-center justify-center mb-5 text-white quiz__tags__title beforeAfterDecor'>کوییز های مشابه</h3>

                                <ul className="flex flex-col md:flex-row flex-wrap md:w-[70rem] mx-auto my-10">
                                    {
                                        suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle={'bg'} />
                                    }
                                </ul>
                            </div>


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
                                            <Link to='/sort?s=trend'>
                                                مشاهده بهترین کوییز های این ماه
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

export default Quiz;