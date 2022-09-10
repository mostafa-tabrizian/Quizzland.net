import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { message, notification } from 'antd'
import 'antd/dist/antd.css'
import debounce from 'lodash.debounce'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoginForm from '../components/user/loginForm';

import { log, getTheme, replaceFunction } from './base'
import axiosInstance from './axiosApi';
import userStore from '../store/userStore';

const QuizContainer = (props) => {
    const [theme, setTheme] = useState('dark')
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [showPlaylistButton, setShowPlaylistButton] = useState(null)

    const [userProfile, userActions] = userStore()

    useEffect(() => {
        const theme = getTheme()
        setTheme(theme)
    }, []);

    const addToWatchListClicked = async (quizId, quizCheckIfTrivia) => {
        message.loading('', 1)

        if (userProfile.userDetail) {
            checkWatchList(quizId, quizCheckIfTrivia)
        } else {
            const key = `open${Date.now()}`;
            const btn = (
                <div className='border-2 border-[#c30000] bg-[#c30000] rounded-lg w-fit'>
                    <LoginForm />
                </div>
            );
            notification.open({
                description:
                    <h5 className='mt-8'>
                        برای اضافه کردن این کوییز به پلی لیست لازمه که اول وارد کوییزلند بشی.
                    </h5>,
                duration: 10,
                style: {
                    background: '#ac272e',
                    color: 'white',
                    borderRadius: '15px'
                },
                btn,
                key
            });
        }
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
                        log(res)
                        if (res.status == 201) {
                            if (res.data?.id) {
                                setWatchListButtonUnClickable(true)
                                message.success('با موفقیت به پلی لیست اضافه گردید.')
                            } else {
                                setWatchListButtonUnClickable(true)
                                message.error('با موفقیت به پلی لیست حذف گردید.')
                            }
                        } else {
                            log(res)
                        }
                    })
                    .catch(err => {
                        if (err.response.status == 401) {
                            props.showLoginNotification()
                        } else {
                            message.error('در افزودن به پلی لیست خطایی رخ داد. لطفا کمی دیگر تلاش کنید.')
                            log(err.response)
                        }
                    })
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

    return (
        props.quizzes.map((quiz) => {
            return (
                <li key={quiz.id} className='relative flex-auto mb-5 md:mr-4 md:mb-4' onMouseEnter={() => setShowPlaylistButton(quiz.id)} onMouseLeave={() => setShowPlaylistButton(null)}>
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
                            className={`flex md:block md:grid-cols-5 bg-gradient-to-l md:bg-gradient-to-b rounded-t-xl ${theme == 'dark' ? 'from-black' :  'from-white'} to-transparent`}
                        >
                            <div className='md:col-span-2 md:w-[260px] h-[7rem] w-full md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                <LazyLoadImage
                                    src={quiz.thumbnail}
                                    alt={`${quiz.subCategory} | ${quiz.title}`}
                                    className='object-cover h-full'
                                    effect="blur"
                                />
                            </div>
                            <div className='w-full pt-1 pb-3 pr-4 md:pr-2 md:col-span-3 md:mt-2'>
                                <h3 className={`quizContainer__title quizContainer__title__noViews flex m-auto md:m-0
                                                md:w-52 md:text-base`}>
                                    {quiz.subCategory}
                                </h3>
                                <h4 className={`
                                    quizContainer__title quizContainer__title__noViews flex
                                    w-[10rem] md:w-52 md:text-base
                                `}>
                                    {quiz.title}
                                </h4>
                                {/* <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                                {/* <span className="text-center quizContainer__date">
                                    {datePublishHandler(quiz.publish)}
                                </span> */}
                            </div>
                        </Link>
                    </article>
                </li>
            )
        })
    )
}
 
export default QuizContainer;