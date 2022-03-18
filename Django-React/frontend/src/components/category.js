import React, { useEffect, useState } from 'react'

import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'


import axios from 'axios'

import Tools from './tools'
import PageTravel from './pageTravel'
import LoadingScreen from './loadingScreen'
import SkeletonLoading from './skeletonLoading';
import Header from './header'
import AddView from './addView';

import { log, replaceFunction, viewsFormat, datePublishHandler } from './base'

const Category = (props) => {
    const [categoryQuery, setCategoryQuery] = useState(replaceFunction(window.location.pathname.split('/')[2], '-', ' '))
    const [categoryQueryID, setCategoryQueryID] = useState()
    const [categoryTitle, setCategoryTitle] = useState()
    const [pageTravel, setPageTravel] = useState([])
    const [categories, setCategories] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [sortType, setSortType] = useState('bestest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        searchChangeDetector()
        document.getElementById('html').style='background: linear-gradient(135deg, #000000, #390e10) fixed;'
        setLoadState(true)
    })

    useEffect(() => {
        getCategories()
        defineCategoryTitle()

        log(categoryQueryID)
        AddView('categories', categoryQueryID)

    }, [categoryQuery, categoryQueryID, categoryTitle, sortType, numberOfResult, offset])

    const searchChangeDetector = () => {
        (function(history){
            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
                setCategoryQuery(window.location.pathname.split('/')[2], '-', ' ');
            };
        })(window.history);
    }

    const defineCategoryTitle = async () => {
        await axios.get(`/api/categories/?title_english__icontains=${replaceFunction(categoryQuery)}`)
            .then((response) => {
                setCategoryTitle(response.data[0].title_persian)
                setCategoryQueryID(response.data[0].id)
            })
    }

    const getCategories = async () => {
        const sortTypeDefinitionForDb = {
            'newest': 'subcategory_new',
            'bestest': 'subcategory_best',
            'alphabet': 'subcategory_alphabet'
        }

        categoryQueryID &&
        await axios.get(`/api/${sortTypeDefinitionForDb[sortType]}/?categoryKey=${categoryQueryID}&limit=${numberOfResult}&offset=${offset}`)
            .then((response => {
                setPageTravel(response.data)
                setCategories(response.data.results)
            }))
        setContentLoaded(true)
    }

    const listCategories = () => {
        return (
            categories.map((category) => {
                return (
                    <li key={category.id} className='mr-5 mb-4 md:mb-7 md:mt-5'>
                        <article className={`
                            flex text-right h-full
                            rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                            quizContainer__trans w-[40rem] md:w-full
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
                                                    text-lg mr-5 md:w-52 md:mr-0 md:text-base md:grid md:grid-cols-2`}>
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

            <div className='adverts adverts__left'>
                <div id="pos-article-display-28434"></div>
            </div>

            <h3 className='lowTitle'>{replaceFunction(categoryQuery)}</h3>
            <h3 className='title'>کتگوری {categoryTitle}</h3>

            <Tools
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            />

            {SkeletonLoading(contentLoaded)}

            <ul className="w-[90vw] md:w-4/5 ml-auto mr-0 md:ml-auto md:mr-[15%] flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">

                {listCategories()}

            </ul>

            <PageTravel
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
                currentPageNumber={currentPageNumber} setCurrentPageNumber={setCurrentPageNumber}
            />

        </React.Fragment>
    );
}
 
export default Category;