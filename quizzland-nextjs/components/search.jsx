import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, isItMobile } from './base'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Search = (props) => {
    const [categoriesList, setCategoriesList] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [searchMobile, setSearchMobile] = useState(false)
    const [searchResult, setSearchResult] = useState(false)
    const [searchValue, setSearchValue] = useState(null)
    const [searchSuggestion, setSearchSuggestion] = useState(null)

    const searchSubmit = useRef()
    const mobileSearchInput = useRef()

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    useEffect(() => {
        searchSuggester()
    }, [])

    const searchMobileFocusChangedHideOrShow = () => {
        const menuIsOpened = !(searchMobile)
        if (menuIsOpened) {
            document.body.style.overflow = 'hidden'
            setTimeout(() => {
                mobileSearchInput.current.focus()
            }, 18)
        } else {
            document.body.style.overflow = 'overlay'
        }
        setSearchMobile(searchMobile ? false : true)
        
        // if (typeof window !== 'undefined') {
        //     document.body.addEventListener(("click"), (e) => {
        //         if (!e.target.className.includes('header__search__result__quizzes') && !e.target.className.includes('header__search__input')) {
        //             setSearchResult(false)
        //         }
        //     })
        // }
    }

    const searchHandler = async (value) => {
        try {
            const minimumKeywordForSearch = 3
            if (value.length >= minimumKeywordForSearch) {
                let searchValue = replaceFunction(value, ' ', '+')
                setSearchValue(searchValue)

                let matchedQuizzes = []
                let matchedCategories = []

                // Search Quiz
                const search_quiz_new_title = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?title__icontains=${searchValue}&limit=10`)
                Array.prototype.push.apply(matchedQuizzes, search_quiz_new_title.data.results)

                if (search_quiz_new_title.data.results !== 10) {
                    const search_quiz_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${searchValue}&limit=10`)
                    Array.prototype.push.apply(matchedQuizzes, search_quiz_new_subCategory.data.results)

                    if (search_quiz_new_subCategory.length !== 10) {
                        const search_quiz_new_tag = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?tags__icontains=${searchValue}&limit=10`)
                        Array.prototype.push.apply(matchedQuizzes, search_quiz_new_tag.data.results)
                    }
                }

                // Search Pointy Quiz
                const search_pointy_new_title = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?title__icontains=${searchValue}&limit=5`)
                Array.prototype.push.apply(matchedQuizzes, search_pointy_new_title.data.results)

                if (search_pointy_new_title.length !== 5) {
                    const search_pointy_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?subCategory__icontains=${searchValue}&limit=5`)
                    Array.prototype.push.apply(matchedQuizzes, search_pointy_new_subCategory.data.results)

                    if (search_pointy_new_subCategory.length !== 5) {
                        const search_pointy_new_tag = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?tags__icontains=${searchValue}&limit=2`)
                        Array.prototype.push.apply(matchedQuizzes, search_pointy_new_tag.data.results)
                    }
                }

                // Search Category
                const search_category_new_title = await axiosLimited.get(`${API_URL}/dbAPI/category_new/?title__icontains=${searchValue}&limit=2`)
                Array.prototype.push.apply(matchedCategories, search_category_new_title.data.results)

                if (search_category_new_title.length !== 2) {
                    const search_category_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/category_new/?subCategory__icontains=${searchValue}&limit=2`)
                    Array.prototype.push.apply(matchedCategories, search_category_new_subCategory.data.results)
                }

                // Remove duplicated quizzes
                let uniqueMatchedQuizzes = {};
                let maxQuizSearchResult

                if (matchedQuizzes.length >= 6) {
                    if (isItMobile()) maxQuizSearchResult = 4 + 1
                    else maxQuizSearchResult = 7
                }
                else {
                    maxQuizSearchResult = matchedQuizzes.length
                }

                for (let i = 0; i < maxQuizSearchResult; i++) {
                    uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];
                }

                matchedQuizzes = new Array();
                for (let key in uniqueMatchedQuizzes) {
                    matchedQuizzes.push(uniqueMatchedQuizzes[key]);
                }

                const quizzesList = () => {
                    matchedQuizzes.length >= 1 && setSearchResult(true)  // show search result if there quizzes

                    try {
                        return (
                            matchedQuizzes.map((quiz) => {
                                return (
                                    <li key={quiz.id} className='ml-1 mr-7 md:m-2 md:mb-6'>
                                        <article className={`
                                            flex text-right h-full
                                            rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                            quizContainer__trans`}
                                        >
                                            <Link href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                                <a className='flex md:block md:grid-cols-5'>
                                                    <div className='col-span-2 w-[224px] h-[126px]'>
                                                        <Image
                                                            src={quiz.thumbnail}
                                                            alt={`${quiz.subCategory}} | ${quiz.title}`}
                                                            blurDataURL={quiz.thumbnail}
                                                            width='1366'
                                                            height='768'
                                                            placeholder='blur'
                                                            className='rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'
                                                        />
                                                    </div>
                                                    <div className="col-span-3 mt-2 header__search__result__title">
                                                        <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                                                    text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                                            {quiz.subCategory}
                                                        </h2>
                                                        <h2 className={`
                                                        quizContainer__title quizContainer__title__noViews flex
                                                        text-sm mr-5 ml-5 md:w-52 md:mr-0 md:text-base
                                                    `}>
                                                            {quiz.title}
                                                        </h2>
                                                    </div>
                                                </a>
                                            </Link>
                                        </article>
                                    </li>
                                )
                            })
                        )
                    } catch { e } {
                        // log('no quiz found...')
                        return null
                    }
                }

                const categoriesList = () => {
                    try {
                        return (
                            matchedCategories.map((category) => {
                                return (
                                    <div key={category.id}>
                                        <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                            <a>
                                                <Image
                                                    src={category.thumbnail}
                                                    alt={`${category.subCategory}} | های ${category.title_far}}`}
                                                    blurDataURL={category.thumbnail}
                                                    width='1366'
                                                    height='768'
                                                    placeholder='blur'
                                                />
                                            </a>
                                        </Link>

                                        <h5 className='absolute left-6 top-6 md:relative md:left-0 md:top-0 md:text-center'>
                                            <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                                <a>
                                                    {category.subCategory}
                                                </a>
                                            </Link>
                                        </h5>

                                    </div>
                                )
                            })
                        )
                    } catch (e) {
                        // log('no category found...')
                        return null
                    }
                }

                setQuizzesList(quizzesList)
                setCategoriesList(categoriesList)
            }
        } catch (e) {
            log('Error in search | cause : database')
        }
    }

    const inputChanged = (input) => {
        searchHandler(input.target.value)
    }

    const searchSuggester = async () => {
        const grabAllSubCategories = await axiosLimited.get(`${API_URL}/dbAPI/category_new/`)
        const numberOfCategories = grabAllSubCategories.data.length
        const randomCategoryIndex = Math.floor(Math.random() * numberOfCategories);
        setSearchSuggestion(grabAllSubCategories.data[randomCategoryIndex].title)
    }

    return (
        <>
            <div className={`header__search flex ${props.colorOfHeader}`}>
                <button
                    className={`
                        absolute right-[-1rem] top-1.5
                        ${searchResult ? 'fadeIn' : 'fadeOut'}
                    `}
                    onClick={() => {setSearchResult(false)}}
                >
                        
                    <svg className="w-6 h-6 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
                <input
                    type='text'
                    className={`header__search__input text-right`}
                    placeholder={`جستجو...    مثال: ${searchSuggestion !== null ? searchSuggestion : ''}`}
                    onChange={inputChanged}
                />
                <div className={`header__search__result overflow-scroll h-1/2 ${searchResult ? 'fadeIn' : 'fadeOut'} `}>
                    <div className="grid justify-center mt-2 mr-4 overflow-hidden rounded-lg header__search__result__category">
                        <div className="flex justify-center header__search__result__category__container w-80">
                            <ul className='md:space-y-5'>
                                {categoriesList}
                            </ul>

                            {/* <Link href={`/search?s=${searchValue}`} className='header__search__result__seeMore' ref={searchSubmit}>
                                <a> نمایش بقیه نتایج...</a>
                            </Link> */}
                        </div>
                    </div>

                    <div className="mr-5 header__search__result__quizzes">
                        <ul className='container flex flex-wrap px-20 m-2 mx-auto align-baseline flex-ai-fe justify-right md:m-auto'>
                            {quizzesList}
                        </ul>
                    </div>
                </div>
            </div>

            <button onClick={searchMobileFocusChangedHideOrShow} className='flex header__search__opener header__btn md:hidden flex-ai-c' type="button">
                <svg className="w-8 h-8 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </button>

            <div className={`header__search__opener__bg fixed darkGls ${searchMobile ? 'fadeIn' : 'fadeOut'}`}>

                <button onClick={searchMobileFocusChangedHideOrShow} className="absolute header__search__closeBtn header__btn-bg header__menu__closeBtn" aria-label="Close Search Bar"></button>
                <input
                    type='text'
                    className={`header__search__input text-right ${searchMobile ? 'fadeIn' : 'fadeOut'}`}
                    ref={mobileSearchInput}
                    placeholder='...جستجو'
                    onChange={inputChanged}
                />
            </div>
        </>
    )
}

export default Search;