import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Helmet } from "react-helmet";
import { StickyShareButtons } from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';
import Header from './header'

import { log, replaceFunction, makeDatePublishFormatForQuizDetail, isItDesktop, isItMobile, isItIPad } from './base'
import LoadingScreen from './loadingScreen'
import QuizContainer from './quizContainer'
import SkeletonLoading from './skeletonLoading'

const logo = '/static/img/Q-small.png'

let quiz = 'null'
let advertPos = 0
let quizCounter = 0

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [correctAnswersCounter, setCorrectAnswersCounter] = useState(0)
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
    const [quizThumbnail, setQuizThumbnail] = useState()
    const [SFXAllowed, setSFXAllowed] = useState()
    const [showQuestionChangingHelper, setShowQuestionChangingHelper] = useState(false)
    const [showingAdverts, setShowingAdverts] = useState(false)

    const result = useRef(null)

    const quizTitleReplacedWithHyphen = replaceFunction(quizTitle, '-', '+')
    const SFXCorrect = new Audio('../../static/sound/SFXCorrect.mp3')
    const SFXWrong = new Audio('../../static/sound/SFXWrong.mp3')
    const speakerIconOn = '/static/img/speakerOn.png'
    const speakerIconOff = '/static/img/speakerOff.png'

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
    }, [])

    useEffect(() => {
        quizChangeDetector()
    })

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const SFXLocalStorage = () => {
        if (localStorage.getItem('SFXAllowed')) {
            setSFXAllowed(localStorage.getItem('SFXAllowed'))
        } else {
            localStorage.setItem('SFXAllowed', 'true')
            setSFXAllowed('true')
        }
    }

    const quizChangeDetector = () => {
        (function (history) {

            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

            setQuizTitle(replaceFunction(window.location.pathname.split('/')[2], '-', '+'))

        })(window.history);
    }

    const setBackground = () => {
        document.getElementById('html').style = `background: url('${quiz.background}') center/cover no-repeat fixed !important`
    }

    const grabData = () => {
        const grabQuiz = async () => {
            const quizDB = await axiosLimited.get(`/dbAPI/new_quiz/?title__iexact=${quizTitleReplacedWithHyphen}&limit=1`)
            quiz = quizDB.data.results[0]
            return quiz
        }

        const grabQuestions = async () => {
            return await axiosLimited.get(`/dbAPI/questions/?title__iexact=${quizTitleReplacedWithHyphen}`)
        }

        grabQuiz().then((quiz) => {
            try {
                setQuizThumbnail(quiz.thumbnail)
                sendCategoryAsInterest(quiz.subCategory)
                setBackground()
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
            return <p className='quiz__question tx-al-c'> {question} </p>
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
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 48
    }
    else if (isItMobile()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 23.5
    }


    const goNextQuestionOrEndTheQuiz = () => {
        if (ableToGoNext || autoQuestionChanger || showingAdverts) {
            setShowQuestionChangingHelper('never')
            if (currentQuestionNumber !== questions.length) {
                restartTheStateOfQuestion()
                plusOneToTotalAnsweredQuestions()
                setCurrentMoveOfQuestions(prev => prev - sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

                log('go next...')
                
                advertPos -= 48
                document.querySelector('.adverts_between').style.transform = `translate(${advertPos}rem)`

                if (!(window.navigator.userAgent.includes('Windows'))) {  // if mobile, scroll to top
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

    let questionCounterForId = 0
    const questionOptionsCheckBetweenStringOrImg = (question) => {
        questionCounterForId += 1
        if (question.option_1st) {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__text' action="">
                        {question.option_1st !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-1`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> {question.option_1st} </label> </React.Fragment>}
                        {question.option_2nd !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-2`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> {question.option_2nd} </label> </React.Fragment>}
                        {question.option_3rd !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-3`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> {question.option_3rd} </label> </React.Fragment>}
                        {question.option_4th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-4`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> {question.option_4th} </label> </React.Fragment>}
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__img grid flex-jc-c pos-rel' data={question.answer} action="">
                        {!(question.option_img_1st.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-1`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> <img className="quiz__imgOption" src={question.option_img_1st} alt={question.title} title={question.title} loading='lazy' /> </label> </React.Fragment>}
                        {!(question.option_img_2nd.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-2`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> <img className="quiz__imgOption" src={question.option_img_2nd} alt={question.title} title={question.title} loading='lazy' /> </label> </React.Fragment>}
                        {!(question.option_img_3rd.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-3`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> <img className="quiz__imgOption" src={question.option_img_3rd} alt={question.title} title={question.title} loading='lazy' /> </label> </React.Fragment>}
                        {!(question.option_img_4th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-4`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!ableToSelectOption ? 'pointerOff' : ''}`} id={`${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> <img className="quiz__imgOption" src={question.option_img_4th} alt={question.title} title={question.title} loading='lazy' /> </label> </React.Fragment>}
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
            return <img src={question.answer_imGif} alt={question.title} title={question.title} />
        }
    }

    const isSafari = navigator.userAgent.indexOf("Chrome") != -1 === false && navigator.userAgent.indexOf("Chrome") != -1

    let quizCounter = 0
    
    const quizQuestions = () => {

        return (
            questions.map(question => {
                quizCounter += 1
                log(quizCounter)

                if (quizCounter == 2) {
                    log('adverts')
                    // setShowingAdverts(true)  // causing error

                    return (
                        <React.Fragment>
                            <div className='adverts_between flex flex-jc-c' id='mediaad-cpLp'></div>
                            
                            <div className={`quiz__questionChanger__container pos-abs ${currentQuestionNumber == 2 ? 'fadeIn' : 'fadeOut'}`}>
                                <button onClick={autoQuestionChanger ? () => { return } : goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger pos-abs quiz__questionChanger__next btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                            </div>
                        </React.Fragment>
                        
                    )
                }

                else {
                    return (
                        <div style={{ transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)` }} className="quiz__container pos-rel darkGls">

                            {questionShowIfNotNull(question.question)}

                            {!question.question_img.includes('NotExist') && <img className="quiz__imgQuestion" src={question.question_img} alt={question.title} title={question.title} />}

                            {questionOptionsCheckBetweenStringOrImg(question)}

                            <div className={`quiz__answerText answerHide tx-al-r`}>
                                {answerOfQuestionIfExistShow(question)}
                            </div>

                            <div className={`quiz__answerImGif answerHide`} id='quiz__answerImGif'>
                                {gifAnswerOfQuestionIfExistShow(question)}
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    const quizQuestionsForSafari = () => {
        return (
            questions.map(question => {
                return (
                    <div style={{ left: `${currentMoveOfQuestions}rem` }} className="quiz__container pos-rel darkGls">
                        {questionShowIfNotNull(question.question)}

                        {!question.question_img.includes('NotExist') && <img className="quiz__imgQuestion" src={question.question_img} alt={question.title} title={question.title} />} {/* loading='lazy' */}

                        {questionOptionsCheckBetweenStringOrImg(question)}

                        <div className={`quiz__answerText answerHide tx-al-r`}>
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
        if (quiz !== 'null') {
            const tags = quiz.tags
            const splittedTags = tags.split('،')
            return (
                splittedTags.map(tag => {
                    return <li><h2><Link rel='tag' to={`/search?s=${replaceFunction(tag, ' ', '+')}`} >{tag}</Link></h2></li>
                })
            )
        }
    }

    const getSuggestionsQuiz = (subCategory) => {
        axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8`)
            .then((res) => { setSuggestionQuizzes(res.data.results) })
    }

    const SFXController = () => {
        const changeToThis = SFXAllowed === 'true' ? 'false' : 'true'
        setSFXAllowed(changeToThis)
        localStorage.setItem('SFXAllowed', changeToThis)
    }

    const currentUrl = () => {
        if (quiz.title) {
            return `https://www.quizzland.net/quiz/${replaceFunction(quiz.title, ' ', '-')}`
        }
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

            <Header
                colorOfHeader='header__white'
                linkType='Hot'
            />

            <Helmet>
                <title>{`کوییزلند | کوییز ${replaceFunction(decodeURI(quizTitle), '+', ' ')}`}</title>

                <link rel="canonical" href={currentUrl()} />

                <meta name="description" content={`با ${questions.length} سوال جذاب و فان. ببین میتونی بالای 80% بزنی | ${quiz.title} ${quiz.subCategory} کوییز از`} />
                <meta name="keywords" content="کوییز, کوییزلند" />
                <meta name="msapplication-TileImage" content={quizThumbnail} />
                <meta property="og:site_name" content="کوییزلند" />
                <meta property="og:title" content={quiz.title} />
                <meta property="og:description" content={`با ${questions.length} سوال جذاب و فان. ببین میتونی بالای 80% بزنی | ${quiz.title} ${quiz.subCategory} کوییز از`} />
                <meta property="og:image" content={quizThumbnail} />
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
                        "headline": "${quiz.title}",
                        "image": [
                            "${quizThumbnail}",
                            "${quiz.background}"
                         ],
                        "datePublished": "${quiz.publish}",
                        "dateModified": "${quiz.publish}",
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

            {quiz.title &&
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
                        url: currentUrl()
                    }}
                />
            }

            <div className={`${quizEnded ? 'fadeIn' : 'fadeOut'}`}>
                <div className={'loadingScreen pos-fix flex flex-jc-c flex-ai-c'}></div>
                <div className='countingResult loadingScreen pos-fix flex flex-jc-c flex-ai-c'>
                    ___ در حال محاسبه نتیجه کوییز___
                </div>
            </div>

            <div className='SFXController pos-abs' onClick={() => { SFXController() }} >
                <button type="button">
                    <img src={SFXAllowed === 'true' ? speakerIconOn : speakerIconOff} alt="کوییزلند ‌| Quizzland" />
                </button>
            </div>

            <div className="quiz__head pos-rel tx-al-r" id="quiz__head">
                {
                    !(contentLoaded) &&
                    <div className='flex flex-jc-c flex-ai-c'>
                        <div className={`skeletonLoading skeletonLoading__quizTitle tx-al-c wrapper-sm`}></div>
                    </div>
                }

                <div className="tx-al-c">
                    <h1>{quiz.title}</h1>
                </div>

                <div className="quiz__detail flex flex-jc-c flex-ai-c">
                    {
                        !(contentLoaded) &&
                        <div className={`flex`} style={{height: '8rem'}}>
                            <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                            <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                        </div>
                    }
                    {
                        contentLoaded &&
                        <React.Fragment>
                            <h5>تعداد سوال ها: {questions.length}</h5>
                            <h5>{makeDatePublishFormatForQuizDetail(quiz.publish)}</h5>
                        </React.Fragment>
                    }
                </div>

                {
                    contentLoaded &&
                    <div onClick={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch pos-rel center flex flex-jc-c flex-ai-c`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می‌شوید'>
                        <h6>تغییر خودکار</h6>
                        <button className="quiz__autoQuestionChangerSwitch__btn btn">
                            <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : ''} pos-rel`}></div>
                        </button>
                    </div>
                }

            </div>

            {isItDesktop() &&
                <hr className='divider'></hr>
            }

            {
                contentLoaded &&
                <div className={`quiz__questionCounter pos-rel flex flex-jc-c flex-ai-c`}>
                    <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                    سوال شماره
                </div>
            }

            <div className={`tx-al-c ${showQuestionChangingHelper === true ? 'fadeIn' : 'fadeOut'}`}>
                <h5>برای رفتن به سوال بعدی از راست به چپ بکشید!</h5>
            </div>

            <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions pos-rel flex flex-jc-c tx-al-c`} tag="quiz">
                <div className={`quiz__hider flex pos-rel`}>
                    {
                        !(contentLoaded) &&
                        <div className={`skeletonLoading skeletonLoading__quizQuestion tx-al-c wrapper-sm`}></div>
                    }

                    {
                        isSafari ? quizQuestionsForSafari() : quizQuestions()
                    }

                    {
                        contentLoaded && isItDesktop() &&
                        <div className={`quiz__questionChanger__container pos-abs ${ableToGoNext ? 'fadeIn' : 'fadeOut'}`}>
                            <button onClick={autoQuestionChanger ? () => { return } : goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger pos-abs quiz__questionChanger__next btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                        </div>
                    }
                </div>
            </div>

            <div>
                <h7 className='quiz__tags__title flex flex-jc-c flex-ai-c beforeAfterDecor'>تگ های کوییز</h7>
                <ul className='quiz__tags flex flex-jc-c flex-ai-c'>
                    {showTheTagsIfNotNull()}
                </ul>
            </div>

            {/* Adverts */}
            <div className='adverts_center' id='mediaad-bNpr'></div>

            <div className='space-med'>
                <h7 className='quiz__tags__title flex flex-jc-c flex-ai-c beforeAfterDecor'>کوییز های مشابه</h7>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex wrapper-med">
                    {
                        suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                    }
                </ul>
            </div>


            <h7 className='quiz__tags__title flex flex-jc-c flex-ai-c beforeAfterDecor'>مطالب پیشنهادی</h7>

            {/* Adverts */}
            <div className='adverts_center' id='mediaad-dESu'></div>

            <Link
                ref={result} className='noVis'
                to='/result/s'
            ></Link>

        </React.Fragment>
    );
}

export default Quiz;