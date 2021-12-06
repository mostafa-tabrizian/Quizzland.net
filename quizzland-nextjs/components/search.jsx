import React, {useState, useRef, useEffect} from 'react';
import { Link } from 'next/link'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, isItMobile } from './base'


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
                const search_new_quiz_title = await axiosLimited.get(`http://localhost:8000/dbAPI/new_quiz/?title__icontains=${searchValue}&limit=3`)
                Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)
                
                if (search_new_quiz_title.data.results !== 3) {
                    const search_new_quiz_subCategory = await axiosLimited.get(`http://localhost:8000/dbAPI/new_quiz/?subCategory__icontains=${searchValue}&limit=5`)
                    Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)
                    
                    if (search_new_quiz_subCategory.length !== 5) {
                        const search_new_quiz_tag = await axiosLimited.get(`http://localhost:8000/dbAPI/new_quiz/?tags__icontains=${searchValue}&limit=5`)
                        Array.prototype.push.apply(matchedQuizzes, search_new_quiz_tag.data.results)
                    }
                }
                
                // Search Pointy Quiz
                const search_new_pointy_quiz_title = await axiosLimited.get(`http://localhost:8000/dbAPI/new_pointy_quiz/?title__icontains=${searchValue}&limit=1`)
                Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_title.data.results)
                
                if (search_new_pointy_quiz_title.legnth !== 1) {
                    const search_new_pointy_quiz_subCategory = await axiosLimited.get(`http://localhost:8000/dbAPI/new_pointy_quiz/?subCategory__icontains=${searchValue}&limit=23`)
                    Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_subCategory.data.results)

                    if (search_new_pointy_quiz_subCategory.length !== 3) {
                        const search_new_pointy_quiz_tag = await axiosLimited.get(`http://localhost:8000/dbAPI/new_pointy_quiz/?tags__icontains=${searchValue}&limit=2`)
                        Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_tag.data.results)
                    }
                }
    
                // Search Category
                const search_new_category_title = await axiosLimited.get(`http://localhost:8000/dbAPI/new_category/?title__icontains=${searchValue}&limit=1`)
                Array.prototype.push.apply(matchedCategories, search_new_category_title.data.results)

                if (search_new_category_title.length !== 1) {
                    const search_new_category_subCategory = await axiosLimited.get(`http://localhost:8000/dbAPI/new_category/?subCategory__icontains=${searchValue}&limit=1`)
                    Array.prototype.push.apply(matchedCategories, search_new_category_subCategory.data.results)
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

                for ( let i = 0; i < maxQuizSearchResult; i++ ) {
                    uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];
                }

                matchedQuizzes = new Array();
                for ( let key in uniqueMatchedQuizzes ) {
                    matchedQuizzes.push(uniqueMatchedQuizzes[key]);
                }

                const quizzesList = () => {
                    matchedQuizzes.length >= 1 && setSearchResult(true)  // show result if there quizzes

                    try {
                        return (
                            matchedQuizzes.map((quiz) => {
                                return (
                                    <li key={quiz.id}>
                                        <article className={`flex tx-al-r quizContainer__trans`}>
                                            <Link href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                                <a>
                                                    <div>
                                                        <Image
                                                            src={quiz.thumbnail}
                                                            alt={`${quiz.subCategory}} | ${quiz.title}`}
                                                            blurDataURL={quiz.thumbnail}
                                                            width='224'
                                                            height='126'
                                                            placeholder='blur'
                                                        />
                                                    </div>
                                                    <div className="header__search__result__title flex">
                                                        <span>
                                                            { quiz.title }
                                                        </span>
                                                    </div>
                                                </a>
                                            </Link>
                                        </article>
                                    </li>
                                )
                            })
                        )
                    } catch {e} {
                        // log('no quiz found...')
                        return null
                    }
                }
    
                const categoriesList = () => {
                    try {
                        const category = matchedCategories[0]
                        return (
                            <div className={`header__search__result__category__item`}>
                                <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?t=${replaceFunction(category.title, ' ', '-')}`}>
                                    <a>
                                        <Image
                                            src={category.thumbnail}
                                            alt={`${category.subCategory}} | های ${category.title_far}}`}
                                            blurDataURL={category.thumbnail}
                                            width='336'
                                            height='160'
                                            placeholder='blur'
                                        />
                                    </a>
                                </Link>
                                <h5 className='tx-al-c'>
                                    <Link href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?t=${replaceFunction(category.title, ' ', '-')}`}>
                                        <a>
                                            {category.subCategory}
                                        </a>
                                    </Link>
                                </h5>
                            </div>
                        )
                    } catch (e){
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
        const grabAllSubCategories = await axiosLimited.get(`http://localhost:8000/dbAPI/new_category`)
        const numberOfCategories = grabAllSubCategories.data.length
        const randomCategoryIndex = Math.floor(Math.random() * numberOfCategories);
        setSearchSuggestion(grabAllSubCategories.data[randomCategoryIndex].title)
    }

    return (
        <>
            <div className={`header__search flex ${props.colorOfHeader}`}>
                <input
                    type='text'
                    className={`header__search__input tx-al-r`}
                    placeholder={`جستجو...    مثال: ${searchSuggestion !== null ? searchSuggestion : ''}`}
                    onChange={inputChanged}
                />
                <div  className={`header__search__result ${searchResult ? 'fadeIn' : 'fadeOut'} `}>
                    <div className="header__search__result__category">
                        <div className="header__search__result__category__container flex flex-jc-c">
                            {categoriesList}

                            {/* <Link href={`/search?s=${searchValue}`} className='header__search__result__seeMore' ref={searchSubmit}>
                                <a> نمایش بقیه نتایج...</a>
                            </Link> */}
                        </div>
                    </div>
                    
                    <div className="header__search__result__quizzes">
                        <ul className='flex'>
                            {quizzesList}
                        </ul>
                    </div>
                </div>
            </div>

            <button onClick={searchMobileFocusChangedHideOrShow} className='header__search__opener header__btn hideForDesktop flex flex-ai-c' type="button"></button>
            <div className={`header__search__opener__bg pos-fix darkGls ${searchMobile ? 'fadeIn' : 'fadeOut'}`}>
                <button onClick={searchMobileFocusChangedHideOrShow} className="header__search__closeBtn header__btn-bg pos-abs header__menu__closeBtn" aria-label="Close Search Bar"></button>
                <input
                    type='text'
                    className={`header__search__input tx-al-r ${searchMobile ? 'fadeIn' : 'fadeOut'}`}
                    ref={mobileSearchInput}
                    placeholder='...جستجو'
                    onChange={inputChanged}
                />
            </div>
        </>
    )
}

export default Search;