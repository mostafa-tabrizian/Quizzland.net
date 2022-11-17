import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { BigHead } from "@bigheads/core";
import debounce from 'lodash.debounce'
import { useSnackbar } from 'notistack'
import Skeleton from '@mui/material/Skeleton';

import { log, replaceFunction } from '../base'
import SearchFetchCategory from './searchFetchCategory'
import SearchFetchQuiz from './searchFetchQuiz'
import SearchFetchUser from './searchFetchUser'
import TestContainer from '../testContainer'
import SkeletonTestContainer from '../skeletonTestContainer';

const Search = (props) => {
    const [searched_content, set_searched_content] = useState([])
    const [searched_category, set_searched_category] = useState([])
    const [searched_user, set_searched_user] = useState([])

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

                        set_searched_content((await SearchFetchQuiz(searchedValue)).slice(0, props.contentLength))
                        set_searched_category((await SearchFetchCategory(searchedValue)).slice(0, 2))
                        set_searched_user((await SearchFetchUser(searchedValue)).slice(0, 4))
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
                    <div class="grid grid-cols-1 md:grid-cols-3 items-start justify-center pt-3 mt-2 md:mr-4 rounded-lg">
                        <div className='order-2 col-start-1 col-end-3 md:p-4 md:order-1 grid-row-full'>
                            <h1 className='mb-10'>کوییز ها</h1>
                            <ul class="flex flex-col md:flex-row flex-wrap align-baseline">
                                {
                                    searched_content.length ?
                                        <TestContainer tests={searched_content} bgStyle='trans' />
                                        :
                                        <div className='flex items-center space-x-3 space-x-reverse'>
                                            <p className='empty'>هیچ کوییزی پیدا نشد!</p>
                                        </div>
                                }
                            </ul>
                        </div>
                        <div className='self-start order-1 p-4 md:pl-8 md:sticky top-28'>
                            <div>
                                <h1 className='mb-10'>کتگوری ها</h1>
                                {
                                    searched_category.length ?
                                        <ul class="flex justify-start space-x-5 ml-4 md:ml-0 space-x-reverse">
                                            {
                                                searched_category.length ?
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
                                                    :
                                                    <div>
                                                        <div className='flex flex-col ml-4 space-y-3 md:hidden md:flexGrow'>
                                                            <div className='flex'>
                                                                <Skeleton variant="rounded" animation="wave" width={210} height={120} />
                                                                <div className='w-1/2 mr-3'>
                                                                    <Skeleton width="50%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                </div>
                                                            </div>
                                                            <div className='flex'>
                                                                <Skeleton variant="rounded" animation="wave" width={210} height={120} />
                                                                <div className='w-1/2 mr-3'>
                                                                    <Skeleton width="50%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex-row flex-wrap hidden md:flex'>
                                                            <div className='mx-4 mb-8'>
                                                                <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                                                                <div className='w-full mt-3'>
                                                                    <Skeleton width="50%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                </div>
                                                            </div>
                                                            <div className='mx-4 mb-8'>
                                                                <Skeleton variant="rounded" animation="wave" width={260} height={146} />
                                                                <div className='w-full mt-3'>
                                                                    <Skeleton width="50%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                    <Skeleton width="100%" animation="wave" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        </ul>
                                        :
                                        <div className='flex items-center space-x-3 space-x-reverse'>
                                            <p className='empty'>هیچ کتگوری پیدا نشد!</p>
                                        </div>
                                }
                            </div>
                            <div className='mt-10'>
                                <h1 className='mb-10'>کاربران</h1>
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
                        </div>
                    </div>
                    :
                    <SkeletonTestContainer />
            }
        </div>
    );
}

export default Search;