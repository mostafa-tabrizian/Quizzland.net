import axios from 'axios';
import React, { useEffect, useState } from 'react'

import LoadingScreen from './loadingScreen'
import Header from './header'
import PageTravel from './pageTravel'
import QuizContainer from './quizContainer'

import { log, takeParameterFromUrl } from './base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [quizzes, setQuizzes] = useState([])
    const [sortTitle, setSortTitle] = useState()
    const [sortType, setSortType] = useState()
    const [sortCategory, setSortCategory] = useState()
    const [pageTravel, setPageTravel] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(8)
    const [offset, setOffset] = useState(0)
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        checkWhatSort()
        getQuizzes()
        listQuizzes()
        setLoadState(true)
    }, [sortType])

    useEffect(() => {
        getQuizzes()
    }, [offset])

    const componentChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            checkWhatSort()
            document.getElementById('root').scrollIntoView()

        })(window.history);
    }
    
    const checkWhatSort = async () => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
        setSortType(takeParameterFromUrl('q'))
        setSortCategory(takeParameterFromUrl('c'))
    }

    const getQuizzes = async () => {
        let quizzes
        switch (sortType) {
            case 'newest':
                setSortTitle('جدیدترین کوییز ها')
                if (sortCategory) {
                    quizzes = await axios.get(`/dbQuizzland$M19931506/new_quiz/?limit=${numberOfResult}&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axios.get(`/dbQuizzland$M19931506/new_quiz/?limit=${numberOfResult}&offset=${offset}`)
                }
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest':
                setSortTitle('بهترین کوییز ها')
                if (sortCategory) {
                    quizzes = await axios.get(`/dbQuizzland$M19931506/best_quiz/?limit=21&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axios.get(`/dbQuizzland$M19931506/best_quiz/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                }
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthlyBestest':
                setSortTitle('بهترین کوییز های این ماه')
                if (sortCategory) {
                    quizzes = await axios.get(`/dbQuizzland$M19931506/monthlyBest_quiz/?limit=21&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axios.get(`/dbQuizzland$M19931506/monthlyBest_quiz/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                }
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            default:
                break
        }
    }

    const listQuizzes = () => {
        return (
            <QuizContainer quizzes={quizzes} bgStyle='trans' />
        )
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header
                title={`${sortTitle} | کوییزلند`}
            />

            <h3 className='title'>{sortTitle}</h3>

            <ul className={`quizContainer flex flex-jc-fe flex-ai-c wrapper-med ${contentLoaded && 'noVis'}`}>

                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>

            </ul>
            
            <ul className="quizContainer flex flex-jc-fe flex-ai-c wrapper-med">
                
                {listQuizzes()}

            </ul>

            <PageTravel 
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
            />
            
        </React.Fragment>
    );
}
 
export default Sort;