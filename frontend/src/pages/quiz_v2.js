import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from "react-helmet";
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
const SkeletonTestContainer = React.lazy(() => import('../components/skeletonTestContainer'))
const TestContainer = React.lazy(() => import('../components/testContainer'))

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
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
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

    const location = useLocation();

    const quizDetailRef = useRef(null)
    const questionRef = useRef(null)
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
        question_background && (document.querySelectorAll('#question_background').forEach((q) => q.style = `background: ${quiz?.theme}`))
        // document.querySelector('body').style = `background: #060101`
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
                    quizDetailRef.current = quizData
                    setQuiz(quizData)

                    sendCategoryAsInterest()
                    // await getSuggestionsQuiz()
                    applyBackground()

                    let questionAPI

                    await axios.get(`/api/questionsV2View/?quizKey=${quizData.id}&public=true`)
                        .then((questionData) => {
                            const shuffledData = questionData.data.sort(() => Math.random() - 0.5)
                            setQuestions(shuffledData)
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

    const checkTheSelectedOption = (userSelection) => {
        let userChose = parseInt(userSelection.id.slice(-1))
        let correctAnswer = parseInt(questions[currentQuestionNumber - 1].answer)

        setCorrectAnswerOption(correctAnswer)
        ImGifTextAnswerShowOrHide(currentQuestionNumber, 'block')

        if (userChose == correctAnswer) {
            setCorrectAnswersCount(prev => prev + 1)
            playSFX('correct')
            return true
        } else {
            setWrongAnswerOption(parseInt(userChose))
            playSFX('wrong')
            quizEnd()
            return false
        }
    }

    const amountOfPauseCalculator = () => {
        let amountOfPause = 2000
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

    const ifQuizPlaying = () => {
        if (currentQuestionNumber == halfTheQuestions) {  // && userProfile.userDetail
            AddView(`quizV2View`, quizDetailRef.current.id)
        }
    }

    const selectedOption = async (props) => {
        if (ableToSelectOption) {
            // setTimeout(() => {
            //     document.querySelector('.quiz__questions').scrollIntoView()
            // }, 300)

            setAbleToSelectOption(false)
            makeEveryOptionLowOpacity('low')
            const result = checkTheSelectedOption(props.target)
            if (result) {
                nextQuestion()
            }
        }
    }

    const restartTheStateOfQuestion = () => {
        ImGifTextAnswerShowOrHide(currentQuestionNumber, 'none')
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
        } else if (correctAnswerOption <= 6) {
            const messages = [
                'دوباره تلاش کن. قطعا بهتر میشه',
                `${correctAnswersCount} هم یه جور امتیازه دیگه، مگه نه؟ البته میتونی دوباره تلاش کنی شاید بالا تر رفت`,
                'بخش خوب داستان اینه که یه چیز جدید یاد گرفتی',
                `${correctAnswersCount} هم امتیاز جالبیه، ولی میتونه جالب تر هم بشه. دوباره تلاش کن`,
            ]
            setResultGif(quiz.GIF_bad)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else if (correctAnswerOption <= 10) {
            const messages = [
                `${correctAnswersCount} هم یه جور امتیازه دیگه، مگه نه؟ البته میتونی دوباره تلاش کنی شاید بالا تر رفت`,
                'بخش خوب داستان اینه که یه چیز جدید یاد گرفتی',
                `${correctAnswersCount} هم امتیاز جالبیه، ولی میتونه جالب تر هم بشه. دوباره تلاش کن`,
            ]
            setResultGif(quiz.GIF_ok)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else if (correctAnswerOption <= 19) {
            const messages = [
                'این امتیاز رو کمتر کسی دریافت میکنه. درود',
                `${correctAnswersCount} هم امتیاز عالیی هستش ولی میتونه عالی تر هم بشه.`,
                'عالیه. ببین میتونی به بیشتر از 20 برسی'
            ]
            setResultGif(quiz.GIF_good)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        } else if (correctAnswerOption <= 20) {
            const messages = [
                'این امتیاز رو کمتر کسی دریافت میکنه. درود',
                'معرکه ست. بهتر از این نمیشد',
            ]
            setResultGif(quiz.GIF_great)
            setResultMessage(messages[Math.floor(Math.random()*messages.length)])
        }
    }

    const quizEnd = () => {
        selectResultGifText()

        setTimeout(() => {
            setQuizEndStatue(true)
        }, 3000);
    }

    const nextQuestion = () => {
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
        }, amountOfPauseCalculator());
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
                                    <p className={`p-3 w-full text-[1.5rem] quiz_question mix-blend-hard-light text-center backdrop-blur-2xl rounded-xl`} ref={questionRef}> {question.question} </p>
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
                            question?.answer_text &&
                            <div className={`quiz__answerText py-4 px-8 answerHide text-right ${theme == 'light' ? 'bg-[#ffffff82]' : 'bg-[#0000007c]'} backdrop-blur-xl mt-4 rounded-lg`}>
                                {answerOfQuestionIfExistShow(question)}
                            </div>
                        }

                        {
                            !(question.answer_imGif.includes('NotExist.jpg')) &&
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
        return `https://www.quizzland.net/play/${replaceFunction(quizSlug, ' ', '-')}`
    }

    const SFXController = (statue) => {
        setSFXAllowed(statue)
        localStorage.setItem('SFXAllowed', statue)
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

            <div id='join' className={`z-20 absolute top-0 text-center w-full h-full flex flex-col justify-between ${joinPaper ? '' : 'popUp-hide'}`}>
                <div className='shadow-[0_0_10px_#000000e8] rounded-lg m-5'>
                    <div className='text-[1.5rem] rounded-lg py-5 m-3'>
                        <h1 className='textShadow'>
                            کوییز {quiz?.title}
                        </h1>
                    </div>
                    <ul className='text-right p-5 space-y-5'>
                        <li className='list-disc mr-4'><p className='textShadow'>در تعداد سوال ها محدودیت وجود ندارد. تا وقتی اشتباه نکنید بازی ادامه دارد.</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>هر چه امتیاز شما بالا باشد درنهایت کیوکوین بیشتری دریافت میکنید</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>اگر نیاز به کمک داشتید میتونید با استفاده از کیوکوین های خود از کمک کننده ها استفاده کنید</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>امیدواریم چیزهای جالبی یاد بگیری</p></li>
                        <li className='list-disc mr-4'><p className='textShadow'>ورودی این کوییز: <b>
                            {
                                quiz?.fees ?
                                `کیو کوین ${quiz?.fees}`
                                :
                                'رایگان'
                            }
                            {/* if not free. get from the user coins */}
                        </b></p></li>
                    </ul>
                </div>
                <button onClick={() => setJoinPaper(false)} style={{ 'border': `3px solid ${quizDetailRef.current?.theme}` }} className={`rounded-lg w-3/4 mb-10 mx-auto text-center py-5`}>
                    بزن بریم
                </button>
            </div>

            <div id='quizEnd' className={`z-20 absolute top-0 text-center w-full h-full flex flex-col justify-between ${quizEndStatue ? 'popUp-show' : 'popUp-hide'}`}>
                {
                    quizEndStatue &&
                    <div className='flex flex-col justify-between h-full'>
                        <div>
                            <div className='shadow-[0_0_10px_#000000e8] rounded-lg m-5'>
                                <div className='text-[1.5rem] rounded-lg py-5 m-3'>
                                    <h1 className='textShadow'>
                                        {correctAnswersCount}
                                    </h1>
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

                            <QuizHeader quizDetail={quiz} contentLoaded={contentLoaded} SFXAllowed={SFXAllowed} SFXController={SFXController} />

                            {/* {quiz?.id && <LikeCommentButton quizId={quiz?.id} quizType={'play'} />} */}

                            <div className={`quiz__questions mb-4 relative flex justify-center text-center mt-12 md:mt-0`} tag="quiz">
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
                                        suggestionQuizzes && <TestContainer quizzes={suggestionQuizzes} bgStyle={'bg'} />
                                    }
                                </ul>
                            </div>


                            {/* <h7 className='flex items-center justify-center quiz__tags__title beforeAfterDecor'>مطالب پیشنهادی</h7> */}

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

export default Quiz_V2;