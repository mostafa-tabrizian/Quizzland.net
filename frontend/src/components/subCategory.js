import React, { useState, useEffect } from 'react';
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import Tools from './tools'
import PageTravel from './pageTravel'
import { log, replaceFunction, takeParameterFromUrl } from './base'
import Header from './hotHeader'
import LoadingScreen from './loadingScreen'
import QuizContainer from './quizContainer'
import QuizPointyContainer from './quizPointyContainer'

const SubCategory = (props) => {

    const [pageTravelQuiz, setPageTravelQuiz] = useState([])
    const [pageTravelQuizPointy, setPageTravelQuizPointy] = useState([])

    const [quizzes, setQuizzes] = useState([])
    const [quizzesPointy, setQuizzesPointy] = useState([])

    const [hideQuizzes, setHideQuizzes] = useState(false)
    const [hideQuizzesPointy, setHideQuizzesPointy] = useState(false)

    const [numberOfResult, setNumberOfResult] = useState(16)
    
    const [offsetQuiz, setOffsetQuiz] = useState(0)
    const [offsetQuizPointy, setOffsetQuizPointy] = useState(0)
    
    const [sortType, setSortType] = useState('newest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const axiosLimited = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 1000, maxRPS: 2 })
    
    const subCategory = props.match.params.subCategory

    const sortTypeDefinitionForQuizDb = {
        'newest': 'new_quiz',
        'bestest': 'best_quiz',
        'alphabet': 'alphabet_quiz'
    }
    
    const sortTypeDefinitionForPointyQuizDb = {
        'newest': "new_pointy_quiz",
        'bestest': "best_pointy_quiz",
        'alphabet': "alphabet_pointy_quiz"
    };

    useEffect(() => {
        getQuizzes()
    }, [sortType, numberOfResult, offsetQuiz, offsetQuizPointy])

    useEffect(() => {
        backgroundOfSubCategory()
        setLoadState(true)
        // addView()
    }, [])
    
    const addView = async () => {
        let grabSubCategoryDetail = await axiosLimited.get(`/dbAPI/new_category/?subCategory__icontains=${replaceFunction(subCategory, "-", " ")}&limit=1`)
        grabSubCategoryDetail = grabSubCategoryDetail.data.results[0]
        await axiosLimited.patch(`/dbAPI/new_category/${grabSubCategoryDetail.id}/`, {views: grabSubCategoryDetail.views+1, monthly_views:grabSubCategoryDetail.monthly_views+1})
    }

    const getQuizzes = async () => {
        const Quizzes = await axiosLimited.get(
          `/dbAPI/${sortTypeDefinitionForQuizDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategory, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuiz}`
        );
        const QuizzesPointy = await axiosLimited.get(
          `/dbAPI/${sortTypeDefinitionForPointyQuizDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategory, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuizPointy}`
        );
        
        if (Quizzes.data.count !== 0) {
            setQuizzes(Quizzes.data.results)
            setPageTravelQuiz(Quizzes.data)
        } else {
            setHideQuizzes(true)
        }

        if (QuizzesPointy.data.count !== 0) {
            setQuizzesPointy(QuizzesPointy.data.results)
            setPageTravelQuizPointy(QuizzesPointy.data)
        } else {
            setHideQuizzesPointy(true)
        }

        setContentLoaded(true)
    }

    const listQuizzes = () => {
        return (
            <QuizContainer quizzes={quizzes} bgStyle='bg' />
        )
    }

    const listQuizzesPointy = () => {
        return (
            <QuizPointyContainer quizzes={quizzesPointy} bgStyle='bg' />
        )
    }

    const backgroundOfSubCategory = async () => {
        const new_category = await axiosLimited.get(`/dbAPI/new_category/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}&limit=1`)
        const background = new_category.data.results[0].background
        document.getElementById('html').style = `
            background: url('${background}') center/cover fixed no-repeat !important;
        `
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header
                colorOfHeader='header__white'
            />

            <Helmet>
                <title>{`کوییزلند | کوییز های ${replaceFunction(takeParameterFromUrl('t'), '-', ' ')}`}</title>
                <meta name="description" content={`کوییزلند - کوییز های ${replaceFunction(takeParameterFromUrl('t'), '-', ' ')} `} />
                <meta name="keywords" content={`بهترین کوییز های ${replaceFunction(takeParameterFromUrl('t'), '-', ' ')} , کوییز های ${replaceFunction(takeParameterFromUrl('t'), '-', ' ')}`} />
            </Helmet>

            <div className='adverts adverts__left'>
                <div id="pos-article-display-28433"></div>
            </div>

            <h3 className='lowTitle' style={{color: 'white'}}>{replaceFunction(props.match.params.subCategory, '-', ' ')}</h3>
            <h3 className='title' style={{color: 'white'}}>{replaceFunction(takeParameterFromUrl('t'), '-', ' ')}</h3>

            <Tools 
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            />

            <ul className={`quizContainer flex wrapper-med ${contentLoaded && 'noVis'}`}>

                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                
            </ul>

            <div className={hideQuizzes && 'noVis'}>

                <h2 className={`wrapper-med ${hideQuizzesPointy && 'noVis'}`} style={{color: 'white'}}>کوییز ها</h2>

                <ul className={`quizContainer flex wrapper-med`}>
                    {listQuizzes()}
                </ul>

                <PageTravel
                    pageTravel={pageTravelQuiz} setPageTravelQuiz={setPageTravelQuiz}
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    offset={offsetQuiz} setOffset={setOffsetQuiz}
                />

            </div>

            <div className={hideQuizzesPointy && 'noVis'}>

                <h2 className={`wrapper-med ${hideQuizzes && 'noVis'}`} style={{color: 'white'}}>تست ها</h2>

                <ul className={`quizContainer flex wrapper-med`}>
                    {listQuizzesPointy()}
                </ul>

                <PageTravel
                    pageTravel={pageTravelQuizPointy} setPageTravelQuiz={setPageTravelQuizPointy}
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    offset={offsetQuizPointy} setOffset={setOffsetQuizPointy}
                />

            </div>

        </React.Fragment>
    );
}
 
export default SubCategory;