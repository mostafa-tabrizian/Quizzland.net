import axios from 'axios';
import React, { useEffect, useState } from 'react'
import rateLimit from 'axios-rate-limit';
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

// import LoadingScreen from './loadingScreen'
import PageTravel from '../components/pageTravel'
import QuizContainer from '../components/quizContainer'
import QuizPointyContainer from '../components/quizPointyContainer'
import Layout from '../components/layout'
import SkeletonLoading from '../components/skeleton'

import { log, replaceFunction, isItMobile } from '../components/base'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Search = () => {
    const router = useRouter()
    const { q } = router.query

    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    const [categories, setCategories] = useState([])
    const [quizzes, setQuizzes] = useState([])
    const [pointies, setPointies] = useState([])

    useEffect(() => {
        setQuizzes([])  // restart list
        setPointies([])  // restart list
        setCategories([])  // restart list
        q && searchHandler(q)
        setLoadState(true)
        setContentLoaded(true)
    }, [q])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 15, perMilliseconds: 1000, maxRPS: 150 })

    const searchHandler = async (value) => {
        try {
            let searchValue = replaceFunction(value, ' ', '+')

            let matchedQuizzes = []
            let matchedPointies = []
            let matchedCategories = []

            // Search Quiz
            const search_quiz_new_title = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?title__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_title.data.results)

            const search_quiz_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_subCategory.data.results)

            const search_quiz_new_tag = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?tags__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_tag.data.results)

            // Search Pointy Quiz
            const search_pointy_new_title = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?title__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedPointies, search_pointy_new_title.data.results)

            const search_pointy_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?subCategory__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedPointies, search_pointy_new_subCategory.data.results)

            const search_pointy_new_tag = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?tags__icontains=${searchValue}&limit=50`)
            Array.prototype.push.apply(matchedPointies, search_pointy_new_tag.data.results)

            // Search Category
            const search_category_new_title = await axiosLimited.get(`${API_URL}/dbAPI/category_new/?title__icontains=${searchValue}&limit=2`)
            Array.prototype.push.apply(matchedCategories, search_category_new_title.data.results)

            const search_category_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/category_new/?subCategory__icontains=${searchValue}&limit=2`)
            Array.prototype.push.apply(matchedCategories, search_category_new_subCategory.data.results)


            // Remove duplicated quizzes
            let uniqueMatchedQuizzes = {};

            for (let i = 0; i < matchedQuizzes.length; i++) {
                uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];
            }

            matchedQuizzes = new Array();
            for (let key in uniqueMatchedQuizzes) {
                matchedQuizzes.push(uniqueMatchedQuizzes[key]);
            }

            // Remove duplicated pointies

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
            // log(e)
            return log('error: search function')
        }
    }

    return (

        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{`${q} | کوییزلند`}</title>
                    <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                    <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
                </Head>

                <div className='adverts adverts__left'>
                    <div id='mediaad-DLgb'></div>
                    <div id="pos-article-display-26094"></div>
                </div>

                <h3 className='title'>{q}</h3>

                {SkeletonLoading(contentLoaded)}

                <ul className="container flex flex-wrap m-4 align-baseline quizContainer flex-ai-fe md:px-20 justify-right">

                    {
                        categories.map((quiz) => {
                            return (
                                <li key={quiz.id} className='ml-1 mr-7 md:m-2 md:mb-6'>
                                    <article className={`
                                        flex text-right h-full
                                        rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                        quizContainer__trans`}
                                    >

                                        <a href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}
                                            className='flex md:block md:grid-cols-5'
                                        >
                                            <div className='md:col-span-2 w-[224px] md:h-[126px]'>
                                                <Image
                                                    src={quiz.thumbnail}
                                                    width='1366'
                                                    height='768'
                                                    alt={`${quiz.subCategory} | ${quiz.title}`}
                                                    blurDataURL={quiz.thumbnail}
                                                    placeholder='blur'
                                                    className='rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'
                                                />
                                            </div>
                                            <div className='w-full pt-1 pb-3 pr-1 md:col-span-3 md:mt-2'>
                                                <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                                                text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                                    {quiz.subCategory}
                                                </h2>
                                                <h2 className={`
                                                    quizContainer__title quizContainer__title__noViews flex
                                                    text-sm mr-5 md:w-52 md:mr-0 md:text-base
                                                `}>
                                                    {quiz.title}
                                                </h2>
                                                {/* <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                                                {/* <span className="text-center quizContainer__date">
                                                    {datePublishHandler(quiz.publish)}
                                                </span> */}
                                            </div>
                                        </a>
                                    </article>
                                </li>
                            )
                        })
                    }

                </ul>

                <div className='grid justify-center mb-10'>
                    <hr className="w-[20vw]" />
                </div>

                <ul className="container flex flex-wrap m-4 align-baseline quizContainer flex-ai-fe md:px-20 justify-right">


                    {
                        <QuizContainer quizzes={quizzes} bgStyle='trans' />
                    }


                    {
                        <QuizPointyContainer quizzes={pointies} bgStyle='trans' />
                    }

                    {
                        quizzes.length == 0 &&
                        pointies.length == 0 &&
                        <h1 className='w-11/12 text-3xl text-center'>
                            متاسفانه هیچ چیزی پیدا نشد 😥
                        </h1>
                    }

                </ul>

                <div className='adverts_center' id='mediaad-DLgb'></div>

            </Layout>
        </>
    );
}

export default Search;