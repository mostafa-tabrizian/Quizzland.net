import React, {useState, useRef} from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'

import { log, replaceFunction } from './base'

const noCategoryFound = '/static/img/noCategoryFound.jpg'
const noQuizFound = '/static/img/noQuizFound.png'
const noQuizFound2 = '/static/img/noQuizFound2.png'

const Search = (props) => {
    const [categories, setCategories] = useState({})
    const [quizzes, setQuizzes] = useState({})
    const [categoriesList, setCategoriesList] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [searchMobile, setSearchMobile] = useState(false)
    const [searchResult, setSearchResult] = useState(false)
    const [searchValue, setSearchValue] = useState()
    const [showMoreResults, setShowMoreResults] = useState(false)
    const [noCategoryFoundState, setNoCategoryFoundState] = useState(true)
    const [noQuizFoundState, setNoQuizFoundState] = useState(true)

    const searchSubmit = useRef()

    const searchMobileFocusChanger = () => {
        setSearchMobile(searchMobile ? false : true)
        if (!searchMobile) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'overlay'
        }
    }

    const searchHandler = async (value) => {
        setSearchValue(replaceFunction(value, ' ', '+'))
        let matchedQuizzes = []
        let matchedCategories = []

        // Search Quiz
        const search_new_quiz_title = await axios.get(`/dbQuizzland$M19931506/new_quiz/?title__icontains=${searchValue}&limit=6`)
        Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)

        const search_new_quiz_subCategory = await axios.get(`/dbQuizzland$M19931506/new_quiz/?subCategory__icontains=${searchValue}&limit=6`)
        Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)

        // Search Category
        const search_new_category_title = await axios.get(`/dbQuizzland$M19931506/new_category/?title__icontains=${searchValue}&limit=1`)
        Array.prototype.push.apply(matchedCategories, search_new_category_title.data.results)

        const search_new_category_subCategory = await axios.get(`/dbQuizzland$M19931506/new_category/?subCategory__icontains=${searchValue}&limit=1`)
        Array.prototype.push.apply(matchedCategories, search_new_category_subCategory.data.results)
        
        setCategories(matchedCategories)
        setQuizzes(matchedQuizzes)

        const quizzesList = () => {
            try {
                let resultCounter = 0
                const maxQuizSearchResult = 6

                setNoQuizFoundState(true)
                return (
                    quizzes.map(quiz => {
                        if (resultCounter !== maxQuizSearchResult) {
                            setNoQuizFoundState(false)
                            setShowMoreResults(false)

                            resultCounter++
                            return (
                                <li key={quiz.key}>
                                    <a className="header__search__result__quizzes__item tx-al-r" href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                        { quiz.title }
                                    </a>
                                </li>
                            )
                        } else {
                            setShowMoreResults(true)
                        }
                    })
                )
            } catch {}
        }

        const categoriesList = () => {
            try {
                setNoCategoryFoundState(false)
                const category = categories[0]
                return (
                    <div className="header__search__result__category__item">
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
            } catch {
                setNoCategoryFoundState(true)
            }
        }   
        
        setQuizzesList(quizzesList)
        setCategoriesList(categoriesList)
    }

    const inputChanged = (input) => {
        searchHandler(input.target.value)
    }

    const openSearchResult = () => {
        setSearchResult(true)
    }

    document.body.addEventListener(("click"), (e) => {
        if (!e.target.className.includes('header__search__result__quizzes') && !e.target.className.includes('header__search__input')) {
            setSearchResult(false)
        }
    })

    const noQuizFoundStyle = () => {
        const nightMode = localStorage.getItem('lightMode')
        if (nightMode === 'true') {
            return <img src={noQuizFound2} style={{pointerEvents: 'None', filter: 'drop-shadow(0px 4px 3px gray)'}} alt='No quiz' />
        } else {
            return <img src={noQuizFound} style={{pointerEvents: 'None', filter: 'drop-shadow(0 3px 5px black)'}} alt='No quiz' />
        }
    }

    const noCategoryFoundStyle = () => {
        const nightMode = localStorage.getItem('lightMode')
        if (nightMode === 'true') {
            return <img src={noCategoryFound} style={{pointerEvents: 'None', filter: 'None', border: 'None'}} alt='No category' />
        } else {
            return <img src={noCategoryFound} style={{pointerEvents: 'None', border: 'None'}} alt='No category' />
        }
    }

    return (
        <React.Fragment>
            <div className={`header__search flex ${props.colorOfHeader}`}>
                <input
                    type='text'
                    className={`header__search__input tx-al-r hideForMobile ${searchMobile ? 'fadeOut' : 'fadeIn'}`}
                    placeholder='...جستجو'
                    onFocus={openSearchResult}
                    onChange={inputChanged}
                    onKeyDown={(e) => {if (e.keyCode === 13){searchSubmit.current.click()}}}
                />
                <div  className={`header__search__result hideForMobile ${searchResult ? 'fadeIn' : 'fadeOut'}`}>
                    <div className="header__search__result__category">
                        <div className="header__search__result__category__container flex flex-jc-c">
                            {categoriesList}

                            { noCategoryFoundState &&
                                <div className="header__search__result__category__item">
                                    {noCategoryFoundStyle()}
                                </div>
                            }
                        </div>
                    </div>
                    
                    <div className="header__search__result__quizzes">
                        <ul>
                            {quizzesList}

                            { noQuizFoundState &&
                                noQuizFoundStyle()
                            }
                        </ul>

                        {
                            showMoreResults &&

                            <div onClick={() => setSearchResult(false)} className="header__search__result__quizzes__seeMore"> 
                                <Link to={`/search?s=${searchValue}`} ref={searchSubmit}>
                                    جستجوی بیشتر ...
                                </Link>
                            </div>
                        }

                    </div>
                </div>

                <div  className={`header__search__result hideForDesktop ${searchMobile ? 'fadeIn' : 'fadeOut'}`}>
                    <div className="header__search__result__category">
                        <div className="header__search__result__category__container flex flex-jc-c">
                            {categoriesList}

                            { noCategoryFoundState &&
                                <div className="header__search__result__category__item">
                                    {noCategoryFoundStyle()}
                                </div>
                            }
                        </div>
                    </div>
                    
                    <div className="header__search__result__quizzes">
                        <ul>
                            {quizzesList}

                            { noQuizFoundState &&
                                noQuizFoundStyle()
                            }
                        </ul>
                        
                        {
                            showMoreResults &&

                            <div onClick={() => setSearchResult(false)} className="header__search__result__quizzes__seeMore"> 
                                <Link to={`/search?s=${searchValue}`} >
                                    جستجوی بیشتر ...
                                </Link>
                            </div>
                        }

                    </div>
                </div>
            </div>

            <button onClick={searchMobileFocusChanger} className='header__search__opener header__btn hideForDesktop flex flex-ai-c' type="button"></button>
            <div className={`header__search__opener__bg pos-fix darkGls ${searchMobile ? 'fadeIn' : 'fadeOut'}`}>
                <button onClick={searchMobileFocusChanger} className="header__search__closeBtn header__btn-bg pos-rel header__menu__closeBtn" aria-label="Close Search Bar"></button>
                <input
                    type='text'
                    className={`header__search__input tx-al-r ${searchMobile ? 'fadeIn' : 'fadeOut'}`}
                    placeholder='...جستجو'
                    onFocus={openSearchResult}
                    onChange={inputChanged}
                />
            </div>
        </React.Fragment>
    )
}

export default Search;