import React, {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios'

import { log, replaceFunction, isItMobile } from './base'


const Search = (props) => {
    const [categoriesList, setCategoriesList] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [searchResult, setSearchResult] = useState(false)

    const searchHandler = async (value) => {
        try {
            const minimumKeywordForSearch = 3
            if (value.length >= minimumKeywordForSearch) {
                let searchValue = replaceFunction(value, ' ', '+')

                let matchedQuizzes = []
                let matchedCategories = []

                // Search Quiz
                const search_quiz_new_title = await axios.get(`/api/quiz_new/?title__icontains=${searchValue}&limit=10&public=true`)
                Array.prototype.push.apply(matchedQuizzes, search_quiz_new_title.data.results)

                if (search_quiz_new_title.data.results !== 10) {
                    const search_quiz_new_subCategory = await axios.get(`/api/quiz_new/?subCategory__icontains=${searchValue}&limit=10&public=true`)
                    Array.prototype.push.apply(matchedQuizzes, search_quiz_new_subCategory.data.results)

                    if (search_quiz_new_subCategory.length !== 10) {
                        const search_quiz_new_tag = await axios.get(`/api/quiz_new/?tags__icontains=${searchValue}&limit=10&public=true`)
                        Array.prototype.push.apply(matchedQuizzes, search_quiz_new_tag.data.results)
                    }
                }

                // Search Pointy Quiz
                const search_pointy_new_title = await axios.get(`/api/pointy_new/?title__icontains=${searchValue}&limit=5&public=true`)
                Array.prototype.push.apply(matchedQuizzes, search_pointy_new_title.data.results)

                if (search_pointy_new_title.length !== 5) {
                    const search_pointy_new_subCategory = await axios.get(`/api/pointy_new/?subCategory__icontains=${searchValue}&limit=5&public=true`)
                    Array.prototype.push.apply(matchedQuizzes, search_pointy_new_subCategory.data.results)

                    if (search_pointy_new_subCategory.length !== 5) {
                        const search_pointy_new_tag = await axios.get(`/api/pointy_new/?tags__icontains=${searchValue}&limit=2&public=true`)
                        Array.prototype.push.apply(matchedQuizzes, search_pointy_new_tag.data.results)
                    }
                }

                // Search Category
                const search_category_new_title = await axios.get(`/api/subcategory_new/?title__icontains=${searchValue}&limit=2&public=true`)
                Array.prototype.push.apply(matchedCategories, search_category_new_title.data.results)

                if (search_category_new_title.length !== 2) {
                    const search_category_new_subCategory = await axios.get(`/api/subcategory_new/?subCategory__icontains=${searchValue}&limit=2&public=true`)
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
                                    <li key={quiz.id} className='mr-2 md:mr-5 mb-4 md:mb-7 md:mt-5'>
                                        <article className={`
                                            flex text-right h-full
                                            rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                            `}
                                        >
                                            <Link to={`/quiz/${replaceFunction(quiz.slug, ' ', '-')}`} className='flex md:block md:grid-cols-5' target='_blank'>
                                                <div className='md:col-span-2 ml-4 md:ml-0 w-[310px] md:w-[235px] h-[100px] md:h-[133px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                                    <img
                                                        src={quiz.thumbnail}
                                                        alt={`${quiz.subCategory}} | ${quiz.title}`}
                                                        width={1366}
                                                        height={768}
                                                        className=' h-full max-w-fit '
                                                    />
                                                </div>
                                                <div className="col-span-3 mt-2 header__search__result__title">
                                                    <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                                                text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                                        {quiz.subCategory}
                                                    </h2>
                                                    <h3 className={`
                                                    quizContainer__title quizContainer__title__noViews flex
                                                    text-sm mr-5 ml-5 md:w-52 md:mr-0 md:text-base
                                                `}>
                                                        {quiz.title}
                                                    </h3>
                                                </div>
                                            </Link>
                                        </article>
                                    </li>
                                )
                            })
                        )
                    } catch { e } {
                        return null
                    }
                }

                const categoriesList = () => {
                    try {
                        return (
                            matchedCategories.map((category) => {
                                return (
                                    <div key={category.id}>
                                        <Link to={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                            <a>
                                                <img
                                                    src={category.thumbnail}
                                                    alt={`${category.subCategory}} | های ${category.title_far}}`}
                                                    width={1366}
                                                    height={768}
                                                />
                                            </a>
                                        </Link>

                                        <h2 className='absolute left-6 top-6 md:relative md:left-0 md:top-0 md:mt-3 md:text-center'>
                                            <Link to={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                                <a>
                                                    {category.subCategory}
                                                </a>
                                            </Link>
                                        </h2>

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

    document.body.addEventListener(("click"), (e) => {
        if (!e.target.classList.contains('header__search__result__quizzes') && !e.target.classList.contains('header__search__input')) {
            setSearchResult(false)
        }
    })

    return (
        <React.Fragment>
            <div className={`header__search hidden md:flex absolute left-8 top-4 items-center`}>
                <button
                    className={`
                        absolute right-[-2rem] top-1.5
                        ${searchResult ? 'fadeIn' : 'fadeOut'}
                    `}
                    onClick={() => {setSearchResult(false)}}
                >
                        
                    <svg className="w-6 h-6 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>

                <div>
                    <input
                        type='text'
                        className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-base my-auto'
                        placeholder={`کوییزت رو سریع تر پیدا کن`}
                        onChange={inputChanged}
                        onKeyPress={e => {if (e.key == 'Enter') { window.open(`/search?q=${e.target.value}`, '_blank') }}}
                    />
                    <svg className='w-5 h-5 absolute top-2 right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                        <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
                        <path data-name="layer1" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round"/>
                    </svg>
                </div>

                <div className={`header__search__result z-20 overflow-scroll h-1/2 ${searchResult ? 'fadeIn' : 'fadeOut'} `}>
                    <div className="grid justify-center mt-2 mr-4 overflow-hidden rounded-lg header__search__result__category">
                        <div className="flex justify-center header__search__result__category__container w-80">
                            <ul className='md:space-y-5'>
                                {categoriesList}
                            </ul>
                        </div>
                    </div>

                    <div className="mr-5 header__search__result__quizzes">
                        <ul className='container flex flex-wrap pl-4 pr-0 md:px-20 m-2 mx-auto align-baseline flex-ai-fe justify-right md:m-auto'>
                            {quizzesList}
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default Search;