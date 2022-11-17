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

const QuizContainer = (props) => {
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
                    props.quizzes.length ?
                    props.quizzes.map((quiz) => {
                        return (
                            <li key={quiz.id} className='mb-5 ml-5 md:mb-10 md:ml-10 flex-auto md:flex-none'>
                                <article className={`
                                    text-right
                                    rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                                `}>

                                    <Link
                                        to={`/play/${replaceFunction(quiz.slug.toLowerCase(), ' ', '-')}`}
                                        className=''
                                    >
                                        <div className='overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                            <LazyLoadImage
                                                src={quiz.thumbnail}
                                                alt={`${quiz.subCategory} | ${quiz.title}`}
                                                className='object-cover h-[9rem] w-[9rem] md:h-[16rem] md:w-[16rem]'
                                                effect="blur"
                                                placeholder={<Skeleton variant="rounded" animation="wave" width={210} height={120} />}
                                            />
                                        </div>
                                        <div className='w-full pt-1 pb-3 pr-4 md:pr-0 md:col-span-3 md:mt-2'>
                                            <h2 className={`
                                                testContainer__title testContainer__title__noViews flex m-auto md:m-0
                                                md:w-52
                                            `}>
                                                {quiz.title}
                                            </h2>
                                            <h3 className={`
                                                testContainer__title testContainer__title__noViews flex
                                                w-[10rem] md:w-52
                                            `}>
                                                {quiz.slug}
                                            </h3>
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
        <React.Fragment>
            {returnQuizzes()}
        </React.Fragment>
    )
}
 
export default QuizContainer;