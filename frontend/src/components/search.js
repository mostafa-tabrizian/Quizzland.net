import React, {useState, useRef} from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, isItMobile } from './base'

const Search = (props) => {
    const [categoriesList, setCategoriesList] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [searchMobile, setSearchMobile] = useState(false)
    const [searchResult, setSearchResult] = useState(false)
    const [searchValue, setSearchValue] = useState(null)
    const [quizzesGrabbedCounter, setQuizzesGrabbedCounter] = useState(0)

    const searchSubmit = useRef()
    const mobileSearchInput = useRef()

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

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
                const search_new_quiz_title = await axiosLimited.get(`/dbAPI/new_quiz/?title__icontains=${searchValue}&limit=6`)
                Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)
    
                const search_new_quiz_subCategory = await axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${searchValue}&limit=6`)
                Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)
    
                const search_new_quiz_tag = await axiosLimited.get(`/dbAPI/new_quiz/?tags__icontains=${searchValue}&limit=6`)
                Array.prototype.push.apply(matchedQuizzes, search_new_quiz_tag.data.results)

                // Search Pointy Quiz
                const search_new_pointy_quiz_title = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?title__icontains=${searchValue}&limit=6`)
                Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_title.data.results)
    
                const search_new_pointy_quiz_subCategory = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?subCategory__icontains=${searchValue}&limit=6`)
                Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_subCategory.data.results)
    
                const search_new_pointy_quiz_tag = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?tags__icontains=${searchValue}&limit=6`)
                Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_tag.data.results)
    
                // Search Category
                const search_new_category_title = await axiosLimited.get(`/dbAPI/new_category/?title__icontains=${searchValue}&limit=1`)
                Array.prototype.push.apply(matchedCategories, search_new_category_title.data.results)
    
                const search_new_category_subCategory = await axiosLimited.get(`/dbAPI/new_category/?subCategory__icontains=${searchValue}&limit=1`)
                Array.prototype.push.apply(matchedCategories, search_new_category_subCategory.data.results)
    
                setQuizzesGrabbedCounter(matchedQuizzes.length)

                // Remove duplicated quizzes
                let uniqueMatchedQuizzes = {};
                let maxQuizSearchResult

                if (matchedQuizzes.length >= 6) {
                    if (isItMobile()) maxQuizSearchResult = 5  // 4
                    else maxQuizSearchResult = 7  // 6
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
                                            <a href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                                <div>
                                                    <img src={`${quiz.thumbnail}`} alt={`${quiz.subCategory}} | ${quiz.title}`} loading='lazy' />
                                                </div>
                                                <div className="header__search__result__title flex">
                                                    <span>
                                                        { quiz.title }
                                                    </span>
                                                </div>
                                            </a>
                                        </article>
                                    </li>
                                )
                            })
                        )
                    } catch {e} {
                        log('no quiz found...')
                    }
                }
    
                const categoriesList = () => {
                    try {
                        const category = matchedCategories[0]
                        return (
                            <div className={`header__search__result__category__item`}>
                                <a href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?t=${replaceFunction(category.title, ' ', '-')}`}>
                                    <img src={`${category.thumbnail}`} alt={`${category.subCategory} | کوییز های ${category.title_far}`} />
                                </a>
                                <h5 className='tx-al-c'>
                                    <a href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?t=${replaceFunction(category.title, ' ', '-')}`}>
                                        {category.subCategory}
                                    </a>
                                </h5>
                            </div>
                        )
                    } catch (e){
                        log('no category found...')
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

    document.body.addEventListener(("click"), (e) => {
        if (!e.target.className.includes('header__search__result__quizzes') && !e.target.className.includes('header__search__input')) {
            setSearchResult(false)
        }
    })

    return (
        <React.Fragment>
            <div className={`header__search flex ${props.colorOfHeader}`}>
                <input
                    type='text'
                    className={`header__search__input tx-al-r`}
                    placeholder='...جستجو'
                    onChange={inputChanged}
                />
                <div  className={`header__search__result ${searchResult ? 'fadeIn' : 'fadeOut'} `}>
                    <div className="header__search__result__category">
                        <div className="header__search__result__category__container flex flex-jc-c">
                            {quizzesGrabbedCounter !== 0
                                &&
                                <span>تعداد نتایج پیدا شده: {quizzesGrabbedCounter}</span>
                            }

                            {categoriesList}

                            {quizzesGrabbedCounter !== 0
                                &&
                                <Link to={`/search?s=${searchValue}`} className='header__search__result__seeMore' ref={searchSubmit}>
                                    نمایش بقیه نتایج...
                                </Link>
                            } 
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
        </React.Fragment>
    )
}

export default Search;