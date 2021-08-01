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
    
    const sortTypeDefinitionForDb = {
        'newest': 'new_quiz',
        'bestest': 'best_quiz',
        'alphabet': 'alphabet_quiz'
    }

    const getQuizzes = async () => {
        const pageTravelAndQuizzes = await axios.get(`/dbQuizzland$M19931506/${sortTypeDefinitionForDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}&limit=${numberOfResult}&offset=${offset}`)
        setPageTravel(pageTravelAndQuizzes.data)
        setQuizzes(pageTravelAndQuizzes.data.results)
    }

    const listQuizzes = () => {
        return (
            <QuizContainer quizzes={quizzes} />
        )
    }

    const backgroundOfSubCategory = async () => {
        const new_category = await axios.get(`/dbQuizzland$M19931506/new_category/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}&limit=1`)
        const background = new_category.data.results[0].background
        if (document.getElementById('html')) {
            document.getElementById('html').style = `
                background: url('${background}');
                background-position: center center;
                background-size: cover;
                background-attachment: fixed;
                background-repeat: no-repeat;
            `
        }
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
                title={`کوئيزلند | کوئیز های ${subCategory}`}
                description={`کوئيزلند ${subCategory} کوئيز های`}
                keywords={`${subCategory} بهترین کوئيز های , ${subCategory} کوئيز های`}
            />

            <h3 className='lowTitle'>{replaceFunction(props.match.params.subCategory, '-', ' ')}</h3>
            <h3 className='title'>{replaceFunction(takeParameterFromUrl('t'), '-', ' ')}</h3>

            <Tools 
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            />

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
 
export default SubCategory;