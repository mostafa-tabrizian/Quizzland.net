import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useLocation } from 'react-router-dom'

import { log, getTheme, replaceFunction } from '../components/base'
import QuizContainer from '../components/quizContainer';
import TestContainer from '../components/testContainer'
import SearchFetchQuiz from '../components/search/searchFetchQuiz'
import SearchFetchTest from '../components/search/searchFetchTest'

const SearchMoreResult = () => {
    const [contentLoaded, setContentLoaded] = useState(false)
    const [searchValue, setSearchValue] = useState()
    const [searched_quiz, set_searched_quiz] = useState([])
    const [searched_test, set_searched_test] = useState([])

    const location = useLocation();

    useEffect(() => {
        set_searched_quiz([])  // restart list
        set_searched_test([])  // restart list
        searchHandler(searchValue && replaceFunction(searchValue, '+', ' '))
        setContentLoaded(true)
    }, [searchValue])

    useEffect(() => {
        setSearchValue(window.location.pathname.split('/')[2])
    }, [location]);

    useEffect(() => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, []);

    const searchValueWithOutSign = searchValue && replaceFunction(searchValue, '+', ' ')

    const searchHandler = async (value) => {
        try {
            set_searched_quiz(await SearchFetchQuiz(value))
            set_searched_test(await SearchFetchTest(value))
        } catch (e) {
            log(e)
            log('Error in search | cause : database')
        }
    }

    return (
        <React.Fragment>

            <Helmet>
                <title>{`جستجو | کوییزلند`}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                <meta name="robots" content="noindex, follow"></meta>
            </Helmet>

            <div className='mr-4 md:w-4/5 md:m-auto'>

                {/* <div className='adverts adverts__left'>
                    <div id='mediaad-DLgb'></div>
                    <div id="pos-article-display-26094"></div>
                </div> */}

                <h3 className='mb-5 title'>{searchValueWithOutSign}</h3>

                <div className='order-1 col-start-1 space-y-5 col-end-3 md:p-4 md:order-1 grid-row-full'>
                    <div>
                        <h1 className='mb-5'>کوییز ها</h1>
                        <ul class="flex flex-wrap align-baseline">
                            {
                                searched_quiz.length ?
                                <QuizContainer quizzes={searched_quiz} bgStyle='trans' />
                                :
                                <div className='flex items-center space-x-3 space-x-reverse'>
                                    <p className='empty'>هیچ کوییزی پیدا نشد!</p>
                                </div>
                            }
                        </ul>
                    </div>
                    <div>
                        <h1 className='mb-5'>تست ها</h1>
                        <ul class="flex flex-col flex-wrap align-baseline md:flex-row">
                            {
                                searched_test.length ?
                                <TestContainer tests={searched_test} bgStyle='trans' />
                                :
                                <div className='flex items-center space-x-3 space-x-reverse'>
                                    <p className='empty'>هیچ تستی پیدا نشد!</p>
                                </div>
                            }
                        </ul>
                    </div>
                </div>

            </div>

        </React.Fragment>
    );
}

export default SearchMoreResult;