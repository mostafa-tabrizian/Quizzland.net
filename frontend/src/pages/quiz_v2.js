import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import Skeleton from '@mui/material/Skeleton';
import UserStore from '../store/userStore';

import axios from '../components/axiosApi'
import { log, getTheme, replaceFunction, isItDesktop, isItMobile, isItIPad } from '../components/base'
import Trivia from '../components/quiz/trivia'

const LoadingScreen = React.lazy(() => import('../components/loadingScreen'))
const QuizHeader = React.lazy(() => import('../components/quiz/quizHeader'))
const LikeCommentButton = React.lazy(() => import('../components/user/likeCommentButton'))
import axiosInstance from '../components/axiosAuthApi';
import LoginPrompt from '../components/auth/_prompt';

const logo = '/static/img/Q-small.png'

const Quiz_V2 = (props) => {
    const [questions, setQuestions] = useState([])
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [correctAnswerOption, setCorrectAnswerOption] = useState(0)
    const [wrongAnswerOption, setWrongAnswerOption] = useState(0)
    const [ableToSelectOption, setAbleToSelectOption] = useState(true)
    const [quizSlug, setQuizSlug] = useState(replaceFunction(window.location.pathname.split('/')[2], '-', '+'))
    const [contentLoaded, setContentLoaded] = useState(false)
    // const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [SFXAllowed, setSFXAllowed] = useState(localStorage.getItem('SFXAllowed') == 'true')
    const [SFXCorrect, setSFXCorrect] = useState(null)
    const [SFXWrong, setSFXWrong] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [quizSlugReplacedWithHyphen, setQuizSlugReplacedWithHyphen] = useState()
    const [questionCounterForId] = useState(1)
    const [theme, setTheme] = useState('dark')
    const [its404, set404] = useState(false)
    const [joinPaper, setJoinPaper] = useState(true)
    const [quizEndStatue, setQuizEndStatue] = useState(false)
    const [resultGif, setResultGif] = useState(null)
    const [resultMessage, setResultMessage] = useState(null)
    const [lifeline5050, setLifeline5050] = useState(false)
    const [lifelineSkipQuestion, setLifelineSkipQuestion] = useState(false)
    const [lifelinePollAudience, setLifelinePollAudience] = useState(false)
    const [answer, setAnswer] = useState(null)

    const location = useLocation();

    const quizDetailRef = useRef(null)
    const questionRef = useRef(null)
    // const recaptchaRef = useRef(null)

    const [userProfile, userActions] = UserStore()

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        scrollToTop()
    }, quizSlug)

    useEffect(() => {
        fetchQuiz()
    }, quizSlugReplacedWithHyphen)

    useEffect(() => {
        const question_background = document.querySelectorAll('#question_background')
        question_background && (question_background.forEach((q) => q.style = `background: ${quiz?.theme}`))

        const allLabels = document.querySelectorAll('.pollAudience')
        allLabels && allLabels.forEach((q) => q.style.setProperty('--color', `${quiz?.theme}`))
    })

    useEffect(() => {
        document.querySelector('#join').style = `background: black`
        const slug = replaceFunction(window.location.pathname.split('/')[2], '-', '+')
        setQuizSlug(slug)
        setQuizSlugReplacedWithHyphen(slug)
        const theme = getTheme()
        setTheme(theme)
        setWhichSFXfile()
    }, [location]);

    const setWhichSFXfile = () => {
        setSFXCorrect(new Audio('/static/sound/SFXCorrect.mp3'))
        setSFXWrong(new Audio('/static/sound/SFXWrong.mp3'))
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
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, ${quizDetailRef.current.theme}50, ${quizDetailRef.current.theme}80)`
        document.querySelector('#join').style = `background: linear-gradient(0deg, black, ${quizDetailRef.current.theme})`
        document.querySelector('#quizEnd').style = `background: linear-gradient(0deg, black, ${quizDetailRef.current.theme})`
    }

    const fetchQuiz = async () => {
        quizSlugReplacedWithHyphen &&
            await axios.get(`/api/quizV2View/?slug__iexact=${quizSlugReplacedWithHyphen}&limit=1&public=true`).then((res) => res.data.results[0])
                .then(async (quizData) => {
                    if (quizData) {
                        quizDetailRef.current = quizData
                        setQuiz(quizData)
    
                        sendCategoryAsInterest()
                        applyBackground()
    
                        await axios.get(`/api/questionsV2View/?quizKey=${quizData.id}&public=true`)
                            .then((questionData) => {
                                const shuffledData = questionData.data.sort(() => Math.random() - 0.5)
                                setQuestions(shuffledData)
                                setContentLoaded(true)
                            })
                            .catch(err => {
                                log(err.response)
                            })
                    } else {
                        window.location.href = '/404'
                    }
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

    const changeStatueAnswer = (answer, statue) => {
        if (statue == 'show') {
            setAnswer(answer)
        } else if (statue == 'hide') {
            setAnswer(null)
        }
    }

    const playSFX = (whichSFX) => {
        const SFXAllowed = localStorage.getItem('SFXAllowed')

        if (SFXAllowed === 'true') {
            if (whichSFX == 'correct') {
                SFXCorrect.volume = .5
                SFXCorrect.play()
            } else if (whichSFX == 'wrong') {
                SFXWrong.volume = .5
                SFXWrong.play()
            }

        }
    }

    const getAnswer = async (showAnswer) => {
        const currentQuestion = questions[currentQuestionNumber - 1]

        return await axiosInstance.get(`/api/answer?questionId=${currentQuestion.id}`)
            .then(res => {
                const answer = res.data
                
                if (showAnswer) {
                    changeStatueAnswer(answer, 'show')
                }
                return answer
            })
            .catch(err => {
                log(err)
                log(err.response)
                return null
            })
    }

    const checkTheSelectedOption = async (answerDetail, userSelection) => {
        let userAnswer = parseInt(userSelection.id.slice(-1))
        saveUserAnswer(userAnswer, answerDetail.answer)

        if (userAnswer == answerDetail.answer) {
            setCorrectAnswersCount(prev => prev + 1)
            playSFX('correct')
            return true
        } else {
            setWrongAnswerOption(parseInt(userAnswer))
            playSFX('wrong')
            quizEnd()
            return false
        }
    }

    const amountOfPauseCalculator = (answerDetail) => {
        let amountOfPause = 2000

        if (answerDetail?.answer) {
            if (answerDetail.answer_text) {
                amountOfPause += 4000
            }
            if (!answerDetail?.answer_imGif.includes('undefined')) {
                amountOfPause += 2000
            }
        }

        return amountOfPause
    }

    const makeEveryOptionLowOpacity = (type) => {
        const allOptions = document.querySelectorAll('.quiz__options__textLabel')
        let opacityLevel

        if (type === 'low') {
            opacityLevel = .5
        } else if (type === 'high') {
            opacityLevel = 1
        }

        for (let i = 0; i < allOptions.length; i++) {
            allOptions[i].style.opacity = opacityLevel
        }
    }

    const payFees = async () => {
        if (quiz?.fees !== 0) {
            if (!userProfile.userDetail) {
                showLoginNotification()
                return false
            }
            else if (quiz?.fees <= userProfile.QCoins) {
                const now = new Date().getTime()
                const userId = userProfile.userDetail.id
                const payload = {
                    q_coins: userProfile.QCoins - quiz?.fees
                }
        
                await axiosInstance.patch(`/api/userView/${userId}/?timestamp=${now}`, payload)
                    .then(res => {
                        userActions.updateQCoins(res.data.q_coins)
                    })
                    .catch(err => {
                        log(err)
                        log(err.response)
                    })
                return true
            } else {
                enqueueSnackbar(<div>شما به اندازه کافی <img className="inline w-8 h-8" src="/static/img/QCoin.png" alt="" /> کیو کوین ندارید </div>, { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }}) 
                return false
            }
        }

        return true
    }

    const giveQCoins = async () => {
        if (correctAnswersCount !== 0) {
            const now = new Date().getTime()
            const userId = userProfile.userDetail.id
            const prize = correctAnswersCount * 25
            const payload = {
                q_coins: userProfile.QCoins + prize
            }
    
            await axiosInstance.patch(`/api/userView/${userId}/?timestamp=${now}`, payload)
                .then(res => {
                    userActions.updateQCoins(res.data.q_coins)
                })
                .catch(err => {
                    log(err)
                    log(err.response)
                })
        }
    }

    const payAndPlay = async () => {
        if (await payFees()) {
            setJoinPaper(false)
            postToHistory(quizDetailRef.current)
        }
    }

    const selectedOption = async (props) => {
        if (ableToSelectOption) {
            // setTimeout(() => {
            //     document.querySelector('.quiz__questions').scrollIntoView()
            // }, 300)

            setAbleToSelectOption(false)
            makeEveryOptionLowOpacity('low')

            const answerDetail = await getAnswer(true)
            setCorrectAnswerOption(answerDetail.answer)
            const result = await checkTheSelectedOption(answerDetail, props.target)

            if (result) {
                nextQuestion(answerDetail)
            }
        }
    }

    const fiftyFifty = async () => {
        if (lifeline5050) {
            return
        }

        const answerDetail = await getAnswer(false)

        const allOptions = document.querySelectorAll('.quiz__options__textLabel')
        
        const optionsBaseIndex = ((currentQuestionNumber-1)*4)

        const options = {
            1: optionsBaseIndex+1,
            2: optionsBaseIndex+2,
            3: optionsBaseIndex+3,
            4: optionsBaseIndex+4
        }

        delete options[answerDetail.answer]

        const keys = Object.keys(options);
        const randomIndexes = keys.sort(() => 0.5 - Math.random())

        const optionForChanges1 = allOptions[options[randomIndexes[0]] - 1]
        const optionForChanges2 = allOptions[options[randomIndexes[1]] - 1]

        document.getElementById(`${optionForChanges1.id}`).disabled  = true
        optionForChanges1.style.opacity = .5
        optionForChanges1.style.pointerEvents = 'none'
        
        document.getElementById(`${optionForChanges2.id}`).disabled  = true
        optionForChanges2.style.pointerEvents = 'none'
        optionForChanges2.style.opacity = .5

        document.getElementById(`50:50`).style.pointerEvents = 'none'
        document.getElementById(`50:50`).style.opacity = .5

        setLifeline5050(true)
    }

    const getAllUserAnswers = async () => {
        const questionId = questions[currentQuestionNumber - 1].id
        const now = new Date().getTime()

        return await axios.get(`/api/answers_poll?timestamp=${now}&questionId=${questionId}`)
            .then(res => {
                return res.data
            })
            .catch(err => {
                // log(err)
                // log(err.response)
            })
    }

    const pollAudience = async () => {
        if (lifelinePollAudience) {
            return
        }

        const allOptions = document.querySelectorAll('.quiz__options__textLabel')
        
        const optionsBaseIndex = ((currentQuestionNumber-1)*4)

        const options = {
            1: optionsBaseIndex,
            2: optionsBaseIndex+1,
            3: optionsBaseIndex+2,
            4: optionsBaseIndex+3
        }

        const option1 = allOptions[options[1]]
        const option2 = allOptions[options[2]]
        const option3 = allOptions[options[3]]
        const option4 = allOptions[options[4]]
        
        const allAnswers = await getAllUserAnswers()
        const totalAnswersNumber = allAnswers.total

        let option1Value = Math.round((allAnswers.option1 / totalAnswersNumber) * 100)
        let option2Value = Math.round((allAnswers.option2 / totalAnswersNumber) * 100)
        let option3Value = Math.round((allAnswers.option3 / totalAnswersNumber) * 100)
        let option4Value = Math.round((allAnswers.option4 / totalAnswersNumber) * 100)
        
        let option1FillPercent = 0
        let option2FillPercent = 0
        let option3FillPercent = 0
        let option4FillPercent = 0

        const fillAnimation = () => {
            let repeat = false

            setTimeout(
                () => {
                    option1.style.setProperty('--percent', `${option1FillPercent}%`)
                    option2.style.setProperty('--percent', `${option2FillPercent}%`)
                    option3.style.setProperty('--percent', `${option3FillPercent}%`)
                    option4.style.setProperty('--percent', `${option4FillPercent}%`)

                    if (option1FillPercent+2 <= option1Value) {
                        option1FillPercent += 2;
                        repeat = true
                    }
                    if (option2FillPercent+2 <= option2Value) {
                        option2FillPercent += 2;
                        repeat = true
                    }
                    if (option3FillPercent+2 <= option3Value) {
                        option3FillPercent += 2;
                        repeat = true
                    }
                    if (option4FillPercent+2 <= option4Value) {
                        option4FillPercent += 2;
                        repeat = true
                    }
                    if (repeat) {
                        fillAnimation()
                    }
                }, 30
            )
        }

        fillAnimation()

        document.getElementById(`pollAudience`).style.pointerEvents = 'none'
        document.getElementById(`pollAudience`).style.opacity = .5
        setLifelinePollAudience(true)
    }

    const skipQuestion = async () => {
        if (lifelineSkipQuestion) {
            return
        }

        setAbleToSelectOption(false)
        makeEveryOptionLowOpacity('low')
        const answerDetail = await getAnswer(true)
        setCorrectAnswerOption(answerDetail.answer)
        nextQuestion(null)
        document.getElementById(`skipQuestion`).style.pointerEvents = 'none'
        document.getElementById(`skipQuestion`).style.opacity = .5
        setLifelineSkipQuestion(true)
    }

    const restartTheStateOfQuestion = () => {
        changeStatueAnswer(null, 'hide')
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

    const selectResultGifText = () => {
        if (correctAnswersCount <= 3) {
            setResultGif(quiz.GIF_awful)
            const messages = [
                `${correctAnswersCount} هم یه جور امتیازه دیگه، مگه نه؟ البته میتونی دوباره تلاش کنی شاید بالا تر رفت`,
                'بخش خوب داستان اینه که یه چیز جدید یاد گرفتی',
                'عجب!',
                'دوباره تلاش کن. قطعا بهتر میشه',
                'با تلاش دوباره میتونی امتیازت رو بهتر کنی',
                `همم، جالبه، فکر نمیکردم ${correctAnswersCount} هم ممکن باشه`
            ]
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else if (correctAnswersCount <= 6) {
            const messages = [
                'دوباره تلاش کن. قطعا بهتر میشه',
                `${correctAnswersCount} هم یه جور امتیازه دیگه، مگه نه؟ البته میتونی دوباره تلاش کنی شاید بالا تر رفت`,
                'بخش خوب داستان اینه که یه چیز جدید یاد گرفتی',
                `${correctAnswersCount} هم امتیاز جالبیه، ولی میتونه جالب تر هم بشه. دوباره تلاش کن`,
            ]
            setResultGif(quiz.GIF_bad)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else if (correctAnswersCount <= 10) {
            const messages = [
                `${correctAnswersCount} هم یه جور امتیازه دیگه، مگه نه؟ البته میتونی دوباره تلاش کنی شاید بالا تر رفت`,
                'بخش خوب داستان اینه که یه چیز جدید یاد گرفتی',
                `${correctAnswersCount} هم امتیاز جالبیه، ولی میتونه جالب تر هم بشه. دوباره تلاش کن`,
            ]
            setResultGif(quiz.GIF_ok)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else if (correctAnswersCount <= 19) {
            const messages = [
                'این امتیاز رو کمتر کسی دریافت میکنه. درود',
                `${correctAnswersCount} هم امتیاز عالیی هستش ولی میتونه عالی تر هم بشه.`,
                'عالیه. ببین میتونی به بیشتر از 20 برسی'
            ]
            setResultGif(quiz.GIF_good)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else {
            const messages = [
                'این امتیاز رو کمتر کسی دریافت میکنه. درود',
                'معرکه ست. بهتر از این نمیشد',
            ]
            setResultGif(quiz.GIF_great)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        }
    }

    //? on fetch return the not answer one first then the wrong one then the answered one

    const saveUserAnswer = async (userAnswer, correctAnswer) => {
        if (!userProfile.userDetail) {
            return
        }

        const now = new Date().getTime()
        const payload = {
            user_id: {
                username: userProfile.userDetail.id
            },
            question_id: {
                id: questions[currentQuestionNumber - 1].id
            },
            user_answer: userAnswer,
            correct_answer: correctAnswer
        }
        
        await axiosInstance.post(`/api/userAnswerView/?timestamp=${now}`, payload)
            .catch(err => {
                log(err)
                log(err.response)
            })
    }

    const postToHistory = async (quiz) => {
        const payload = {
            quizV2_id: quiz?.id,
            test_id: 0
        }

        log(payload)

        await axios.post(`/api/historyView/`, payload)
            .then(res => {
                log(res)
            })
            .catch(err => {
                log(err)
                log(err.response)
            })
    }

    const saveUserScore = async () => {
        if (!userProfile.userDetail) {
            return
        }
        
        const now = new Date().getTime()
        const payload = {
            user_id: {
                username: userProfile.userDetail.id
            },
            quiz_id: {
                id: quiz?.id
            },
            score: correctAnswersCount,
            got_help: false
        }

        await axiosInstance.post(`/api/userScoreView/?timestamp=${now}`, payload)
            .catch(err => {
                log(err)
                log(err.response)
            })
    }

    const quizEnd = () => {
        selectResultGifText()
        saveUserScore()
        giveQCoins()

        setTimeout(() => {
            setQuizEndStatue(true)
        }, 3000);
    }

    const nextQuestion = (answerDetail) => {
        setTimeout(() => {
            if (currentQuestionNumber !== questions?.length) {
                restartTheStateOfQuestion()
                plusOneToTotalAnsweredQuestions()
                setCurrentMoveOfQuestions(prev => prev - sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

                // if (typeof (window) !== 'undefined' && !(window.navigator.userAgent.includes('Windows'))) {
                //     window.scrollTo(0, 0);
                // }

            } else {
                quizEnd()
            }
        }, amountOfPauseCalculator(answerDetail));
    }

    const returnQuiz = (question) => {
        return <Trivia
            question={question}
            selectedOption={selectedOption}
            questionCounterForId={questionCounterForId}
            ableToSelectOption={ableToSelectOption}
            wrongAnswerOption={wrongAnswerOption}
            correctAnswerOption={correctAnswerOption}
        />
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
                                { transform: `translate(${currentMoveOfQuestions}rem, 0)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem, 0)` }
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
                                    <p className={`p-3 w-full text-[1.5rem] quiz_question mix-blend-hard-light text-center backdrop-blur-2xl rounded-xl`} ref={questionRef}> {question.question} </p>
                                </div>
                            }

                            {
                                !question.question_img?.includes('undefined') &&
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
                            answer?.answer_text &&
                            <div className={`py-4 px-8 text-right bg-[#0000007c] backdrop-blur-xl mt-4 rounded-lg`}>
                                <p>
                                    {answer.answer_text}
                                </p>
                            </div>
                        }

                        {
                            answer && !answer?.answer_imGif.includes('undefined') &&
                            <div className={`bg-[#0000007c] backdrop-blur-xl mt-4 rounded-lg`}>
                                <LazyLoadImage
                                    src={answer?.answer_imGif}
                                    width={1366}
                                    className='object-contain object-top pb-4 m-auto'
                                    alt={quiz.title}
                                    title={quiz.title}
                                />
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
                    <li style={{'background': `linear-gradient(180deg, transparent, ${quizDetailRef.current.theme})`}} key={tag} className='px-3 py-1 text-white rounded-lg'>
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

    const currentUrl = () => {
        return `https://www.quizzland.net/play/${replaceFunction(quizSlug, ' ', '-')}`
    }

    const SFXController = (statue) => {
        setSFXAllowed(statue)
        localStorage.setItem('SFXAllowed', statue)
    }

    const showLoginNotification = () => {
        enqueueSnackbar(
            <div className='mt-8'>
                <h5 className='mb-5'>
                    ابتدا می‌بایست وارد شوید.
                </h5>
                <div className='border-2 rounded-xl w-fit'>
                    <a href='/login'>
                        <button onClick={() => props.onClick()} className={`px-10 py-1 h-fit bloodRiver_bg flex rounded-2xl text-white`}>ورود</button>
                    </a>
                </div>
            </div>,
            { 
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                preventDuplicate: true
            }
        )
    }

    return (
        <div>
            <LoadingScreen loadState={contentLoaded} />

            <Helmet>
                <title>{`${quiz?.title || quiz?.title || replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`}</title>

                <link rel="canonical" href={currentUrl()} />

                <meta name="description" content={`${quiz?.title || replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`} />
                <meta name="keywords" content="کوییز, کوییزلند" />
                <meta name="msapplication-TileImage" content={quiz?.thumbnail} />
                <meta property="og:site_name" content="کوییزلند" />
                <meta property="og:title" content={`${quiz?.title || replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`} />
                <meta property="og:description" content={`${quiz?.title || replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند`} />
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
                            "headline": "${quiz?.title || replaceFunction(props.match.params.title, '-', ' ')} | کوییزلند",
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
            
            {
                userProfile.userDetail == false &&
                <LoginPrompt />
            }

            <div id='join' className={`z-20 absolute top-0 text-center w-full h-full flex flex-col justify-between ${joinPaper ? '' : 'fullPageTransition-hide'}`}>
                <div className='shadow-[0_0_10px_#000000e8] rounded-lg m-5'>
                    <div className='text-[1.5rem] rounded-lg py-5 m-3'>
                        <h1 className='textShadow'>
                            کوییز {quiz?.title}
                        </h1>
                    </div>
                    <ul className='text-right p-5 space-y-5'>
                        <li className='list-disc mr-4'><p className='textShadow'>در تعداد سوال ها محدودیت وجود ندارد. تا وقتی اشتباه نکنید بازی ادامه دارد.</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>هر چه تعداد سوالات پاسخ داده شده بالاتر باشد، <img className='inline w-8 h-8' src="/static/img/QCoin.png" alt="" /> کیو کوین بیشتری دریافت میکنید</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>اگر نیاز به کمک داشتید میتونید با استفاده از <img className='inline w-8 h-8' src="/static/img/QCoin.png" alt="" />  کیو کوین های خود از کمک کننده ها استفاده کنید</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>امیدواریم چیزهای جالبی یاد بگیرید</p></li>
                        {
                            quiz?.fees ?
                            <li className='list-disc mr-4'>
                                <p className='textShadow flex items-center'>
                                ورودی این کوییز:
                                <b className='mx-3'>
                                    <div className='flex space-x-2 space-x-reverse mr-3 items-center'>
                                        <p>{quiz?.fees}</p>
                                        <img className='mx-3 inline w-8 h-8' src="/static/img/QCoin.png" alt="" />
                                        <p>کیو کوین</p>
                                    </div>
                                </b>
                                </p>
                            </li>
                            :
                            ''
                        }
                    </ul>
                </div>
                <div>
                    <button onClick={payAndPlay} style={{ 'border': `3px solid ${quizDetailRef.current?.theme}` }} className={`rounded-lg w-3/4 mb-10 mx-auto text-center py-5`}>
                        بزن بریم
                    </button>
                    <Link to='/' className={`mb-10 mr-6 text-center py-5`}>
                        بازگشت
                    </Link>
                </div>
            </div>

            <div id='quizEnd' className={`z-20 absolute top-0 text-center w-full h-full flex flex-col justify-between ${quizEndStatue ? 'fullPageTransition-show' : 'fullPageTransition-hide'}`}>
                {
                    quizEndStatue &&
                    <div className='flex flex-col justify-between h-full max-w-full w-[30rem] mx-auto'>
                        <div>
                            <div className='shadow-[0_0_10px_#000000e8] rounded-lg m-5'>
                                <div className='text-[1.5rem] rounded-lg py-5 m-3'>
                                    <h1 className='textShadow'>
                                        {correctAnswersCount}
                                    </h1>
                                    {
                                        correctAnswersCount ?
                                        <div className='flex'>
                                            <p className='text-[1rem] flex mx-auto textShadow'>
                                                {Math.round((correctAnswersCount * 3) / 5) * 5}  {/* Nearest to five when correct times 3 */}
                                                <img className='h-6 mx-2' src="/static/img/QCoin.png" />
                                                کیو کوین دریافت کردید.
                                            </p>
                                        </div>
                                        :''
                                    }
                                </div>
                            </div>
                            <div>
                                {<img src={resultGif} className='object-cover rounded-lg h-[19rem] w-[90%] m-auto' width={540} alt={resultGif} />}
                            </div>
                            <div>
                                <p className='text-center my-8 mx-4 text-[1.2rem]'>
                                    {resultMessage}
                                </p>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => window.location.reload()} style={{ 'border': `3px solid ${quizDetailRef.current?.theme}` }} className={`rounded-lg w-3/4 mb-10 mx-auto text-center py-5`}>
                                سعی مجدد
                            </button>
                            <Link className='mr-3' to='/'>
                                بازگشت
                            </Link>
                        </div>
                        <div className='ltr'>
                            {quiz?.id && <LikeCommentButton question={questions[currentQuestionNumber - 1]} lifeline={false} fiftyFifty={fiftyFifty} pollAudience={pollAudience} skipQuestion={skipQuestion} quiz={quiz} quizType={'play'} />}
                        </div>
                    </div>
                }
            </div>

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

                            <QuizHeader questionCurrent={questions[currentQuestionNumber - 1]?.id} quizDetail={quiz} contentLoaded={contentLoaded} SFXAllowed={SFXAllowed} SFXController={SFXController} />

                            {quiz?.id && <LikeCommentButton question={questions[currentQuestionNumber - 1]} lifeline={true} fiftyFifty={fiftyFifty} pollAudience={pollAudience} skipQuestion={skipQuestion} quiz={quiz} quizType={'play'} />}

                            <div className={`quiz__questions mb-4 relative flex justify-center text-center mt-12 md:mt-0`} tag="quiz">
                                {
                                    !joinPaper &&
                                    <div className={`quiz__hider mt-5 flex relative`}>
                                        {
                                            !(contentLoaded) &&
                                            <div className='mt-5 overflow-hidden shadow-lg skeletonQuiz skeletonQuiz__quizQuestion shadow-zinc-800 rounded-xl'></div>
                                        }

                                        {
                                            isSafari ? quizQuestions('safari') : quizQuestions('otherBrowser')
                                        }
                                    </div>
                                }
                            </div>

                            <div>
                                <h3 className='flex items-center justify-center text-white beforeAfterDecor'>تگ های کوییز</h3>
                                <ul className='flex flex-wrap items-baseline justify-center my-5 space-x-3 space-y-2 space-x-reverse max-w-[35rem] mx-auto'>
                                    {quiz && showTheTagsIfNotNull()}
                                </ul>
                            </div>

                            {/* Adverts */}

                            {/* <div className='mt-5 adverts_center' id='mediaad-bNpr'></div> */}

                            {/* <div className='mx-4 mt-10'>
                                <h3 className='flex items-center justify-center mb-5 text-white beforeAfterDecor'>کوییز های مشابه</h3>

                                <ul className="flex flex-col md:flex-row flex-wrap md:w-[70rem] mx-auto my-10">
                                    {
                                        suggestionQuizzes && <TestContainer tests={suggestionQuizzes} bgStyle={'bg'} />
                                    }
                                </ul>
                            </div> */}


                            {/* <h7 className='flex items-center justify-center beforeAfterDecor'>مطالب پیشنهادی</h7> */}

                            {/* Adverts */}
                            {/* <div className='adverts_center' id='mediaad-dESu'></div> */}

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
                                            <Link to='/contents?s=trend'>
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

export default Quiz_V2;