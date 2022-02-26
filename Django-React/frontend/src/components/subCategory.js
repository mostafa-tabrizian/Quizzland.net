import React, { useState, useEffect } from 'react';


import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import Header from './header'
import AddView from './addView';

import Tools from './tools'
import PageTravel from './pageTravel'
import { log, replaceFunction, takeParameterFromUrl } from './base'
import LoadingScreen from './loadingScreen'
import QuizContainer from './quizContainer'
import QuizPointyContainer from './quizPointyContainer'
import SkeletonLoading from './skeletonLoading'

const SubCategory = (props) => {

    const [pageTravelQuiz, setPageTravelQuiz] = useState([])
    const [pageTravelQuizPointy, setPageTravelQuizPointy] = useState([])

    const [quizzes, setQuizzes] = useState([])
    const [quizzesPointy, setQuizzesPointy] = useState([])

    const [hideQuizzes, setHideQuizzes] = useState(false)
    const [hideQuizzesPointy, setHideQuizzesPointy] = useState(false)

    const [numberOfResult, setNumberOfResult] = useState(16)
    const [currentPageNumberQuiz, setCurrentPageNumberQuiz] = useState(1)
    const [currentPageNumberPointy, setCurrentPageNumberPointy] = useState(1)

    const [offsetQuiz, setOffsetQuiz] = useState(0)
    const [offsetQuizPointy, setOffsetQuizPointy] = useState(0)
    
    const [sortType, setSortType] = useState('newest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const subCategory = props.match.params.subCategory
    const persianSubCategory = takeParameterFromUrl('sc')

    const sortTypeDefinitionForQuizDb = {
        'newest': 'quiz_new',
        'bestest': 'quiz_best',
        'alphabet': 'quiz_alphabet'
    }
    
    const sortTypeDefinitionForPointyQuizDb = {
        'newest': "pointy_new",
        'bestest': "best_pointy_quiz",
        'alphabet': "pointy_alphabet"
    };

    useEffect(() => {
        if (persianSubCategory) {
            getQuizzes()
        }
    }, [persianSubCategory, sortType, numberOfResult, offsetQuiz, offsetQuizPointy])

    useEffect(() => {
        backgroundOfSubCategory()
        setLoadState(true)
    }, [persianSubCategory])

    const persianSubCategoryWithoutSign = replaceFunction(persianSubCategory, '-', ' ')

    const getQuizzes = async () => {
        const Quizzes = await axios.get(
          `/dbAPI/${sortTypeDefinitionForQuizDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategory, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuiz}`
        );
        const QuizzesPointy = await axios.get(
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
        await axios.get(`/dbAPI/subcategory_new/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}`)
            .then((categoryData) => {
                AddView('category_new', categoryData.data[0].id)
                const background = categoryData.data[0].background
                document.getElementById('html').style = `
                    background: url('${background}') center/cover fixed no-repeat !important;
                `
            })
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header
                colorOfHeader='header__white'
                linkType='Hot'
            />

            <Helmet>
                <title>{`کوییزلند | کوییز های ${persianSubCategoryWithoutSign}`}</title>
                <meta name="description" content={`کوییزلند - کوییز های ${persianSubCategoryWithoutSign} `} />
                <meta name="keywords" content={`بهترین کوییز های ${persianSubCategoryWithoutSign} , کوییز های ${persianSubCategoryWithoutSign}`} />
            </Helmet>

            {/* <div className='adverts adverts__left'>
                Banner
            </div> */}

            <h3 className='lowTitle' style={{color: 'white'}}>{replaceFunction(props.match.params.subCategory, '-', ' ')}</h3>
            <h3 className='title' style={{color: 'white'}}>{persianSubCategoryWithoutSign}</h3>

            <Tools 
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            />

            {SkeletonLoading(contentLoaded)}

            {
                !(hideQuizzes) &&
                <div>
                    {
                        !(hideQuizzesPointy) &&
                        <h2 className={`container mx-auto px-20`} style={{ color: 'white' }}>کوییز ها</h2>
                    }

                    <ul className={`quizContainer flex flex-ai-fe container mx-auto md:px-20 ml-3 px-2 flex-wrap align-baseline m-2 justify-right md:m-auto`}>
                        {listQuizzes()}
                    </ul>

                    <PageTravel
                        pageTravel={pageTravelQuiz} setPageTravelQuiz={setPageTravelQuiz}
                        numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                        offset={offsetQuiz} setOffset={setOffsetQuiz}
                        currentPageNumber={currentPageNumberQuiz} setCurrentPageNumber={setCurrentPageNumberQuiz}
                    />
                </div>
            }

            {
                !(hideQuizzesPointy) &&
                <div>
                    {
                        !(hideQuizzes) &&
                        <h2 className={`container mx-auto px-20`} style={{ color: 'white' }}>تست ها</h2>
                    }


                    <ul className={`quizContainer flex container mx-auto px-20`}>
                        {listQuizzesPointy()}
                    </ul>

                    <PageTravel
                        pageTravel={pageTravelQuizPointy} setPageTravelQuiz={setPageTravelQuizPointy}
                        numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                        offset={offsetQuizPointy} setOffset={setOffsetQuizPointy}
                        currentPageNumber={currentPageNumberPointy} setCurrentPageNumber={setCurrentPageNumberPointy}
                    />
                </div>
            }

        </React.Fragment>
    );
}
 
export default SubCategory;