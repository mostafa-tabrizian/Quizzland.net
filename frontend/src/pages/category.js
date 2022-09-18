import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from "react-helmet";
import { Link, useLocation } from 'react-router-dom'
import axios from '../components/axiosApi';
import debounce from 'lodash.debounce'
import Skeleton from '@mui/material/Skeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Tools = React.lazy(() => import('../components/tools'))
const PageTravel = React.lazy(() => import('../components/pageTravel'))
import AddView from '../components/addView';
import { log, getTheme, replaceFunction, sortByNewest, sortByViews, sortByMonthlyViews } from '../components/base'
const SkeletonQuizContainer = React.lazy(() => import('../components/skeletonQuizContainer'))

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
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const location = useLocation();

    useEffect(() => {
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
    })

    useEffect(() => {
        getCategories()
        defineCategoryTitle()
    }, [categoryQuery, categoryQueryID, categoryTitle, countResult, offset])

    useEffect(() => {
        categoryQueryID && AddView('categoryView', categoryQueryID)
    }, [categoryQueryID])

    useEffect(() => {
        setCategoryQuery(window.location.pathname.split('/')[2], '-', ' ');
    }, [location])
    
    useEffect(() => {
        sortContent()
    }, [categories, sortType])

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

    const defineCategoryTitle = useCallback(
        debounce(
            async () => {
                try {
                    await axios.get(`/api/categoryView/?title_english__icontains=${replaceFunction(categoryQuery, '-', ' ')}&public=true`)
                        .then((response) => {
                            setCategoryTitle(response.data[0].title_persian)
                            setCategoryQueryID(response.data[0].id)
                        })
                } catch (err) {}
            }, 500
        )
    )

    const getCategories = useCallback(
        debounce(
            async () => {
                categoryQueryID &&
                await axios.get(`/api/subcategoryView/?categoryKey=${categoryQueryID}&limit=${countResult}&offset=${offset}&public=true`)
                    .then((response => {
                        setPageTravel(response.data)
                        setCategories(response.data.results.sort(sortByMonthlyViews))
                    }))
                    setContentLoaded(true)
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
                <div className='adverts adverts__left'>
                    <div id="pos-article-display-28434"></div>
                </div>

                <div className='mb-5'>
                    <h3 className='lowTitle'>{replaceFunction(categoryQuery, '-', ' ')}</h3>
                    <h3 className='title'>کتگوری {categoryTitle}</h3>
                </div>

                {
                    contentLoaded ?
                    <div>
                        <Tools
                            sortType={sortType} setSortType={setSortType}
                        />
    
                        {
                            sortedCategories.length ?
                            <React.Fragment>

                                <ul className="flex flex-col flex-wrap align-baseline md:flex-row quizContainer flex-ai-fe justify-right">
                                    {
                                        sortedCategories.map((category) => {
                                            return (
                                                <li key={category.id} className='flex-auto mb-5 md:mr-5 md:mb-5'>
                                                    <article className={`
                                                        flex text-right h-full
                                                        rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                                    `}>
            
                                                        <Link
                                                            to={`/category/${categoryQuery}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}
                                                            className='flex md:block md:grid-cols-5'
                                                        >
                                                            <div className='md:col-span-2 md:w-[260px] h-[7rem] md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                                                <LazyLoadImage
                                                                    src={category.thumbnail}
                                                                    alt={`${category.subCategory} | ${category.title}`}
                                                                    className='object-cover h-full'
                                                                    effect="blur"
                                                                    placeholder={<Skeleton variant="rounded" animation="wave" width={220} height={120} />}
                                                                />
                                                            </div>
                                                            <div className='w-full pt-1 pb-3 pr-4 md:pr-0 md:col-span-3 md:mt-2'>
                                                                <h2 className={`
                                                                    quizContainer__title quizContainer__title__noViews flex m-auto md:m-0
                                                                    md:w-52
                                                                `}>
                                                                    {category.title}
                                                                </h2>
                                                                <h3 className={`
                                                                    quizContainer__title quizContainer__title__noViews flex
                                                                    w-[10rem] md:w-52
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
                            </React.Fragment>
                            :
                            <div className='flex justify-center space-x-3 items-center space-x-reverse'>
                                <p className='empty my-16'>هیچ کتگوری پیدا نشد!</p>
                            </div>
                        }
                    </div>
                    :
                    <SkeletonQuizContainer />
                }   
            </div>
            
        </React.Fragment>
    );
}

export default Category;