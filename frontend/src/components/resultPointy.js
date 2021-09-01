import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

import { log, replaceFunction } from './base'
import BackBtn from './backBtn'
import HotHeader from './hotHeader'
import LoadingScreen from './loadingScreen'
import QuizPointyContainer from './quizPointyContainer'

const Result = (props) => {
    const [state, setState] = useState(props.location.state)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultImg, setResultImg] = useState()
    const [resultText, setResultText] = useState()
    const [clipboard, setClipboard] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()

    useEffect(async () => {
        setLoadState(true)
        getSuggestionsQuiz()
        detailOfResult()
        // setBackground()
    }, [])

    let clipboardRef = useRef(null)

    // const setBackground = (backgroundUrl) => {
    //     log(backgroundUrl)
    //     if (backgroundUrl !== undefined) {
    //         document.getElementById('html').style = `
    //             background: url('${backgroundUrl}') center/cover fixed no-repeat !important;
    //         `
    //     }
    // }

    const detailOfResult = () => {
        const totalPoints = state.totalPoints
        if (totalPoints > state.quiz.result_upTo_2nd){
            setResultImg(state.quiz.result_img_1st)
            setResultSubtitle(state.quiz.result_title_1st)
            setResultText(state.quiz.result_text_1st)
        }
        else if (totalPoints >= state.quiz.result_upTo_3rd) {
            setResultImg(state.quiz.result_img_2nd)
            setResultSubtitle(state.quiz.result_title_2nd)
            setResultText(state.quiz.result_text_2nd)
        }
        else if (totalPoints > state.quiz.result_upTo_4th) {
            setResultImg(state.quiz.result_img_3rd)
            setResultSubtitle(state.quiz.result_title_3rd)
            setResultText(state.quiz.result_text_3rd)
        }
        else if (totalPoints > state.quiz.result_upTo_5th) {
            setResultImg(state.quiz.result_img_4th)
            setResultSubtitle(state.quiz.result_title_4th)
            setResultText(state.quiz.result_text_4th)
        }
        else if (totalPoints > state.quiz.result_upTo_6th) {
            setResultImg(state.quiz.result_img_5th)
            setResultSubtitle(state.quiz.result_title_5th)
            setResultText(state.quiz.result_text_5th)
        }
        else if (totalPoints > state.quiz.result_upTo_7th) {
            setResultImg(state.quiz.result_img_6th)
            setResultSubtitle(state.quiz.result_title_6th)
            setResultText(state.quiz.result_text_6th)
        }
        else if (totalPoints > state.quiz.result_upTo_8th) {
            setResultImg(state.quiz.result_img_7th)
            setResultSubtitle(state.quiz.result_title_7th)
            setResultText(state.quiz.result_text_7th)
        }
        else if (totalPoints > state.quiz.result_upTo_9th) {
            setResultImg(state.quiz.result_img_8th)
            setResultSubtitle(state.quiz.result_title_8th)
            setResultText(state.quiz.result_text_8th)
        }
        else if (totalPoints > state.quiz.result_upTo_10th) {
            setResultImg(state.quiz.result_img_9th)
            setResultSubtitle(state.quiz.result_title_9th)
            setResultText(state.quiz.result_text_9th)
        }
        else if (totalPoints <= state.quiz.result_upTo_10th) {
            setResultImg(state.quiz.result_img_10t)
            setResultSubtitle(state.quiz.result_title_10th)
            setResultText(state.quiz.result_text_10th)
        }
    }

    const copyResultAndQuizLink = () => {
        const quizUrl = `${window.location.origin}/quiz/${replaceFunction(state.quiz.title, ' ', '-')}`

        setClipboard(quizUrl)
        clipboardRef.select()
        document.execCommand('copy')
    }

    const tryAgainTheQuiz = () => {
        window.history.go(-1)
    }

    const getSuggestionsQuiz = () => {
        axios.get(`/dbAPI/new_pointy_quiz/?subCategory__icontains=${replaceFunction(props.location.state.quiz.subCategory, ' ', '+')}&limit=4`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <HotHeader
                title='نتیجه تست | کوییزلند '
            />

            <div className="result__container">
                <div className="result__title flex flex-jc-c">
                    <h5 className="tx-al-r">"نتیجه‌ تست  "{state.quiz.title}</h5>
                </div>
                <div className="beforeAfterDecor flex flex-jc-c flex-ai-c">
                    <h1 className="result__subtitle tx-al-c">{resultSubtitle}</h1>
                </div>

                <div className='resultPointy__img flex'>
                    <img src={resultImg} alt="" />
                </div>

                <div className="resultPointy wrapper-sm flex flex-ai-c flex-jc-c">
                    <p
                        dangerouslySetInnerHTML={{
                            __html: resultText
                        }}>
                    </p>
                </div>

                <div className='wrapper-med'>
                    <div className="result__share space-sm tx-al-c">
                        <h5>{'ببین نتیجه‌ی تست دوستات چی در میاد  \n ببین شبیه هستید یا فرق دارید'}</h5>
                        <button onClick={copyResultAndQuizLink} className='result__share__btn btn' aria-label="Copy Result For Share" data-clipboard-target='.result__clipboard' type="button">🙋🏻‍♂️ اشتراک گذاری</button>
                        {/* <h6 className={`result__share__message ${clipboard === null && 'noVis'}`}>نتیجه و لینک تست کپی شد</h6> */}
                    </div>
                </div>

            </div>

            <textarea ref={(value) => clipboardRef = value} value={clipboard} className="result__clipboard pos-abs" />

            <h2 className='tx-al-c space-med beforeAfterDecor'>تست های مشابه</h2>

            <ul className="quizContainer flex wrapper-med">
                {
                    suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                }
            </ul>

            <BackBtn />
            
            <button onClick={tryAgainTheQuiz} className='tryAgain btn tx-al-c' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره تست</button>

        </React.Fragment>
    );
}
 
export default Result;