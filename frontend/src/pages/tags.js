import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useLocation } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton';

import QuizContainer from '../components/quizContainer';;
import { log, getTheme, replaceFunction } from '../components/base'
import SearchFetchQuiz from '../components/search/searchFetchQuiz';
import SearchFetchCategory from '../components/search/searchFetchCategory'

const SearchMoreResult = () => {
    const [contentLoaded, setContentLoaded] = useState(false)
    const [searchValue, setSearchValue] = useState()
    const [searched_content, set_searched_content] = useState([])
    const [searched_category, set_searched_category] = useState([])

    const location = useLocation();

    useEffect(() => {
        set_searched_content([])  // restart list
        set_searched_category([])
        searchHandler(searchValue && replaceFunction(searchValue, '+', ' '))
        setContentLoaded(true)
    }, [searchValue])

    useEffect(() => {
        setSearchValue(window.location.pathname.split('/')[2])
    }, [location]);

    useEffect(() => {
        const theme = getTheme()
        document.querySelector('body').style = `background: ${theme == 'dark' ? '#060101' : 'white'}`
    }, []);

    const searchValueWithOutSign = searchValue && replaceFunction(searchValue, '+', ' ')

    const searchHandler = async (value) => {
        try {
            set_searched_content(await SearchFetchQuiz(value))
            set_searched_category(await SearchFetchCategory(value))
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

                <ul className="flex flex-col flex-wrap md:flex-row quizContainer flex-ai-fe justify-right">
                    {
                        searched_category.map((category) => {
                            return (
                                <li key={category.id} className='flex-auto mb-5 md:mr-4 md:mb-4'>
                                    <article className={`
                                        flex text-right h-full
                                        rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                        `}
                                    >

                                        <Link
                                            to={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '+')}?sc=${replaceFunction(category.title, ' ', '-')}`}
                                            className='flex md:block md:grid-cols-5'
                                        >
                                            <div className='md:col-span-2 w-[360px] md:w-[260px] h-[120px] md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                                <img
                                                    src={category.thumbnail}
                                                    width={1366}
                                                    height={768}
                                                    alt={`${category.subCategory} | ${category.title}`}
                                                    className='h-full max-w-fit'
                                                />
                                            </div>
                                            <div className='w-full pt-1 pb-3 pr-1 md:col-span-3 md:mt-2'>
                                                <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                                                text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                                    {category.subCategory}
                                                </h2>
                                                <h2 className={`
                                                    quizContainer__title quizContainer__title__noViews flex
                                                    text-sm mr-5 md:w-52 md:mr-0 md:text-base
                                                `}>
                                                    {category.title}
                                                </h2>
                                                {/* <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                                                {/* <span className="text-center quizContainer__date">
                                                    {datePublishHandler(quiz.publish)}
                                                </span> */}
                                            </div>
                                        </Link>
                                    </article>
                                </li>
                            )
                        })
                    }

                </ul>

                <div className='grid justify-center mb-10'>
                    <hr className="w-[20vw]" />
                </div>

                <ul className="flex flex-col flex-wrap md:flex-row quizContainer flex-ai-fe justify-right">
                    {
                        contentLoaded ?
                        <QuizContainer quizzes={searched_content} bgStyle='trans' />
                        :
                        <h1 className='w-11/12 text-3xl text-center mb-[50vh] '>
                            متاسفانه هیچ چیزی پیدا نشد 😥
                        </h1>
                    }
                </ul>

                {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}

            </div>

        </React.Fragment>
    );
}

export default SearchMoreResult;