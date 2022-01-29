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

        if (typeof window !== 'undefined') {
            document.body.addEventListener(("click"), (e) => {
                if (!e.target.className.includes('header__search__result__quizzes') && !e.target.className.includes('header__search__input')) {
                    setSearchResult(false)
                }
            })
        }
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
                    matchedQuizzes.length >= 1 && setSearchResult(true)  // show result if there quizzes

                    try {
                        return (
                            matchedQuizzes.map((quiz) => {
                                return (
                                    <li key={quiz.id} className='m-2 md:mb-6'>
                                        <article className={`flex text-right rounded-xl quizContainer__trans`}>
                                            <Link href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                                <a className='grid grid-cols-5 md:block'>
                                                    <div className='col-span-2 w-[224px] h-[126px]'>
                                                        <Image
                                                            src={quiz.thumbnail}
                                                            alt={`${quiz.subCategory}} | ${quiz.title}`}
                                                            blurDataURL={quiz.thumbnail}
                                                            width='1366'
                                                            height='768'
                                                            placeholder='blur'
                                                            className='rounded-r-xl md:rounded-xl'
                                                        />
                                                    </div>
                                                    <div className="header__search__result__title col-span-3 mt-2">
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
        const grabAllSubCategories = await axiosLimited.get(`${API_URL}/dbAPI/category_new/`) // 'cause of being a components the axios not acceptable
        const numberOfCategories = grabAllSubCategories.data.length
        const randomCategoryIndex = Math.floor(Math.random() * numberOfCategories);
        setSearchSuggestion(grabAllSubCategories.data[randomCategoryIndex].title)
    }

    return (
        <>
            <div className={`header__search flex ${props.colorOfHeader}`}>
                <input
                    type='text'
                    className={`header__search__input text-right`}
                    placeholder={`جستجو...    مثال: ${searchSuggestion !== null ? searchSuggestion : ''}`}
                    onChange={inputChanged}
                />
                <div className={`header__search__result overflow-scroll h-1/2 ${searchResult ? 'fadeIn' : 'fadeOut'} `}>
                    <div className="header__search__result__category mr-4 mt-2 rounded-lg justify-center grid overflow-hidden">
                        <div className="header__search__result__category__container w-80 flex justify-center">
                            <ul className='md:space-y-5'>
                                {categoriesList}
                            </ul>

                            {/* <Link href={`/search?s=${searchValue}`} className='header__search__result__seeMore' ref={searchSubmit}>
                                <a> نمایش بقیه نتایج...</a>
                            </Link> */}
                        </div>
                    </div>

                    <div className="header__search__result__quizzes mr-5">
                        <ul className='flex flex-ai-fe container mx-auto px-20 flex-wrap align-baseline m-2 justify-right md:m-auto'>
                            {quizzesList}
                        </ul>
                    </div>
                </div>
            </div>

            <button onClick={searchMobileFocusChangedHideOrShow} className='header__search__opener header__btn md:hidden flex flex-ai-c' type="button"></button>
            <div className={`header__search__opener__bg fixed darkGls ${searchMobile ? 'fadeIn' : 'fadeOut'}`}>
                <button onClick={searchMobileFocusChangedHideOrShow} className="header__search__closeBtn header__btn-bg absolute header__menu__closeBtn" aria-label="Close Search Bar"></button>
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