import React, {useEffect, useState} from 'react';
// import axiosInstance from './axiosApi'

import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import Header from './header'

import QuizContainer from './quizContainer';
import QuizPointyContainer from './quizPointyContainer';
import { log, takeParameterFromUrl, replaceFunction } from './base'
import PageTravel from './pageTravel';
import SkeletonLoading from './skeletonLoading'

const SearchMoreResult = () => {
    const [contentLoaded, setContentLoaded] = useState(false)
    const [loadState, setLoadState] = useState()

    const [searchValue, setSearchValue] =useState()

    const [categories, setCategories] = useState([])
    const [quizzes, setQuizzes] = useState([])
    const [pointies, setPointies] = useState([])

    useEffect(() => {
        searchChangeDetector()
    });

    useEffect(() => {
        setQuizzes([])  // restart list
        setPointies([])  // restart list
        setCategories([])  // restart list
        searchValue && searchHandler(searchValue)
        setLoadState(true)
        setContentLoaded(true)
    }, [searchValue])

    const searchChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            setSearchValue(replaceFunction(takeParameterFromUrl('q'), ' ', '+'))
        })(window.history);
    }

    const searchValueWithOutSign = searchValue && replaceFunction(searchValue, '+', ' ')

    const searchHandler = async () => {
        try {
            let matchedQuizzes = []
            let matchedPointies = []
            let matchedCategories = []

            // Search Quiz
            const search_quiz_new_title = await axios.get(`/dbAPI/quiz_new/?title__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_title.data.results)

            const search_quiz_new_subCategory = await axios.get(`/dbAPI/quiz_new/?subCategory__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_subCategory.data.results)

            const search_quiz_new_tag = await axios.get(`/dbAPI/quiz_new/?tags__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_tag.data.results)

            // Search Pointy Quiz
            const search_pointy_new_title = await axios.get(`/dbAPI/pointy_new/?title__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedPointies, search_pointy_new_title.data.results)

            const search_pointy_new_subCategory = await axios.get(`/dbAPI/pointy_new/?subCategory__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedPointies, search_pointy_new_subCategory.data.results)

            const search_pointy_new_tag = await axios.get(`/dbAPI/pointy_new/?tags__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedPointies, search_pointy_new_tag.data.results)

            // Search Category
            const search_category_new_title = await axios.get(`/dbAPI/category_new/?title__icontains=${searchValue}&limit=2`)
            Array.prototype.push.apply(matchedCategories, search_category_new_title.data.results)

            const search_category_new_subCategory = await axios.get(`/dbAPI/category_new/?subCategory__icontains=${searchValue}&limit=2`)
            Array.prototype.push.apply(matchedCategories, search_category_new_subCategory.data.results)

            // Remove duplicated quizzes
            let uniqueMatchedQuizzes = {};

            for ( let i = 0; i < matchedQuizzes.length; i++ )
                uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];

            matchedQuizzes = new Array();
            for ( let key in uniqueMatchedQuizzes )
                matchedQuizzes.push(uniqueMatchedQuizzes[key]);

            let uniqueMatchedPointies = {};

            for (let i = 0; i < matchedPointies.length; i++) {
                uniqueMatchedPointies[matchedPointies[i]['title']] = matchedPointies[i];
            }

            matchedPointies = new Array();
            for (let key in uniqueMatchedPointies) {
                matchedPointies.push(uniqueMatchedPointies[key]);
            }
    
            setQuizzes(matchedQuizzes)
            setPointies(matchedPointies)
            setCategories(matchedCategories)

        } catch (e) {
            log(e)
            return log('error: search function')
        }
    }

    return (
        <React.Fragment>

            <Header linkType='Hot'/>

            <Helmet>
                <title>{`کوییزلند | ${searchValueWithOutSign} جستجو عبارت `}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                <meta name="robots" content="noindex, follow"></meta>
            </Helmet>

            <div className='adverts adverts__left'>
                <div id='mediaad-DLgb'></div>
                <div id="pos-article-display-26094"></div>
            </div>

            <h3 className='title'>{searchValueWithOutSign}</h3>

            {SkeletonLoading(contentLoaded)}

            <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">

                {
                    categories.map((category) => {
                        return (
                            <li key={category.id} className='mr-5 mb-4 md:mb-7 md:mt-5'>
                                <article className={`
                                    flex text-right h-full
                                    rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                    quizContainer__trans`}
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
                                                className=' h-full max-w-fit '
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

            <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">


                {
                    <QuizContainer quizzes={quizzes} bgStyle='trans' />
                }


                {
                    <QuizPointyContainer quizzes={pointies} bgStyle='trans' />
                }

                {
                    quizzes.length == 0 &&
                    pointies.length == 0 &&
                    <h1 className='w-11/12 text-3xl text-center mb-[50vh] '>
                        متاسفانه هیچ چیزی پیدا نشد 😥
                    </h1>
                }

            </ul>

            <div className='adverts_center' id='mediaad-DLgb'></div>

        </React.Fragment>
    );
}
 
export default SearchMoreResult;