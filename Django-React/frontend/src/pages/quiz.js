import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import { notification } from 'antd';
import { Helmet } from "react-helmet";
import { StickyShareButtons } from 'sharethis-reactjs';
import { Switch } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import axios from 'axios'
import Header from '../components/header'
import AddView from '../components/addView';

import { log, replaceFunction, makeDatePublishFormatForQuizDetail, isItDesktop, isItMobile, isItIPad } from '../components/base'
import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import SkeletonLoading from '../components/skeletonLoading';

const logo = '/static/img/Q-small.png'

let quiz = 'null'
let advertPos = 0
let quizCounter = 0

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [correctAnswerOption, setCorrectAnswerOption] = useState(0)
    const [wrongAnswerOption, setWrongAnswerOption] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [ableToSelectOption, setAbleToSelectOption] = useState(true)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState()
    const [quizTitle, setQuizTitle] = useState(window.document.URL.split('/')[4])
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [SFXAllowed, setSFXAllowed] = useState()
    const [SFXCorrect, setSFXCorrect] = useState(null)
    const [SFXWrong, setSFXWrong] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [quizTitleReplacedWithHyphen, setQuizTitleReplacedWithHyphen] = useState()

    const [score, setScore] = useState(0)
    const [resultGif, setResultGif] = useState()
    const [fanName, setFanName] = useState()
    const [subCategory, setSubCategory] = useState()
    const [title, setTitle] = useState()
    const [id, setId] = useState()

    const result = useRef(null)

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
        setSFXCorrect(new Audio('/static/sound/SFXCorrect.mp3'))
        setSFXWrong(new Audio('/static/sound/SFXWrong.mp3'))
    }, [quizTitle])

    useEffect(() => {
        quizChangeDetector()
    })

    const SFXLocalStorage = () => {
        if (localStorage.getItem('SFXAllowed')) {
            setSFXAllowed(localStorage.getItem('SFXAllowed'))
        } else {
            localStorage.setItem('SFXAllowed', 'true')
            setSFXAllowed('true')
        }
    }

    const openNotification = () => {
        notification.open({
            message: 'راهنمایی برای تغییر سؤال',
            description:
            'برای تغییر سوال، صفحه را بکشید.',
            duration: 0,
            style: {
                'font-size': '25px',
                'font-weight': '600',
                'box-shadow': '0 0 20px #b52633',
                'direction': 'rtl',
                'padding-right': '4rem',
            },
            className: 'rounded-lg'
        });
    };

    const applyBackground = (background) => {
        document.querySelector('html').style = `background: url('${background}') center/cover no-repeat fixed !important`
    }

    const quizChangeDetector = () => {
        (function (history) {
            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

            const title = replaceFunction(window.location.pathname.split('/')[2], '-', '+')
            setQuizTitle(title)
            setQuizTitleReplacedWithHyphen(title)
        })(window.history);
    }

    const grabData = async () => {
        quizTitleReplacedWithHyphen && 
        await axios.get(`/api/quiz_new/?slug__iexact=${quizTitleReplacedWithHyphen}&limit=1&public=true`).then((res) => res.data.results[0])
            .then(async (quizData) => {
                try {
                    AddView('quiz_new', quizData.id)
                    sendCategoryAsInterest(quizData.subCategory)
                    getSuggestionsQuiz(quizData.subCategory)
                    applyBackground(quizData.background)
                    setQuiz(quizData)
    
                    await axios.get(`/api/questions/?quizKey=${quizData.id}&public=true`)
                        .then((questionData) => {
                            setQuestions(questionData.data)
                            setContentLoaded(true)
                        })
                }
                catch (e) {
                    log(e)
                    setTimeout(() => {
                        window.location.href = '/404'
                    }, 5000)
                }
            })
    }

    const calculateTheResultScore = () => {
        const questionsCounter = questions?.length
        if (questionsCounter && correctAnswersCount) {
            const score = ((correctAnswersCount / questionsCounter) * 100).toFixed(0)
            setScore(parseInt(score))
            return score
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
            setCorrectAnswersCount(prev => prev + 1)
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
        if (currentQuestions.answer_text !== '') {
            amountOfPause += 2000
        }
        if (!(currentQuestions.answer_imGif.includes('NotExist'))) {
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
            // setTimeout(() => {
            //     document.querySelector('.quiz__questions').scrollIntoView()
            // }, 300)

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
                    if (document.querySelector('.quiz__container').style.transform == 'translate(0rem)' && !(isItDesktop())) {
                        openNotification()
                    }
                }, 5000)
            }
        }
    }

    const questionShowIfNotNull = (question) => {
        if (question !== null) {
            return <p className='text-center p-3 backdrop-blur-2xl rounded-xl text-lg md:text-[1.5rem]'> {question} </p>
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

    if (isItDesktop() || isItIPad()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 34.2
    }
    else if (isItMobile()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 27.7
    }

    const detailOfResult = (score) => {
        if (score > 80){
            setResultGif(quiz?.GIF100)
        }
        else if (score > 60){
            setResultGif(quiz?.GIF80)
        }
        else if (score > 40){
            setResultGif(quiz?.GIF60)
        }
        else if (score > 20){
            setResultGif(quiz?.GIF40)
        }
        else if (score >= 0){
            setResultGif(quiz?.GIF20)
        }
        else {
            setResultGif(undefined)
        }
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
                setTimeout(() => {
                    try {
                        const score = calculateTheResultScore()
                        detailOfResult(score)
                        setFanName(quiz?.fan_name)
                        setSubCategory(quiz?.subCategory)
                        setTitle(quiz?.title)
                        setId(quiz?.id)

                        result.current.click()
                    } catch (err) {
                        log(err)
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
                <div className="flex justify-center">
                    <form className='quiz__options w-[100%] md:grid md:grid-cols-2 space-y-3 text-[5vw] md:text-[1.6vw] justify-center' action="">
                        {question.option_1st !== ('') &&
                            <> <input
                                onClick={selectedOption}
                                type="radio"
                                name="answer" className='absolute opacity-0'
                                id={`${questionCounterForId}-1`}
                            />
                                <label
                                    className={`quiz__options__textLabel backdrop-blur-xl
                                            border border-[#ffffff30]
                                            p-2 block max-w-[100%] md:max-width-[14rem]
                                            md:h-[auto] md:pr-4 md:m-2 rounded-lg
                                            cursor-pointer text-lg md:text-[1.3rem]
                                            hover:border-red-300
                                            ${correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''}
                                            ${wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''}
                                            ${!ableToSelectOption ? 'pointer-events-none' : ''}
                                        `}
                                    id={`${questionCounterForId}-1`}
                                    htmlFor={`${questionCounterForId}-1`}
                                >
                                    {question.option_1st}
                                </label>
                            </>
                        }
                        {question.option_2nd !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-2`} /> <label className={`quiz__options__textLabel text-lg md:text-[1.3rem] backdrop-blur-xl border border-[#ffffff30] hover:border-red-300 p-2 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-lg cursor-pointer ${correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> {question.option_2nd} </label> </>}
                        {question.option_3rd !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-3`} /> <label className={`quiz__options__textLabel text-lg md:text-[1.3rem] backdrop-blur-xl border border-[#ffffff30] hover:border-red-300 p-2 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-lg cursor-pointer ${correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> {question.option_3rd} </label> </>}
                        {question.option_4th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-4`} /> <label className={`quiz__options__textLabel text-lg md:text-[1.3rem] backdrop-blur-xl border border-[#ffffff30] hover:border-red-300 p-2 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-lg cursor-pointer ${correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> {question.option_4th} </label> </>}
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex justify-center">
                    <form className='relative grid justify-center grid-cols-2 pt-4 quiz_options md:flex md:space-x-3 flex-wrap' data={question.answer} action="">
                        {!(question.option_img_1st.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-1`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> <LazyLoadImage src={question.option_img_1st} width={520} height={624} alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_2nd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-2`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> <LazyLoadImage src={question.option_img_2nd} width={520} height={624} alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_3rd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-3`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> <LazyLoadImage src={question.option_img_3rd} width={520} height={624} alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_4th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-4`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> <LazyLoadImage src={question.option_img_4th} width={520} height={624} alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
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
        return <LazyLoadImage
            src={question.answer_imGif}
            width={1366}
            height={768}
            className='object-contain object-top m-auto'
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
                            p-[0.1rem] transition-all duration-1000 ease-in-out
                        `}
                    >

                        {/* <span className='questionId block right-[-2rem] top-2 z-10 absolute text-[3rem]'>
                            {questionCounterForId}
                        </span> */}

                        <div>
                            {questionShowIfNotNull(question.question)}

                            <div className='mt-3 w-[22rem] md:w-[29rem]'>
                                {!question.question_img.includes('NotExist') &&
                                    <LazyLoadImage
                                        src={question.question_img}
                                        width={1366}
                                        height={768}
                                        alt={question.title}
                                        className='object-cover object-top rounded-xl'
                                        title={question.title}
                                    />}
                            </div>
                        </div>

                        {questionOptionsCheckBetweenStringOrImg(question)}

                        {
                            question?.answer_text &&
                            <div className={`quiz__answerText answerHide text-right bg-[#0000007c] backdrop-blur-xl mt-4 rounded-lg`}>
                                {answerOfQuestionIfExistShow(question)}
                            </div>
                        }

                        {
                            !(question.answer_imGif.includes('NotExist.jpg')) &&
                            <div className={`quiz__answerImGif answerHide`} id='quiz__answerImGif bg-[#0000007c] backdrop-blur-xl mt-4 rounded-lg'>
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

    const showTheTagsIfNotNull = () => {
        const splittedTags = quiz.tags.split('،')
        return (
            splittedTags.map(tag => {
                return (
                    <li key={tag} className='px-3 py-1 text-sm rounded-lg'>
                        <h4>
                            <Link
                                to={`/search?q=${replaceFunction(tag, ' ', '+')}`}
                                rel='tag'
                            >
                                    {tag}
                            </Link>
                        </h4>
                    </li>
                )
            })
        )
    }

    const getSuggestionsQuiz = async (subCategory) => {
        await axios.get(`/api/quiz_new/?subCategory__icontains=${subCategory && replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
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
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header/>

            <Helmet>
                <title>{`کوییزلند | کوییز ${replaceFunction(decodeURI(quizTitle), '+', ' ')}`}</title>

                <link rel="canonical" href={currentUrl()} />

                <meta name="description" content={`با ${questions?.length} سوال جذاب و فان. ببین میتونی بالای 80% بزنی | ${quiz?.title} ${quiz?.subCategory} کوییز از`} />
                <meta name="keywords" content="کوییز, کوییزلند" />
                <meta name="msapplication-TileImage" content={quiz?.thumbnail} />
                <meta property="og:site_name" content="کوییزلند" />
                <meta property="og:title" content={quiz?.title} />
                <meta property="og:description" content={`با ${questions?.length} سوال جذاب و فان. ببین میتونی بالای 80% بزنی | ${quiz?.title} ${quiz?.subCategory} کوییز از`} />
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
                        "headline": "${quiz?.title}",
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

            <div className={`
                fixed left-0 backdrop-blur-3xl backdrop-brightness-75
                top-0 w-screen h-screen z-20 ${quizEnded ? 'fadeIn' : 'fadeOut'}
                flex flex-col items-center justify-center 
            `}>
                <div>
                    <div className='bg-red-800 w-10 h-10 rounded-full absolute animate-ping'></div>
                    <div className='bg-red-800 w-10 h-10 rounded-full'></div>
                </div>
                <div className='mt-5'>
                    <h2>
                        در حال محاسبه نتیجه کوییز
                    </h2>
                </div>
            </div>

            <div className="relative text-right quiz__head backdrop-blur-2xl p-4 w-[21rem] md:w-[33rem] left-1/2 translate-x-[-50%] bg-[#0000001a] rounded-xl" id="quiz__head">
                {
                    !(contentLoaded) &&
                    <div className='flex justify-center items-center'>
                        <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizTitle'></div>
                    </div>
                }

                <div className="text-center flex justify-center mb-4">
                    <h1 className='md:max-w-[21rem] max-w-[19rem]'>
                        {quiz?.title}
                    </h1>
                </div>

                <div className="flex justify-center quiz__detail items-center">
                    {
                        !(contentLoaded) &&
                        <div className='flex space-x-5'>
                            <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                            <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                        </div>
                    }
                    {
                        contentLoaded &&
                        <div className='flex space-x-6 text-lg'>
                            <h5>{makeDatePublishFormatForQuizDetail(quiz?.publish)}</h5>
                            <h5>تعداد سوال ها: {questions?.length}</h5>
                        </div>
                    }
                </div>

                {
                    contentLoaded &&
                    <div className='flex space-x-5 translate-x-[-3rem]'>
                        <div onClick={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch mt-5 hover:cursor-pointer relative center flex justify-center items-center`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                            {/* <button className="quiz__autoQuestionChangerSwitch__btn btn">
                                <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : ''} relative`}></div>
                            </button> */}
                            <div className='mt-3'>
                                <Switch
                                    checkedChildren='خودکار'
                                    unCheckedChildren='دستی'
                                    className={`${autoQuestionChanger ? 'bg-red-800' : 'bg-zinc-500'}`}
                                    onChange={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }}
                                    title='تغییر سوال: با انتخاب گزینه، در صورت خودکار بودن، پس از حداقل 1.5 حداکثر 5.5 ثانیه به سوال بعدی منتقل می شوید'
                                />
                            </div>
                        </div>
                        <div onClick={() => { SFXController() }} className={`mt-5 hover:cursor-pointer relative center items-center`} title='فرض صدا های پس از پاسخ به سوال'>
                            <div className='mt-3'>
                                <Switch
                                    checkedChildren='فرض صدا'
                                    uncheckedChildren='فرض صدا'
                                    className={`${localStorage.getItem('SFXAllowed') === 'true' ? 'bg-red-800' : 'bg-zinc-500'}`}
                                    onChange={() => {SFXController()}}
                                    title='فرض صدا های پس از پاسخ به سوال'
                                />
                            </div>
                        </div>
                    </div>
                }

            </div>

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
                </div>
            }

            {/* {isItDesktop() &&
                <hr className='divider'></hr>
            } */}

            {/* {
                contentLoaded &&
                <div className={`quiz__questionCounter relative flex justify-center items-center`}>
                    <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                    سوال شماره
                </div>
            } */}

            <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions h-full mb-4 relative flex justify-center text-center mt-12 md:mt-0`} tag="quiz">
                <div className={`quiz__hider mt-5 flex relative`}>
                    {
                        !(contentLoaded) &&
                        <div className='mt-5 overflow-hidden shadow-lg skeletonLoading skeletonLoading__quizQuestion shadow-zinc-800 rounded-xl'></div>
                    }

                    {
                        isSafari ? quizQuestions('safari') : quizQuestions('otherBrowser')
                    }
                </div>
            </div>

            <div>
                <h7 className='flex justify-center quiz__tags__title items-center beforeAfterDecor'>تگ های کوییز</h7>
                <ul className='flex flex-wrap justify-center my-5 space-x-3 space-y-2 space-x-reverse quiz__tags items-baseline'>
                    {quiz && showTheTagsIfNotNull()}
                </ul>
            </div>

            {/* Adverts */}
            <div className='adverts_center' id='mediaad-bNpr'></div>

            <div className='space-med'>
                <h7 className='flex justify-center quiz__tags__title items-center beforeAfterDecor mb-5'>کوییز های مشابه</h7>

                {SkeletonLoading(contentLoaded)}

                <ul className="flex flex-wrap align-baseline">
                    {
                        suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                    }
                </ul>
            </div>


            {/* <h7 className='flex justify-center quiz__tags__title items-center beforeAfterDecor'>مطالب پیشنهادی</h7> */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-dESu'></div> */}

            <Link
                to={`/result_quiz?s=${score}&qc=${questions.length}&cc=${correctAnswersCount}&fn=${fanName}&sc=${subCategory}&qt=${title}&id=${id}&rg=${resultGif}`}
                ref={result}
                className='noVis'
            >
            </Link>

        </React.Fragment>
    );
}

export default Quiz;