import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";
import InfiniteScroll from 'react-infinite-scroll-component';


import axiosInstance from '../../components/axiosApi';
import LoadingScreen from '../../components/loadingScreen'
import QuizContainer from '../../components/quizContainer'
import Header from '../../components/header'
import Footer from '../../components/footer'
import SkeletonLoading from '../../components/skeletonLoading';
import Tools from '../../components/tools';

import { log, takeParameterFromUrl } from '../../components/base'
import userProfileDetail from '../../components/userProfileDetail';

const QuizHistory = () => {
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [content, setContent] = useState([])
    const [countNewFetched, setCountNewFetched] = useState()
    const [countResult, setCountResult] = useState(100)
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        setOffset(0)
        setCountResult(100)
        fetchContent()
        setLoadState(true)
        document.querySelector('#land').classList.add('overflow-y-auto')  // make content load on scroll
    }, [])

    const componentChangeDetector = () => {
        (function (history) {

            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

            if (document.getElementById('html')) {
                document.getElementById('html').style = 'background: #121212'
            }

            document.getElementById('land').scrollIntoView()

        })(window.history);
    }

    const fetchContent = async () => {
        if (loading) {
            return;
        }

        setLoading(true)

        const userDetail = await userProfileDetail()
        const quiz_history = userDetail.played_history.split('_')
        
        const now = new Date().getTime()
        const quiz = await axiosInstance.get(`/api/quiz/?public=true&timestamp=${now}`)
        const pointy = await axiosInstance.get(`/api/test/?public=true&timestamp=${now}`)
        let mergeContent = quiz.data.concat(pointy.data)
        
        let finalList = []
        quiz_history.map(quizId => {
            const historyItem = mergeContent.filter(elem => elem.id == quizId)
            
            historyItem[0] && 
            finalList.push(historyItem[0])
        })
        setContent(finalList.reverse())
        setContentLoaded(true)
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>{`تاریخجه کوییز های انجام شده | کوییزلند`}</title>
                <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
            </Helmet>

            {/* <div className='adverts adverts__left'>
                <div id='mediaad-DLgb'></div>
                <div id="pos-article-display-26094"></div>
            </div> */}

            <div className='mb-10'>
                <h3 className='lowTitle'>You Quizzes History</h3>
                <h3 className='title'>تاریخچه کوییزهای شما</h3>
            </div>

            {SkeletonLoading(contentLoaded)}

            <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 quizContainer flex-ai-fe justify-right">
                <QuizContainer quizzes={content} bgStyle='trans' />
            </ul>

            {/* Adverts */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}

            <Footer />

        </React.Fragment>
    );
}

export default QuizHistory;