import React, {useState} from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios'

import { log, replaceFunction, sortByNewest } from './base'


const Search = (props) => {
    const [searched_content, set_searched_content] = useState([])
    const [searched_category, set_searched_category] = useState([])
    const [searchedResult, setSearchedResult] = useState(false)

    const searchedHandler = async (value) => {
        try {
            const minimumKeywordForSearched = 2
            const searchedValue = value.toLowerCase()

            if (value.length <= minimumKeywordForSearched) {
                return false
            }

            const searched_quiz = await axios.get(`/api/quiz/?public=true`)
            const searched_pointy = await axios.get(`/api/pointy/?public=true`)
            
            const searched_quiz_title = searched_quiz.data.filter(quiz => quiz.title.toLowerCase().includes(searchedValue))
            const searched_quiz_subCategory = searched_quiz.data.filter(quiz => quiz.subCategory.toLowerCase().includes(searchedValue))
            const searched_quiz_tags = searched_quiz.data.filter(quiz => quiz.tags.toLowerCase().includes(searchedValue))

            const searched_pointy_title = searched_pointy.data.filter(quiz => quiz.title.toLowerCase().includes(searchedValue))
            const searched_pointy_subCategory = searched_pointy.data.filter(quiz => quiz.subCategory.toLowerCase().includes(searchedValue))
            const searched_pointy_tags = searched_pointy.data.filter(quiz => quiz.tags.toLowerCase().includes(searchedValue))


            const searched_content = 
                searched_quiz_title
                .concat(searched_quiz_subCategory)
                .concat(searched_quiz_tags)
                .concat(searched_pointy_title)
                .concat(searched_pointy_subCategory)
                .concat(searched_pointy_tags)
                    .sort(sortByNewest)

            const searched_content_noDuplicates = searched_content.filter((content, index, self) =>
                index === self.findIndex((index) => (
                    index.title === content.title
                ))
            )

            // Searched Category

            const searched_category = await axios.get(`/api/subcategory/?public=true`)
            
            const searched_category_title = searched_category.data.filter(category => category.title.toLowerCase().includes(searchedValue))
            const searched_category_subCategory = searched_category.data.filter(category => category.subCategory.toLowerCase().includes(searchedValue))
            
            const searched_all_category = 
                searched_category_title
                    .concat(searched_category_subCategory)
                        .sort(sortByNewest)

            const searched_category_noDuplicates = searched_all_category.filter((content, index, self) =>
                index === self.findIndex((index) => (
                    index.subCategory === content.subCategory
                ))
            )

            set_searched_content(searched_content_noDuplicates.slice(0, 30))
            set_searched_category(searched_category_noDuplicates.slice(0, 30))
            setSearchedResult(true)
        } catch (e) {
            log('Error in search | cause : database')
        }
    }

    const inputChanged = (input) => {
        searchedHandler(input.target.value)
    }

    document.body.addEventListener(("click"), (e) => {
        if (!e.target.classList.contains('header__searched__result__quizzes') && !e.target.classList.contains('header__searched__input')) {
            setSearchedResult(false)
        }
    })

    return (
        <React.Fragment>
            <div className={`header__searched hidden md:flex absolute left-8 top-4 items-center`}>
                <button
                    className={`
                        absolute right-[-2rem] top-1.5
                        ${searchedResult ? 'fadeIn' : 'fadeOut'}
                    `}
                    onClick={() => {setSearchedResult(false)}}
                >
                        
                    <svg className="w-6 h-6 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>

                <div>
                    <input
                        type='text'
                        className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-base my-auto'
                        placeholder={`کوییزت رو سریع تر پیدا کن`}
                        onChange={inputChanged}
                        onKeyPress={e => {if (e.key == 'Enter') { window.open(`/search?q=${replaceFunction(e.target.value, ' ', '+')}`, '_blank') }}}
                    />
                    <svg className='w-5 h-5 absolute top-2 right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                        <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
                        <path data-name="layer1" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round"/>
                    </svg>
                </div>

                <div class={`header__search__result z-20 overflow-scroll h-1/2 ${searchedResult ? 'fadeIn' : 'fadeOut'}`}>
                    <div class="grid justify-center mt-2 mr-4 overflow-hidden rounded-lg header__search__result__category">
                        <div class="flex justify-center header__search__result__category__container w-80">
                            <ul class="md:space-y-5">
                                {
                                    searched_category.map((category) => {
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
                                }
                            </ul>
                        </div>
                    </div>
                    <div class="mr-5 header__search__result__quizzes">
                        <ul class="container flex flex-wrap pl-4 pr-0 md:px-20 m-2 mx-auto align-baseline flex-ai-fe justify-right md:m-auto">
                            {
                                searched_content.map((quiz) => {
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
                                                    <div className="col-span-3 mt-2 header__searched__result__title">
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
                            }
                        </ul>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default Search;