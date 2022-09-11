import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';

import axiosInstance from '../../components/axiosApi';
import LoadingScreen from '../../components/loadingScreen'
import QuizContainer from '../../components/quizContainer'
import LoginForm from '../../components/user/loginForm';

import { log, getTheme, takeParameterFromUrl } from '../../components/base'
import UserStore from '../../store/userStore';
import { divide } from 'lodash';
import SkeletonQuizContainer from '../../components/skeletonQuizContainer';

const QuizHistory = () => {
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [content, setContent] = useState([])
    const [title, setTitle] = useState(null)
    const [lowTitle, setLowTitle] = useState(null)
    const [messageForEmpty, setMessageForEmpty] = useState(null)

    const location = useLocation();
    
    const [userProfile, userActions] = UserStore()

    useEffect(() => {
        fetchContent()
        setLoadState(true)
        
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
        document.getElementById('land').scrollIntoView()
    }, [location, userProfile])

    const fetchContent = async () => {
        if (userProfile.userDetail == false || userProfile.userDetail == null) {
            return
        }
        
        let playlist
        const now = new Date().getTime()
        const playlistType = takeParameterFromUrl('list')

        switch(playlistType) {
            case 'like':
                playlist = await axiosInstance.get(`/api/likeView/?timestamp=${now}`)
                    .then(res => {
                        return res.data
                    })
                    .catch(err => {
                        return log(err.response)
                    })

                setTitle('کوییز های لایک شده')
                setLowTitle('Your Liked Quizzes')
                setMessageForEmpty('هیچ کوییزی رو تا حالا لایک نکردی!')
                break
            case 'history':
                playlist = await axiosInstance.get(`/api/historyView/?timestamp=${now}`)
                    .then(res => {
                        return res.data
                    })
                    .catch(err => {
                        return log(err.response)
                    })

                setTitle('تاریخچه کوییزهای شما')
                setLowTitle('Your History')
                setMessageForEmpty('هیچ کوییزی رو تا حالا انجام ندادی!')
                break
            case 'watch':
                playlist = await axiosInstance.get(`/api/watchListView/?timestamp=${now}`)
                    .then(res => {
                        return res.data
                    })
                    .catch(err => {
                        return log(err.response)
                    })

                setTitle('کوییز های پلی لیست شما')
                setLowTitle('Your Playlist')
                setMessageForEmpty('هیچ کوییزی رو اضافه نکردی!')
        }
        
        let finalList = []
        
        playlist?.length &&
        playlist.map(quiz => {
            if (quiz.trivia_id) {
                finalList.push(quiz.trivia_id)
            }
            else if (quiz.test_id) {
                finalList.push(quiz.test_id)
            }
        })
        
        setContent([])
        setContent(finalList.reverse())
        setContentLoaded(true)
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Helmet>
                <title>{`${title || 'پلی لیست'} | کوییزلند`}</title>
                <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
            </Helmet>

            <div className={`mx-4 md:mx-auto md:w-4/5 min-h-[60vh] ${userProfile.userDetail ? '' : 'flex' }`}>
                {
                    userProfile.userDetail ?
                    <div>
                        {
                            contentLoaded ?
                            <div>
                                {/* <div className='adverts adverts__left'>
                                    <div id='mediaad-DLgb'></div>
                                    <div id="pos-article-display-26094"></div>
                                </div> */}
        
                                <div className='mb-10'>
                                    <h3 className='lowTitle'>{lowTitle}</h3>
                                    <h3 className='title'>{title}</h3>
                                </div>
                                
                                <ul className="flex flex-col flex-wrap justify-center align-baseline md:flex-row">
                                    {
                                        content.length ?
                                        <QuizContainer quizzes={content} />
                                        :
                                        <h1 className='mt-10 mb-[25rem] text-center'>{messageForEmpty}<span className='text-[2.5rem]'>😕</span></h1>
                                    }
                                </ul>    
        
                                {/* Adverts */}
        
                                {/* Adverts */}
                                {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}
                            </div>
                            :
                            <SkeletonQuizContainer />
                        }

                    </div>
                    :
                    <div className='m-auto space-y-5 text-center md:shadow-[0_0_10px_#690D11] md:p-8 rounded-lg'>
                        <h1 className='title'>شما میبایست ابتدا <span className='text-red-600 title'>وارد</span> شوید.</h1>
                        <div>
                            <LoginForm/>
                        </div>
                    </div>
                }
            </div>

        </React.Fragment>
    );
}

export default QuizHistory;