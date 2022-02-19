import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Helmet } from "react-helmet";
import axiosInstance from './axiosApi'

import Tools from './tools'
import PageTravel from './pageTravel'
import LoadingScreen from './loadingScreen'
import SkeletonLoading from './skeletonLoading';
import Header from './header'

import { log, replaceFunction, viewsFormat, datePublishHandler } from './base'

const Category = (props) => {
    const [categoryTarget, setCategoryTarget] = useState(props.match.params.category)
    const [pageTravel, setPageTravel] = useState([])
    const [categories, setCategories] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [sortType, setSortType] = useState('bestest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const categoryDefinitionInFarsi = {
        'celebrity': 'سلبریتی',
        'movie-series': 'فیلم و سریال',
        'psychology': 'روانشناسی'
    }
    const currentCategory = categoryDefinitionInFarsi[categoryTarget]

    useEffect(() => {
        searchChangeDetector()
        document.querySelector('html').style = `background: None`
        setLoadState(true)
    })

    useEffect(() => {
        getCategories()
    }, [categoryTarget, sortType, numberOfResult, offset])

    const searchChangeDetector = () => {
        (function(history){
            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
                setCategoryTarget(window.location.pathname.split('/')[2]);
            };
        })(window.history);
    }

    const getCategories = async () => {
        const sortTypeDefinitionForDb = {
            'newest': 'category_new',
            'bestest': 'category_best',
            'alphabet': 'category_alphabet'
        }

        const pageTravelAndCategories = await axiosInstance.get(`/dbAPI/${sortTypeDefinitionForDb[sortType]}/?category__icontains=${categoryTarget}&limit=${numberOfResult}&offset=${offset}`)
        setPageTravel(pageTravelAndCategories.data)
        setCategories(pageTravelAndCategories.data.results)
        setContentLoaded(true)
    }

    const listCategories = () => {
        return (
            categories.map((category) => {
                return (
                    <li key={category.id} className='mr-7 md:mx-4 md:mb-4'>
                        <article className={`
                            flex text-right h-full
                            rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                            quizContainer__trans w-[40rem] md:w-full
                        `}
                        >  {/* bg or trans */}

                            <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                <a className='flex w-full md:block md:grid-cols-5'>
                                    <div className='md:col-span-2 w-[224px] md:h-[126px]'>
                                        <Image
                                            src={category.thumbnail}
                                            width='1366'
                                            height='768'
                                            alt={`${category.subCategory} | ${category.title}`}
                                            blurDataURL={category.thumbnail}
                                            placeholder='blur'
                                            className='rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'
                                        />
                                    </div>
                                    <div className='w-full pt-1 pb-3 pr-1 md:col-span-3 md:mt-2'>
                                        <h2 className={`quizContainer__title quizContainer__title__noViews
                                                        text-sm mr-5 md:w-52 md:mr-0 md:text-base md:grid md:grid-cols-2`}>
                                            <span>{category.title}</span>
                                            <span className='block text-right md:text-left'>{category.subCategory}</span>
                                        </h2>
                                    </div>
                                </a>
                            </Link>
                        </article>
                    </li>
                )
            })
        )
    }

    useEffect(() => {
        getCategories()
    }, [sortType, numberOfResult, offset])

    useEffect(() => {

        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
        setLoadState(true)
    }, [])

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <Header linkType='Hot'/>

            <Helmet>
                <title>{`کوییزلند | کوییز های ${currentCategory} `}</title>
                <meta name="description" content={`کوییزلند کوییز های ${currentCategory}`} />
                <meta name="keywords" content={`بهترین کوییز های ${currentCategory} ,کوییز های ${currentCategory}`} />
            </Helmet>

            <div className='adverts adverts__left'>
                <div id="pos-article-display-28434"></div>
            </div>

            <h3 className='lowTitle'>{categoryQuery}</h3>
            <h3 className='title'>کتگوری {categoryDefinitionInFarsi[categoryQuery]}</h3>

            <Tools
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            />

            {SkeletonLoading(contentLoaded)}

            <ul className="flex flex-wrap m-4 align-baseline quizContainer quizContainer__minHeight md:flex-ai-fe md:container md:px-20 md:justify-right">

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