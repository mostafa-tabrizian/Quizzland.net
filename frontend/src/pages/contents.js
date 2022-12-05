import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom'

import axios from '../components/axiosApi';
import debounce from 'lodash.debounce'

const Tools = React.lazy(() => import('../components/tools'))
import QuizContainer from '../components/quizContainer';
import TestContainer from '../components/testContainer';
import AddView from '../components/addView';
import { log, replaceFunction, sortByNewest, sortByViews, sortByMonthlyViews, takeParameterFromUrl } from '../components/base'
const SkeletonTestContainer = React.lazy(() => import('../components/skeletonTestContainer'))

const Category = (props) => {
    const [categoryQuery, setCategoryQuery] = useState(window.location.pathname.split('/')[2] ? replaceFunction(window.location.pathname.split('/')[2], '-', ' ') : '')
    const [categoryQueryID, setCategoryQueryID] = useState('')
    const [categoryTitle, setCategoryTitle] = useState()
    const [quizzes, setQuizzes] = useState([])
    const [tests, setTests] = useState([])
    const [sortedQuizzes, setSortedQuizzes] = useState([])
    const [sortedTests, setSortedTests] = useState([])
    const [sortType, setSortType] = useState(takeParameterFromUrl('s') || 'trend')
    const [gameType, setGameType] = useState(takeParameterFromUrl('c') || 'quiz')
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    const location = useLocation();

    useEffect(() => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    })

    useEffect(() => {
        defineCategoryTitle()
        fetchQuizzes()
        fetchTests()
        setContentLoaded(true)
    }, [categoryQuery, categoryQueryID, categoryTitle])

    useEffect(() => {
        categoryQueryID && AddView('category', categoryQueryID)
    }, [categoryQueryID])

    useEffect(() => {
        setCategoryQuery(window.location.pathname.split('/')[2] ? replaceFunction(window.location.pathname.split('/')[2], '-', ' ') : '');
    }, [location])

    
    useEffect(() => {
        sortContent()
    }, [quizzes, tests, sortType])

    const categoryTitleToPersian = {
        'celebrity': 'سلبریتی',
        'movie-&-series': 'فیلم و سریال',
        // 'psychology': 'روانشناسی'
    }

    const sortContent = () => {
        switch (sortType) {
            case 'newest':
                whenChangeThisIDKWhyTheSortAffect('sort1')
                setSortedQuizzes(quizzes.sort(sortByNewest))
                setSortedTests(tests.sort(sortByNewest))
                break
            case 'views':
                whenChangeThisIDKWhyTheSortAffect('sort2')
                setSortedQuizzes(quizzes.sort(sortByViews))
                setSortedTests(tests.sort(sortByViews))
                break
            case 'trend':
                whenChangeThisIDKWhyTheSortAffect('sort3')
                setSortedQuizzes(quizzes.sort(sortByMonthlyViews))
                setSortedTests(tests.sort(sortByMonthlyViews))
                break
        }
    }

    const resetCategoryData = () => {
        setCategoryTitle()
        setCategoryQueryID('')
    }

    const defineCategoryTitle = useCallback(
        debounce(
            async () => {
                try {
                    categoryQuery ?
                    await axios.get(`/api/categoryView/?title_english__icontains=${replaceFunction(categoryQuery, '-', ' ')}&public=true`)
                        .then((response) => {
                            setCategoryTitle(response.data[0].title_persian)
                            setCategoryQueryID(response.data[0].id)
                        })
                    :
                    resetCategoryData()
                } catch (err) {}
            }, 500
        )
    )

    const fetchQuizzes = useCallback(
        debounce(
            async () => {
                await axios.get(`/api/quizV2View/?categoryKey=${categoryQueryID}&public=true`)
                    .then(res => {
                        setQuizzes(res.data.sort(sortByMonthlyViews))
                    })
            }, 500
        )
    )

    const fetchTests = useCallback(
        debounce(
            async () => {
                await axios.get(`/api/testView/?categoryKey=${categoryQueryID}&public=true`)
                    .then(res => {
                        setTests(res.data.sort(sortByMonthlyViews))
                    })
            }, 500
        )
    )

    return (
        <React.Fragment>
            <Helmet>
                <title>{`کوییز های ${categoryTitleToPersian[props.match.params.category]} | کوییزلند`}</title>
                <meta name="description" content={`کوییزلند کوییز های ${categoryTitle}`} />
                <meta name="keywords" content={`بهترین کوییز های ${categoryTitle} ,کوییز های ${categoryTitle}`} />
            </Helmet>

            <div className='mr-4 md:w-4/5 md:m-auto'>

                {/* <div className='adverts adverts__left'>
                    <div id="pos-article-display-28434"></div>
                </div> */}

                <div className='mb-5'>
                    <h3 className='lowTitle'>{replaceFunction(categoryQuery, '-', ' ')}</h3>
                    <h3 className='title'>{categoryTitle ? `کتگوری ${categoryTitle}` : 'کوییز و تست ها'}</h3>
                </div>

                {
                    contentLoaded ?
                    <div>
                        <div className='grid grid-cols-2 w-[22rem] mx-auto my-12 justify-center'>
                            <h3 className={`${gameType == 'quiz' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { setGameType('quiz') }} type='button'>کوییز ها</button></h3>
                            <h3 className={`${gameType == 'test' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { setGameType('test') }} type='button'>تست ها</button></h3>
                        </div>

                        <Tools
                            sortType={sortType} setSortType={setSortType}
                        />
    
                        <ul className={`${gameType == 'quiz' ? 'pop_up opacity-100' : 'pop_down opacity-0 absolute'} flex flex-wrap align-baseline`}>
                            <QuizContainer quizzes={sortedQuizzes} bgStyle={'trans'} />
                        </ul>

                        <ul className={`${gameType == 'test' ? 'pop_up opacity-100' : 'pop_down opacity-0 absolute'} flex flex-col flex-wrap align-baseline md:flex-row`}>
                            <TestContainer tests={sortedTests} bgStyle={'trans'} />
                        </ul>
                    </div>
                    :
                    <SkeletonTestContainer />
                }   
            </div>
            
        </React.Fragment>
    );
}

export default Category;