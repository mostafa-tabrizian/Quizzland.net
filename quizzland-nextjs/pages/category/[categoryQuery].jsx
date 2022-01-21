import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import rateLimit from 'axios-rate-limit';

import Tools from '../../components/tools'
import PageTravel from '../../components/pageTravel'
import Layout from '../../components/layout'
// import LoadingScreen from './loadingScreen'
// import SkeletonLoading from './skeletonLoading';

import { log, replaceFunction, viewsFormat, datePublishHandler } from '../../components/base'

const Category = () => {
    const router = useRouter()
    const { categoryQuery } = router.query

    const [pageTravel, setPageTravel] = useState([])
    const [categories, setCategories] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [sortType, setSortType] = useState('bestest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    
    const categoryDefinitionInFarsi = {
        'celebrity': 'سلبریتی',
        'movie-series': 'فیلم و سریال',
        'psychology': 'روانشناسی'
    }
    const currentCategory = categoryDefinitionInFarsi[categoryQuery]

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    useEffect(() => {
        document.querySelector('html').style=`background: None`
        setLoadState(true)
    }, [])
    
    useEffect(() => {
        getCategories()
    }, [categoryQuery, sortType, numberOfResult, offset])

    const getCategories = async () => {
        const sortTypeDefinitionForDb = {
            'newest': 'category_new',
            'bestest': 'category_best',
            'alphabet': 'category_alphabet'
        }

        const pageTravelAndCategories = await axiosLimited.get(`${API_URL}/dbAPI/${sortTypeDefinitionForDb[sortType]}/?category__icontains=${categoryQuery}&limit=${numberOfResult}&offset=${offset}`)
        setPageTravel(pageTravelAndCategories.data)
        setCategories(pageTravelAndCategories.data.results)
        setContentLoaded(true)
    }

    const listCategories = () => {
        return (
            categories.map((category) => {
                return (
                    <li key={category.id}>
                        <article className={`flex tx-al-r quizContainer__trans`}>
                            <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                <a>
                                    <div>
                                        <Image
                                            src={category.thumbnail}
                                            width='224'
                                            height='126'
                                            alt={`${category.subCategory} | ${category.title}`}    
                                            blurDataURL={category.thumbnail}
                                            placeholder='blur'
                                        />
                                    </div>
                                    <div className="quizContainer__views">{viewsFormat(category.views * 10)}</div>
                                    {/* <div className="quizContainer__date tx-al-c">{datePublishHandler(category.publish)}</div> */}
                                    <span className="quizContainer__title quizContainer__title__noViews flex">
                                        { category.title }
                                    </span>
                                </a>
                            </Link>
                        </article>
                    </li>
                )
            })
        )
    }

    return (
        <>
            <Layout>
                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{`کوییزلند | کوییز های ${currentCategory} `}</title>
                    <meta name="description" content={`کوییزلند کوییز های ${currentCategory}`} />
                    <meta name="keywords" content={`بهترین کوییز های ${currentCategory} ,کوییز های ${currentCategory}`} />
                </Head>

                <div className='adverts adverts__left'>
                    <div id="pos-article-display-28434"></div>
                </div>
                
                <h3 className='lowTitle'>{categoryQuery}</h3>
                <h3 className='title'>کتگوری {categoryDefinitionInFarsi[categoryQuery]}</h3>

                <Tools
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    sortType={sortType} setSortType={setSortType}
                />

                {/* {SkeletonLoading(contentLoaded)} */}

                <ul className="quizContainer quizContainer__minHeight flex wrapper-med">
                    
                    {listCategories()}

                </ul>

                <PageTravel
                    pageTravel={pageTravel} setPageTravel={setPageTravel}
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    offset={offset} setOffset={setOffset}
                />
            </Layout>
        </>
    );
}
 
export default Category;