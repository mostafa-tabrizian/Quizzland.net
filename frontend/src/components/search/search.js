import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { BigHead } from "@bigheads/core";
import debounce from 'lodash.debounce'
import { useSnackbar } from 'notistack'
import Skeleton from '@mui/material/Skeleton';

import { log, replaceFunction } from '../base'
import SearchFetchQuiz from './searchFetchQuiz'
import SearchFetchTest from './searchFetchTest'
// import SearchFetchUser from './searchFetchUser'
import QuizContainer from '../quizContainer'
import TestContainer from '../testContainer'
import SkeletonTestContainer from '../skeletonTestContainer';

const Search = (props) => {
    const [searched_quiz, set_searched_quiz] = useState([])
    const [searched_test, set_searched_test] = useState([])
    // const [searched_user, set_searched_user] = useState([])

    useEffect(() => {
        searchedHandler(props.value)
    }, [props.value])

    const { enqueueSnackbar } = useSnackbar()

    const searchedHandler = useCallback(
        debounce(
            async (value) => {
                if (value?.length) {
                    try {
                        // const minimumKeywordForSearched = 2
                        const searchedValue = value.toLowerCase()

                        // if (value.length <= minimumKeywordForSearched) {
                        //     return false
                        // }
                        props.setContentLoaded(false)

                        set_searched_quiz((await SearchFetchQuiz(searchedValue)).slice(0, props.contentLength))
                        set_searched_test((await SearchFetchTest(searchedValue)).slice(0, props.contentLength))
                        // set_searched_user((await SearchFetchUser(searchedValue)).slice(0, 4))
                    } catch (err) {
                        enqueueSnackbar('بیش از حد مجاز سرچ کردید. لطفا صبر کنید...', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' } })
                        log('Error in search | cause : database')
                    }

                    props.setContentLoaded(true)
                }
            }, 500
        )
    )

    return (
        <div>
            {
                props.contentLoaded ?
                    // <div class="grid grid-cols-1 md:grid-cols-3 items-start justify-center pt-3 mt-2 md:mr-4 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 items-start justify-center pt-3 mt-2 md:mr-4 rounded-lg">
                        <div className='order-1 col-start-1 space-y-5 col-end-3 md:p-4 md:order-1 grid-row-full'>
                            <div>
                                <h1 className='mb-5'>کوییز ها</h1>
                                <ul class="flex flex-wrap align-baseline">
                                    {
                                        searched_quiz.length ?
                                        <QuizContainer quizzes={searched_quiz} bgStyle='trans' />
                                        :
                                        <div className='flex items-center space-x-3 space-x-reverse'>
                                            <p className='empty'>هیچ کوییزی پیدا نشد!</p>
                                        </div>
                                    }
                                </ul>
                            </div>
                            <div>
                                <h1 className='mb-5'>تست ها</h1>
                                <ul class="flex flex-col flex-wrap align-baseline md:flex-row">
                                    {
                                        searched_test.length ?
                                        <TestContainer tests={searched_test} bgStyle='trans' />
                                        :
                                        <div className='flex items-center space-x-3 space-x-reverse'>
                                            <p className='empty'>هیچ تستی پیدا نشد!</p>
                                        </div>
                                    }
                                </ul>
                            </div>
                        </div>
                        {/* <div className='self-start order-2 p-4 md:pl-8 md:sticky top-28'>
                            <div className='mt-10'>
                                <h1 className='mb-5'>کاربران</h1>
                                <ul class="flex flex-col space-y-5 justify-start">
                                    {
                                        searched_user.length ?
                                            searched_user.map((user) => {
                                                return (
                                                    <a href={`/profile/${user.username}`}>
                                                        <li key={user.id}>
                                                            <div className='flex items-end space-x-3 space-x-reverse'>
                                                                <div className='w-20 h-16'>
                                                                    <BigHead {...JSON.parse(user.avatar)} />
                                                                </div>
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
                                                    </a>
                                                )
                                            })
                                        :
                                        <div className='flex items-center space-x-3 space-x-reverse'>
                                            <p className='empty'>هیچ کاربری پیدا نشد!</p>
                                        </div>
                                    }
                                </ul>
                            </div>
                        </div> */}
                    </div>
                    :
                    <SkeletonTestContainer />
            }
        </div>
    );
}

export default Search;