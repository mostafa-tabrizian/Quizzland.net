import axios from 'axios';
import React, { useEffect, useState } from 'react'
import rateLimit from 'axios-rate-limit';
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

// import LoadingScreen from './loadingScreen'
import PageTravel from '../components/pageTravel'
import QuizContainer from '../components/quizContainer'
import QuizPointyContainer from '../components/quizPointyContainer'
import Layout from '../components/layout'
import SkeletonLoading from '../components/skeleton'

import { log } from '../components/base'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Sort = () => {
    const router = useRouter()
    const { st } = router.query

    const [loadState, setLoadState] = useState()
    const [quizzes, setQuizzes] = useState([])
    const [pointy, setPointy] = useState([])
    const [sortTitle, setSortTitle] = useState()
    const [pageTravel, setPageTravel] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        setPointy([])  // restart list
        setQuizzes([])  // restart list
        checkWhatSort()
        getQuizzes()
        setLoadState(true)
    }, [st, numberOfResult, offset])

    useEffect(() => {
        setOffset(0)
        setCurrentPageNumber(1)
        setNumberOfResult(16)
    }, [st])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 15, perMilliseconds: 1000, maxRPS: 150 })

    const checkWhatSort = async () => {
        document.querySelector('html').style = `background: None`
    }

    const getQuizzes = async () => {
        setContentLoaded(false)
        let quizzes

        switch (st) {
            case 'newest':
                quizzes = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?limit=${numberOfResult}&offset=${offset}`)
                setSortTitle('جدیدترین کوییز ها')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest':
                quizzes = await axiosLimited.get(`${API_URL}/dbAPI/quiz_best/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                setSortTitle('بهترین کوییز ها')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthlyBestest':
                quizzes = await axiosLimited.get(`${API_URL}/dbAPI/quiz_monthlyBest/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                setSortTitle('بهترین کوییز های این ماه')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'newest_test':
                quizzes = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?limit=${numberOfResult}&offset=${offset}`)
                setSortTitle('جدیدترین تست ها')
                setPointy(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest_test':
                quizzes = await axiosLimited.get(`${API_URL}/dbAPI/pointy_best/?limit=${numberOfResult}&offset=${offset}`)
                setSortTitle('بهترین تست ها')
                setPointy(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthlyBestest_test':
                quizzes = await axiosLimited.get(`${API_URL}/dbAPI/pointy_monthlyBest/?limit=${numberOfResult}&offset=${offset}`)
                setSortTitle('بهترین تست های این ماه')
                setPointy(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            default:
                setSortTitle('این بخش موجود نمی باشد !')
                setContentLoaded(true)
                break
        }
    }

    return (

        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{`${sortTitle} | کوییزلند`}</title>
                    <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                    <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
                </Head>

                <div className='adverts adverts__left'>
                    <div id='mediaad-DLgb'></div>
                    <div id="pos-article-display-26094"></div>
                </div>

                <h3 className='title'>{sortTitle}</h3>

                {SkeletonLoading(contentLoaded)}

                <ul className="container flex flex-wrap m-4 align-baseline quizContainer flex-ai-fe md:px-20 justify-right">

                    {
                        quizzes.length !== 0 && <QuizContainer quizzes={quizzes} bgStyle='trans' />
                    }

                    {
                        pointy.length !== 0 && <QuizPointyContainer quizzes={pointy} bgStyle='trans' />
                    }

                </ul>

                {/* Adverts */}

                <PageTravel
                    pageTravel={pageTravel} setPageTravel={setPageTravel}
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    offset={offset} setOffset={setOffset}
                    currentPageNumber={currentPageNumber} setCurrentPageNumber={setCurrentPageNumber}
                />

                {/* Adverts */}
                <div className='adverts_center' id='mediaad-DLgb'></div>
            </Layout>
        </>
    );
}

export default Sort;