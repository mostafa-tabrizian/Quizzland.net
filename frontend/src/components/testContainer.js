import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Skeleton from '@mui/material/Skeleton';
import debounce from 'lodash.debounce'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoginForm from '../components/user/loginForm';

import { log, getTheme, replaceFunction } from './base'
import axiosInstance from './axiosAuthApi';
import UserStore from '../store/userStore';
import SkeletonTestContainer from './skeletonTestContainer';
import BackdropLoading from './backdropLoading';

const TestContainer = (props) => {
    const [theme, setTheme] = useState('dark')
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [showPlaylistButton, setShowPlaylistButton] = useState(null)
    const [loading, setLoading] = useState(false)

    const [userProfile, userActions] = UserStore()

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        const theme = getTheme()
        setTheme(theme)
    }, []);

    const addToWatchListClicked = async (quizId, quizCheckIfTrivia) => {
        setLoading(true)

        if (userProfile.userDetail) {
            checkWatchList(quizId, quizCheckIfTrivia)
        } else {
            setLoading(false)
            showLoginNotification()
        }
    }

    const showLoginNotification = () => {
        return enqueueSnackbar(
            <div className='mt-8'>
                <h5 className='mb-5'>
                    برای اضافه کردن این کوییز به پلی لیست لازمه که اول وارد کوییزلند بشی.
                </h5>
                <div className='border-2 border-[#c30000] bg-[#c30000] rounded-lg w-fit'>
                    <LoginForm />
                </div>
            </div>,
            { 
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                preventDuplicate: true
            }
        )
    }
    
    const debounceAddToWatchList = useCallback(
        debounce(
            async (userDetail, quizId, quizType) => {
                const now = new Date().getTime()

                const payload = {
                    user_id: {
                        username: userDetail.id
                    },
                    test_id: {
                        id: quizType == 'test' ? quizId : 0
                    },
                    trivia_id: {
                        id: quizType == 'trivia' ? quizId : 0
                    }
                }

                await axiosInstance.post(`/api/watchListView/?timestamp=${now}`, payload)
                    .then(res => {
                        if (res.status == 201) {
                            if (res.data?.id) {
                                setWatchListButtonUnClickable(true)
                                enqueueSnackbar('با موفقیت به پلی لیست اضافه گردید.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            } else {
                                setWatchListButtonUnClickable(true)
                                enqueueSnackbar('با موفقیت از پلی لیست حذف گردید.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                        } else {
                            log(res)
                        }
                    })
                    .catch(err => {
                        if (err.response.status == 401) {
                            showLoginNotification()
                        } else {
                            enqueueSnackbar('در افزودن به پلی لیست خطایی رخ داد. لطفا کمی دیگر تلاش کنید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            log(err.response)
                        }
                    })
                    
                setLoading(false)
            }, 500
        )
	);

    const checkWatchList = async (quizId, quizCheckIfTrivia) => {
        setWatchListButtonUnClickable(false)
        
        let quizType
        if (quizCheckIfTrivia) {
            quizType = 'trivia'
        } else {
            quizType = 'test'
        }
        const userDetail = userProfile.userDetail

        debounceAddToWatchList(userDetail, quizId, quizType)
    }

    const returnQuizzes = () => {
        return (
            <React.Fragment>
                <BackdropLoading loadingStatue={loading} />
                
                {
                    props.tests.length ?
                    props.tests.map((quiz) => {
                        return (
                            <li key={quiz.id} className='relative flex-auto mb-2 md:mr-4 md:mb-4' onMouseEnter={() => setShowPlaylistButton(quiz.id)} onMouseLeave={() => setShowPlaylistButton(null)}>
                                <button onClick={() => addToWatchListClicked(quiz.id, quiz.GIF20)} className={`${watchListButtonUnClickable?'':'pointer-events-none'} ${(showPlaylistButton == quiz.id) ? 'visible opacity-100 translate-y-0' : 'md:invisible md:opacity-0 md:translate-y-2'} duration-300 ease-in-out transition-all  absolute top-[-0.5rem] right-[-.5rem] z-[1]`}>
                                    <svg class="h-7 w-7 text-[#ac272e]"  fill="#1e0809" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </button>
                                <article className={`
                                    flex text-right h-full
                                    rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                `}>
            
                                    <Link
                                        to={`/${quiz.GIF20 ? 'quiz' : 'test'}/${replaceFunction(quiz.slug, ' ', '-')}`}
                                        className={`flex md:block md:grid-cols-5 bg-gradient-to-l md:bg-gradient-to-b rounded-t-xl ${theme == 'light' ? 'from-white' : 'from-black'} to-transparent`}
                                    >
                                        <div className='md:col-span-2 md:w-[260px] h-[7rem] w-full md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                            <LazyLoadImage
                                                src={quiz.thumbnail}
                                                alt={`${quiz.subCategory} | ${quiz.title}`}
                                                className='object-cover h-[7rem] md:h-full'
                                                effect="blur"
                                                placeholder={<Skeleton variant="rounded" animation="wave" width={210} height={120} />}
                                            />
                                        </div>
                                        <div className='w-full pt-1 pb-3 pr-4 md:pr-2 md:col-span-3 md:mt-2'>
                                            <h3 className={`testContainer__title testContainer__title__noViews flex m-auto md:m-0
                                                            md:w-52 md:text-base`}>
                                                {quiz.subCategory}
                                            </h3>
                                            <h4 className={`
                                                testContainer__title testContainer__title__noViews flex
                                                w-[10rem] md:w-52 md:text-base
                                            `}>
                                                {quiz.title}
                                            </h4>
                                            {/* <div className="testContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                                            {/* <span className="text-center testContainer__date">
                                                {datePublishHandler(quiz.publish)}
                                            </span> */}
                                        </div>
                                    </Link>
                                </article>
                            </li>
                        )
                    })
                    :
                    <SkeletonTestContainer />
                }
            </React.Fragment>
        )
    }

    return (
        returnQuizzes()
    )
}
 
export default TestContainer;