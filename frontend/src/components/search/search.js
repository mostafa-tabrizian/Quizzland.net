import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Empty } from 'antd';

import { log, replaceFunction } from '../base'
import SearchFetchCategory from './searchFetchCategory'
import SearchFetchQuiz from './searchFetchQuiz'
import SearchFetchUser from './searchFetchUser'
import QuizContainer from '../quizContainer'

const Search = (props) => {
    const [searched_content, set_searched_content] = useState([])
    const [searched_category, set_searched_category] = useState([])
    const [searched_user, set_searched_user] = useState([])

    useEffect(() => {
        searchedHandler(props.value)
    }, [props.value])

    const searchedHandler = async (value) => {
        if (value) {
            try {
                const minimumKeywordForSearched = 2
                const searchedValue = value.toLowerCase()
    
                if (value.length <= minimumKeywordForSearched) {
                    return false
                }
                
                set_searched_content((await SearchFetchQuiz(searchedValue)).slice(0, props.contentLength))
                set_searched_category((await SearchFetchCategory(searchedValue)).slice(0, 2))
                set_searched_user((await SearchFetchUser(searchedValue)).slice(0, 4))
                props.setContentLoaded(true)
            } catch (e) {
                // log(e)
                log('Error in search | cause : database')
            }
        }
    }
        
    return (
        <div class="grid grid-cols-1 md:grid-cols-3 items-start justify-center pt-3 mt-2 md:mr-4 rounded-lg">
            <div className='order-2 col-start-1 col-end-3 p-4 md:order-1 grid-row-full'>
                <h1 className='mb-10'>کوییز ها</h1>
                <ul class="flex flex-wrap align-baseline">
                    {
                        searched_content.length ?
                        <QuizContainer quizzes={searched_content} bgStyle='trans' />
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<h2>هیچ کوییزی پیدا نشد!</h2>} />
                    }
                </ul>      
            </div>
            <div className='self-start order-1 p-4 pl-8 md:sticky top-4'>
                <div>
                    <h1 className='mb-10'>کتگوری ها</h1>
                    {
                        searched_category.length ?
                        <ul class="flex justify-start space-x-5 space-x-reverse">
                            {
                                searched_category.map((category) => {
                                    return (
                                        <div key={category.id} className='max-w-[50%]'>
                                            <Link to={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                                <img
                                                    src={category.thumbnail}
                                                    alt={`${category.subCategory}} | های ${category.title_far}}`}
                                                    width={1366}
                                                    height={768}
                                                    className='rounded-lg'
                                                />
                                            </Link>

                                            <h2 className='mt-4 md:relative md:left-0 md:top-0'>
                                                <Link to={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?sc=${replaceFunction(category.title, ' ', '-')}`}>
                                                    {category.subCategory}
                                                </Link>
                                            </h2>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<h2>هیچ کتگوری پیدا نشد!</h2>} />
                    }
                </div>
                <div className='mt-10'>
                    <h1 className='mb-10'>کاربران</h1>
                    <ul class="flex flex-col space-y-3 justify-start">
                        {
                            searched_user.length ?
                            searched_user.map((user) => {
                                return (
                                    <Link to={`/profile/${user.username}`}>
                                        <li key={user.id}>
                                            <div className='flex items-center space-x-3 space-x-reverse'>
                                                {
                                                    user?.avatar?
                                                    <img className="" src={user.avatar} alt={user.username} />
                                                    :
                                                    <svg className="h-10 w-10 text-[#ac272e]"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                }
                                                {
                                                    <h2 onClick={() => setProfileSubMenu(!profileSubMenu)} className='hover:cursor-pointer'>
                                                        <div className='flex items-center'>
                                                            {
                                                                <div>
                                                                    {user.username}
                                                                </div>
                                                            }
                                                        </div>
                                                    </h2>
                                                }
                                            </div>
                                        </li>
                                    </Link>
                                )
                            })
                            :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<h2>هیچ کاربری پیدا نشد!</h2>} />
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}
 
export default Search;