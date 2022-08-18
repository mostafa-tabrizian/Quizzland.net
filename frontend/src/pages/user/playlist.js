import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

import axiosInstance from '../../components/axiosApi';
import LoadingScreen from '../../components/loadingScreen'
import QuizContainer from '../../components/quizContainer'
import skeletonQuiz from '../../components/skeletonQuiz';

import { log, getTheme, takeParameterFromUrl } from '../../components/base'
import UserStore from '../../store/userStore';

const QuizHistory = () => {
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [content, setContent] = useState([])
    const [title, setTitle] = useState(null)
    const [lowTitle, setLowTitle] = useState(null)

    const location = useLocation();
    
    const [userProfile, userActions] = UserStore()

    useEffect(() => {
        fetchContent()
        setLoadState(true)
        
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
        document.getElementById('land').scrollIntoView()
    }, [location, userProfile])

    const fetchContent = async () => {
        if (userProfile.userDetail == false) {
            window.location.href = '/login'
        }
        
        let playlist
        const playlistType = takeParameterFromUrl('list')
        switch(playlistType) {
            case 'like':
                playlist = userProfile.userDetail.liked_quizzes.split('_')
                setTitle('کوییز های لایک شده')
                setLowTitle('Your Liked Quizzes')
                break
            case 'history':
                playlist = userProfile.userDetail.played_history.split('_')
                setTitle('تاریخچه کوییزهای شما')
                setLowTitle('Your History')
                break
            case 'watch':
                playlist = userProfile.userDetail.watch_list.split('_')
                setTitle('کوییز های پلی لیست شما')
                setLowTitle('Your Playlist')
        }
        
        const now = new Date().getTime()
        const quiz = await axiosInstance.get(`/api/quizView/?public=true&timestamp=${now}`)
            .catch(err => {log(err.response)})
        const pointy = await axiosInstance.get(`/api/testView/?public=true&timestamp=${now}`)
            .catch(err => {log(err.response)})

        let finalList = []
        
        playlist.map(quizId => {
            if (quizId && quizId != 0) {
                let historyItem

                if (quizId.includes('q')) {
                    historyItem = quiz.data.filter(elem => elem.id == parseInt(quizId))
                }
                else if (quizId.includes('t')) {
                    historyItem = pointy.data.filter(elem => elem.id == parseInt(quizId))
                }
                
                finalList.push(historyItem[0])    
            }
        })
        
        setContent(finalList.reverse())
        setContentLoaded(true)
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Helmet>
                <title>{`${title} | کوییزلند`}</title>
                <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
            </Helmet>

            {/* <div className='adverts adverts__left'>
                <div id='mediaad-DLgb'></div>
                <div id="pos-article-display-26094"></div>
            </div> */}

            <div className='mb-10'>
                <h3 className='lowTitle'>{lowTitle}</h3>
                <h3 className='title'>{title}</h3>
            </div>

            <div className='w-3/4 mx-auto'>
                {skeletonQuiz(contentLoaded)}
            </div>

            {
                (!content.length  && document.readyState !== 'loading') ?
                <h1 className='mt-10 mb-[25rem] text-center'>هیچ کوییزی پیدا نشد <span className='text-[2.5rem]'>😕</span></h1>
                :
            <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 quizContainer flex-ai-fe justify-right">
                    <QuizContainer quizzes={content} />
                </ul>    
            }

            {/* Adverts */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}

        </React.Fragment>
    );
}

export default QuizHistory;