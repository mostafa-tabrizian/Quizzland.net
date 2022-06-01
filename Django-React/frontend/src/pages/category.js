import React, { useEffect, useState } from 'react'

import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'


import axios from 'axios'

import Tools from '../components/tools'
import PageTravel from '../components/pageTravel'
import LoadingScreen from '../components/loadingScreen'
import SkeletonLoading from '../components/skeletonLoading';
import Header from '../components/header'
import AddView from '../components/addView';

import { log, replaceFunction, sortByNewest, sortByViews, sortByMonthlyViews, sortByAlphabet } from '../components/base'

const Category = (props) => {
    const [categoryQuery, setCategoryQuery] = useState(replaceFunction(window.location.pathname.split('/')[2], '-', ' '))
    const [categoryQueryID, setCategoryQueryID] = useState()
    const [categoryTitle, setCategoryTitle] = useState()
    const [pageTravel, setPageTravel] = useState([])
    const [categories, setCategories] = useState([])
    const [sortedCategories, setSortedCategories] = useState([])
    const [countResult, setCountResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [sortType, setSortType] = useState('views')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        searchChangeDetector()
        document.getElementById('html').style='background: #121212'
        setLoadState(true)
    })

    useEffect(() => {
        getCategories()
        defineCategoryTitle()
    }, [categoryQuery, categoryQueryID, categoryTitle, countResult, offset])

    useEffect(() => {
        categoryQueryID && AddView('category', categoryQueryID)
    }, [categoryQueryID])

    useEffect(() => {
        sortContent()
        returnCategories()
    }, [categories, sortType])

    const searchChangeDetector = () => {
        (function(history){
            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
                setCategoryQuery(window.location.pathname.split('/')[2], '-', ' ');
            };
        })(window.history);
    }

    const sortContent = () => {
        switch (sortType) {
            case 'newest':
                setSortedCategories(categories.sort(sortByNewest))
                break
            case 'views':
                setSortedCategories(categories.sort(sortByViews))
                break
            case 'monthlyViews':
                setSortedCategories(categories.sort(sortByMonthlyViews))
                break
            case 'alphabet':
                setSortedCategories(categories.sort(sortByAlphabet))
                break
        }
    }

    const defineCategoryTitle = async () => {
        await axios.get(`/api/category/?title_english__icontains=${replaceFunction(categoryQuery, '-', ' ')}&public=true`)
            .then((response) => {
                setCategoryTitle(response.data[0].title_persian)
                setCategoryQueryID(response.data[0].id)
            })
    }

    const getCategories = async () => {
        categoryQueryID &&
        await axios.get(`/api/subcategory/?categoryKey=${categoryQueryID}&limit=${countResult}&offset=${offset}&public=true`)
            .then((response => {
                setPageTravel(response.data)
                setCategories(response.data.results)
            }))
        setContentLoaded(true)
    }

    const returnCategories = () => {
        return (
            sortedCategories.map((category) => {
                return (
                    <li key={category.id} className='mr-5 mb-4 md:mb-7 md:mt-5'>
                        <article className={`
                            flex text-right h-full
                            rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                            w-[33rem] md:w-full md:max-w-[16rem]
                        `}
                        >  {/* bg or trans */}

                            <Link
                                to={`/category/${categoryQuery}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}
                                className='flex w-full md:block md:grid-cols-5 mb-4'
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
                                    <h2 className={`quizContainer__title quizContainer__title__noViews
                                                    text-lg mr-5 md:w-full md:mr-0 md:text-base md:grid md:grid-cols-2`}>
                                        <span>{category.title}</span>
                                        <span className='block text-right md:text-left'>{category.subCategory}</span>
                                    </h2>
                                </div>
                            </Link>
                        </article>
                    </li>
                )
            })
        )
    }

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>{`کوییزلند | کوییز های ${categoryTitle} `}</title>
                <meta name="description" content={`کوییزلند کوییز های ${categoryTitle}`} />
                <meta name="keywords" content={`بهترین کوییز های ${categoryTitle} ,کوییز های ${categoryTitle}`} />
            </Helmet>

            <div className='md:w-4/5 m-auto'>
                <div className='adverts adverts__left'>
                    <div id="pos-article-display-28434"></div>
                </div>

                <h3 className='lowTitle'>{replaceFunction(categoryQuery, '-', ' ')}</h3>
                <h3 className='title'>کتگوری {categoryTitle}</h3>

                <Tools
                    countResult={countResult} setCountResult={setCountResult}
                    sortType={sortType} setSortType={setSortType}
                />

                {SkeletonLoading(contentLoaded)}

                <ul className="flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">

                    {
                        returnCategories()
                    }

                </ul>

                <PageTravel
                    pageTravel={pageTravel} setPageTravel={setPageTravel}
                    countResult={countResult} setCountResult={setCountResult}
                    offset={offset} setOffset={setOffset}
                    currentPageNumber={currentPageNumber} setCurrentPageNumber={setCurrentPageNumber}
                />
            </div>

        </React.Fragment>
    );
}
 
export default Category;