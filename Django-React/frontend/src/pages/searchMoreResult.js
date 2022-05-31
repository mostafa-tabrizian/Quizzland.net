import React, {useEffect, useState} from 'react';


import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import Header from '../components/header'

import QuizContainer from '../components/quizContainer';;
import { log, takeParameterFromUrl, replaceFunction, sortByNewest } from '../components/base'
import PageTravel from '../components/pageTravel';
import SkeletonLoading from '../components/skeletonLoading';

const SearchMoreResult = () => {
    const [contentLoaded, setContentLoaded] = useState(false)

    const [searchValue, setSearchValue] =useState()

    const [searched_content, set_searched_content] = useState([])
    const [searched_category, set_searched_category] = useState([])

    useEffect(() => {
        searchChangeDetector()
    });

    useEffect(() => {
        set_searched_content([])  // restart list
        set_searched_category([])
        searchHandler(searchValue)
        setContentLoaded(true)
    }, [searchValue])

    const searchChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            setSearchValue(takeParameterFromUrl('q'))
        })(window.history);
    }
    
    const searchValueWithOutSign = searchValue && replaceFunction(searchValue, '+', ' ')

    const searchHandler = async (value) => {
        try {
            const searchedValue = value?.toLowerCase()

            const searched_quiz = await axios.get(`/api/quiz/?public=true`)
            const searched_pointy = await axios.get(`/api/pointy/?public=true`)
            
            const searched_quiz_title = searched_quiz.data.filter(quiz => quiz.title.toLowerCase().includes(searchedValue))
            const searched_quiz_subCategory = searched_quiz.data.filter(quiz => quiz.subCategory.toLowerCase().includes(searchedValue))
            const searched_quiz_tags = searched_quiz.data.filter(quiz => quiz.tags.toLowerCase().includes(searchedValue))

            const searched_pointy_title = searched_pointy.data.filter(quiz => quiz.title.toLowerCase().includes(searchedValue))
            const searched_pointy_subCategory = searched_pointy.data.filter(quiz => quiz.subCategory.toLowerCase().includes(searchedValue))
            const searched_pointy_tags = searched_pointy.data.filter(quiz => quiz.tags.toLowerCase().includes(searchedValue))


            const searched_content = 
                searched_quiz_title
                .concat(searched_quiz_subCategory)
                .concat(searched_quiz_tags)
                .concat(searched_pointy_title)
                .concat(searched_pointy_subCategory)
                .concat(searched_pointy_tags)
                    .sort(sortByNewest)

            const searched_content_noDuplicates = searched_content.filter((content, index, self) =>
                index === self.findIndex((index) => (
                    index.title === content.title
                ))
            )

            // Searched Category

            const searched_category = await axios.get(`/api/subcategory_new/?public=true`)
            
            const searched_category_title = searched_category.data.filter(category => category.title.toLowerCase().includes(searchedValue))
            const searched_category_subCategory = searched_category.data.filter(category => category.subCategory.toLowerCase().includes(searchedValue))
            
            const searched_all_category = 
                searched_category_title
                    .concat(searched_category_subCategory)
                        .sort(sortByNewest)

            const searched_category_noDuplicates = searched_all_category.filter((content, index, self) =>
                index === self.findIndex((index) => (
                    index.subCategory === content.subCategory
                ))
            )

            set_searched_content(searched_content_noDuplicates.slice(0, 200))
            set_searched_category(searched_category_noDuplicates.slice(0, 200))
        } catch (e) {
            log('Error in search | cause : database')
        }
    }

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>{`کوییزلند | ${searchValueWithOutSign} جستجو عبارت `}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                <meta name="robots" content="noindex, follow"></meta>
            </Helmet>

            <div className='md:w-4/5 m-auto'>

                {/* <div className='adverts adverts__left'>
                    <div id='mediaad-DLgb'></div>
                    <div id="pos-article-display-26094"></div>
                </div> */}

                <h3 className='title'>{searchValueWithOutSign}</h3>

                {SkeletonLoading(contentLoaded)}

                <ul className="flex flex-wrap">

                    {
                        searched_category.map((category) => {
                            return (
                                <li key={category.id} className='mr-5 mb-4 md:mb-7 md:mt-5'>
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

                <ul className="flex flex-wrap">


                    {
                        <QuizContainer quizzes={searched_content} bgStyle='trans' />
                    }

                    {
                        searched_content.length == 0 && !contentLoaded &&
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