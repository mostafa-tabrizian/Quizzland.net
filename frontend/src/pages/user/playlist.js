import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import axiosInstance from '../../components/axiosAuthApi'
import { log, getTheme, takeParameterFromUrl } from '../../components/base'
import UserStore from '../../store/userStore'
const LoadingScreen = React.lazy(() => import('../../components/loadingScreen'))
const TestContainer = React.lazy(() => import('../../components/testContainer'))
const QuizContainer = React.lazy(() => import('../../components/quizContainer'))
const LoginForm = React.lazy(() => import('../../components/auth/_form'))
const SkeletonTestContainer = React.lazy(() => import('../../components/skeletonTestContainer'))

const Playlist = () => {
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [testContent, setTestContent] = useState([])
    const [quizContent, setQuizContent] = useState([])
    const [title, setTitle] = useState(null)
    const [lowTitle, setLowTitle] = useState(null)
    const [messageForEmpty, setMessageForEmpty] = useState(null)
    const [gameType, setGameType] = useState('quiz')

    const location = useLocation();
    
    const [userProfile, userActions] = UserStore()

    useEffect(() => {
        fetchContent()
        setLoadState(true)
        
        // document.querySelector('body').style = `background: ${getTheme() == 'light' ? 'white' : '#060101'}`
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
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

                setTitle('لایک های شما')
                setLowTitle('Your Likes')
                setMessageForEmpty('هیچ لایکی ثبت نکرده اید!')
                break
            case 'history':
                playlist = await axiosInstance.get(`/api/historyView/?timestamp=${now}`)
                    .then(res => {
                        return res.data
                    })
                    .catch(err => {
                        return log(err.response)
                    })

                setTitle('تاریخچه‌ی شما')
                setLowTitle('Your History')
                setMessageForEmpty('هیچ تاریخچه‌ای برای شما ثبت نشده است!')
                break
            case 'watch':
                playlist = await axiosInstance.get(`/api/watchListView/?timestamp=${now}`)
                    .then(res => {
                        return res.data
                    })
                    .catch(err => {
                        return log(err.response)
                    })

                setTitle('ذخیره شده های شما')
                setLowTitle('Your Saved')
                setMessageForEmpty('هیچ محتوایی را ذخیره نکرده اید!')
        }
        
        let quizFinalList = []
        let testFinalList = []
        
        playlist?.length &&
        playlist.map(quiz => {
            if (quiz.quizV2_id) {
                quizFinalList.push(quiz.quizV2_id)
            }
            else if (quiz.test_id) {
                testFinalList.push(quiz.test_id)
            }
        })
        
        setQuizContent([])
        setQuizContent(quizFinalList.reverse())
        
        setTestContent([])
        setTestContent(testFinalList.reverse())

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
                        <div className='mb-10'>
                            <h3 className='lowTitle'>{lowTitle}</h3>
                            <h3 className='title'>{title}</h3>
                        </div>

                        {
                            contentLoaded ?
                            <div>      
                                <div className='grid grid-cols-2 w-[22rem] mx-auto my-12 justify-center'>
                                    <h3 className={`${gameType == 'quiz' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { setGameType('quiz') }} type='button'>کوییز ها</button></h3>
                                    <h3 className={`${gameType == 'test' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { setGameType('test') }} type='button'>تست ها</button></h3>
                                </div>

                                {
                                    quizContent.length ?
                                    <ul className={`${gameType == 'quiz' ? 'pop_up opacity-100' : 'pop_down opacity-0 absolute'} flex flex-wrap align-baseline`}>
                                        <QuizContainer quizzes={quizContent} bgStyle={'trans'} />
                                    </ul>
                                    :
                                    <h1 className={`${gameType == 'quiz' ? 'pop_up opacity-100' : 'pop_down opacity-0 absolute'} mt-10 mb-[25rem] text-center`}>{messageForEmpty}<span className='text-[2.5rem]'>😕</span></h1>
                                }

                                {
                                    testContent.length ?
                                    <ul className={`${gameType == 'test' ? 'pop_up opacity-100' : 'pop_down opacity-0 absolute'} flex flex-wrap align-baseline`}>
                                        <TestContainer tests={testContent} bgStyle={'trans'} />
                                    </ul>
                                    :
                                    <h1 className={`${gameType == 'test' ? 'pop_up opacity-100' : 'pop_down opacity-0 absolute'} mt-10 mb-[25rem] text-center`}>{messageForEmpty}<span className='text-[2.5rem]'>😕</span></h1>
                                }
        
                                {/* Adverts */}
        
                                {/* Adverts */}
                                {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}
                            </div>
                            :
                            <SkeletonTestContainer />
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

export default Playlist;