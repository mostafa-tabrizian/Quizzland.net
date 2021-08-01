import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

import { log, replaceFunction } from './base'
import BackBtn from './backBtn'
import HotHeader from './headerWithHotLink'
import LoadingScreen from './loadingScreen'
import QuizContainer from './quizContainer'

const Result = (props) => {
    const [state, setState] = useState(props.location.state)
    const [score, setScore] = useState(0)
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [clipboard, setClipboard] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()

    useEffect(() => {
        calculateTheResultScore()
        detailOfResult()
        setLoadState(true)
        getSuggestionsQuiz()
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
    }, [])

    let clipboardRef = useRef(null)

    const calculateTheResultScore = () => {
        const questionsCounter = state.questions.length
        const correctAnswersCounter = state.correctAnswersCounter
        const score = ((correctAnswersCounter / questionsCounter) * 100).toFixed(0)
        setScore(score)
    }

    const detailOfResult = () => {
        if (score > 80){
            setResultScore(`😎 ${score}%`)
            setResultSubtitle(`! تو یک ${state.quiz.fan_name} واقعی هستی \n 😎 وقتشه خودت رو به بقیه نشون بدی`)
        }
        else if (score > 60){
            setResultScore(`😀 ${score}%`)
            setResultSubtitle('عالیه، فقط یکم با یه فن واقعی بودن فاصله داری')
        }
        else if (score > 40){
            setResultScore(`🙂 ${score}%`)
            setResultSubtitle('بد نیست ولی میتونست بهتر هم باشه')
        }
        else if (score > 20){
            setResultScore(`😭 ${score}%`)
            setResultSubtitle('بیشتر تلاش کن. میتونی انجامش بدی')
        }
        else if (score >= 0){
            setResultScore(`🙄 ${score}%`)
            setResultSubtitle(` .فکر کنم کوئیز رو اشتباهی انتخاب کردی \n😅 میتونی سریع کوئیز دیگه ای انتخاب کنی تا کسی نیومده `)
        }
    }

    const copyResultAndQuizLink = () => {
        const quizUrl = `${window.location.origin}/quiz/${replaceFunction(state.quiz.title, ' ', '-')}`

        const messageShare =
            `من تو کوئیز ${state.quiz.title} (${resultScore}) درصد درست زدم . تو چقدر میتونی بزنی ؟
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
        axios.get(`/dbQuizzland$M19931506/new_quiz/?subCategory__icontains=${replaceFunction(props.location.state.quiz.subCategory, ' ', '+')}&limit=4`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <HotHeader
                title='نتیجه کوئیز | کوئيزلند '
            />

            <div className="result__container">
                <div className="result__title flex flex-jc-c">
                    <h5 className="tx-al-r">"نتیجه‌ کوئیز  "{state.quiz.title}</h5>
                </div>
                <div className="beforeAfterDecor flex flex-jc-c flex-ai-c">
                    <h1 className="result__subtitle tx-al-c">{resultSubtitle}</h1>
                </div>
                <div className="result wrapper-med space-sm flex flex-ai-c flex-jc-c">
                    <div className="result__img flex flex-jc-c flex-ai-c">
                        {score > 80 && <img className="result__img20"  src={`${state.quiz.GIF100}`} alt={state.quiz.GIF2}  />}
                        {score > 60 && <img className="result__img40"  src={`${state.quiz.GIF80}`}  alt={state.quiz.GIF4}  />}
                        {score > 40 && <img className="result__img60"  src={`${state.quiz.GIF60}`}  alt={state.quiz.GIF6}  />}
                        {score > 20 && <img className="result__img80"  src={`${state.quiz.GIF40}`}  alt={state.quiz.GIF8}  />}
                        {score >= 0 && <img className="result__img100" src={`${state.quiz.GIF20}`}  alt={state.quiz.GIF10} />}
                    </div>
                    <div className="result__score">{resultScore}</div>
                    <div className="result__detail tx-al-r">
                        <h5>تعداد پاسخ های درست:‌ <span className="result__detail__correctTime">{state.correctAnswersCounter}</span></h5>
                        <h5>تعداد پاسخ های غلط: <span className="result__detail__wrongTime">{state.questions.length - state.correctAnswersCounter}</span></h5>
                    </div>
                </div>

                <div className='wrapper-med'>
                    <div className="result__share space-sm tx-al-c">
                        <h5>{'دوستات رو به چالش بکش  \n ببین میتونن امتیازت رو بشکنن'}</h5>
                        <button onClick={copyResultAndQuizLink} className='result__share__btn btn' aria-label="Copy Result For Share" data-clipboard-target='.result__clipboard' type="button">🙋🏻‍♂️ اشتراک گذاری</button>
                        {/* <h6 className={`result__share__message ${clipboard === null && 'noVis'}`}>نتیجه و لینک کوئیز کپی شد</h6> */}
                    </div>
                </div>

            </div>

            <textarea ref={(value) => clipboardRef = value} value={clipboard} className="result__clipboard pos-abs" />

            <h2 className='tx-al-c space-med beforeAfterDecor'>کوئیز های مشابه</h2>

            <ul className="quizContainer flex flex-jc-fe flex-ai-c wrapper-med">
                {
                    suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                }
            </ul>

            <BackBtn />
            
            <button onClick={tryAgainTheQuiz} className='tryAgain btn tx-al-c' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره کوئيز</button>

        </React.Fragment>
    );
}
 
export default Result;