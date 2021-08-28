import React, { useState, useEffect } from 'react';
import axios from 'axios'

import Tools from './tools'
import PageTravel from './pageTravel'
import { log, replaceFunction, takeParameterFromUrl } from './base'
import HotHeader from './hotHeader'
import LoadingScreen from './loadingScreen'
import QuizContainer from './quizContainer'

const SubCategory = (props) => {

    const [pageTravel, setPageTravel] = useState([])
    const [quizzes, setQuizzes] = useState([])
    const subCategory = props.match.params.subCategory
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [sortType, setSortType] = useState('newest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const sortTypeDefinitionForDb = {
        'newest': 'new_quiz',
        'bestest': 'best_quiz',
        'alphabet': 'alphabet_quiz'
    }

    const getQuizzes = async () => {
        const pageTravelAndQuizzes = await axios.get(`/dbQuizzland$M19931506/${sortTypeDefinitionForDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}&limit=${numberOfResult}&offset=${offset}`)
        setPageTravel(pageTravelAndQuizzes.data)
        setQuizzes(pageTravelAndQuizzes.data.results)
        setContentLoaded(true)
    }

    const listQuizzes = () => {
        return (
            <QuizContainer quizzes={quizzes} bgStyle='bg' />
        )
    }

    const backgroundOfSubCategory = async () => {
        const new_category = await axios.get(`/dbQuizzland$M19931506/new_category/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}&limit=1`)
        const background = new_category.data.results[0].background
        document.getElementById('html').style = `
            background: url('${background}') center/cover fixed no-repeat !important;
        `
    }

    useEffect(() => {
        getQuizzes()
    }, [sortType, numberOfResult, offset])

    useEffect(() => {
        backgroundOfSubCategory()
        setLoadState(true)
    }, [])


    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <HotHeader
                colorOfHeader='header__white'
                title={`کوییزلند | کوییز های ${subCategory}`}
                description={`کوییزلند ${subCategory} کوییز های`}
                keywords={`${subCategory} بهترین کوییز های , ${subCategory} کوییز های`}
            />

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

            <ul className='quizContainer flex wrapper-med'>

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
 
export default SubCategory;