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
    const [countResult, setCountResult] = useState(25)
    const [offset, setOffset] = useState(0)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [sortType, setSortType] = useState('trend')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()

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

    const categoryTitleToPersian = {
        'celebrity': 'سلبریتی',
        'movie-&-series': 'فیلم و سریال',
        'psychology': 'روانشناسی'
    }

    const sortContent = () => {
        switch (sortType) {
            case 'newest':
                whenChangeThisIDKWhyTheSortAffect('sort1')
                setSortedCategories(categories.sort(sortByNewest))
                break
            case 'views':
                whenChangeThisIDKWhyTheSortAffect('sort2')
                setSortedCategories(categories.sort(sortByViews))
                break
            case 'trend':
                whenChangeThisIDKWhyTheSortAffect('sort3')
                setSortedCategories(categories.sort(sortByMonthlyViews))
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
                setCategories(response.data.results.sort(sortByMonthlyViews))
            }))
        setContentLoaded(true)
    }

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>{`کوییز های ${categoryTitleToPersian[props.match.params.category]} | کوییزلند`}</title>
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
                    sortType={sortType} setSortType={setSortType}
                />

                {SkeletonLoading(contentLoaded)}

                <ul className="flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">

                    {
                        sortedCategories.map((category) => {
                            return (
                                <li key={category.id} className='md:mr-5 md:mb-5 mb-5 flex-auto'>
                                    <article className={`
                                        flex text-right h-full
                                        rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                    `}>
            
                                        <Link
                                            to={`/category/${categoryQuery}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}
                                            className='flex md:block md:grid-cols-5'
                                        >
                                            <div className='md:col-span-2 md:w-[260px] h-[7rem] md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                                <img
                                                    src={category.thumbnail}
                                                    width={1366}
                                                    height={768}
                                                    alt={`${category.subCategory} | ${category.title}`}
                                                    className='h-full object-cover'
                                                />
                                            </div>
                                            <div className='w-full pt-1 pb-3 pr-4 md:pr-0 md:col-span-3 md:mt-2'>
                                                <h2 className={`
                                                    quizContainer__title quizContainer__title__noViews flex m-auto md:m-0
                                                    text-xl md:w-52 md:text-base
                                                `}>
                                                    {category.title}
                                                </h2>
                                                <h3 className={`
                                                    quizContainer__title quizContainer__title__noViews flex
                                                    text-lg w-[10rem] md:w-52 md:text-base
                                                `}>
                                                    {category.subCategory}
                                                </h3>
                                            </div>
                                        </Link>
                                    </article>
                                </li>
                            )
                        })
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