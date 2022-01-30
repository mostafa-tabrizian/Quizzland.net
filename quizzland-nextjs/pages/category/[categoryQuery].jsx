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
        document.querySelector('html').style = `background: None`
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

                    <li key={category.id} className='mr-7 md:mx-4 md:mb-4'>
                        <article className={`
                            flex text-right h-full
                            rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                            quizContainer__trans w-[40rem] md:w-full
                        `}
                        >  {/* bg or trans */}

                            <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                <a className='flex md:block md:grid-cols-5 w-full'>
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
                                    <div className='md:col-span-3 pt-1 md:mt-2 w-full pb-3 pr-1'>
                                        <h2 className={`quizContainer__title quizContainer__title__noViews
                                                        text-sm mr-5 md:w-52 md:mr-0 md:text-base md:grid md:grid-cols-2`}>
                                            <span>{category.title}</span>
                                            <span className='text-right md:text-left block'>{category.subCategory}</span>
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

    return (
        <>
            <Layout>
                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{currentCategory && `کوییزلند | کوییز های ${currentCategory} `}</title>
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

                <ul className="quizContainer quizContainer__minHeight flex md:flex-ai-fe m-4 md:container md:px-20 flex-wrap align-baseline md:justify-right">

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