import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { message, notification } from 'antd'

import { log, replaceFunction } from './base'
import userProfileDetail from '../components/user/userProfileDetail'
import axiosInstance from '../components/axiosApi'

const QuizContainer = (props) => {
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)

    const checkIfExistsThenRemove = async (userDetail, quizId, quizType) => {
        const userWatchList = userDetail.watch_list.split('_')
        const findCurrentQuizInWatchList = userWatchList.indexOf(String(quizId) + quizType)
        
        if (findCurrentQuizInWatchList == -1) {  // mean not exist
            return false
        }
        
        let updatedUserWatchList = userWatchList.splice(findCurrentQuizInWatchList, 1)
        updatedUserWatchList = userWatchList.join('_')
        
        await axiosInstance.patch(`/api/user/${userDetail.id}/`, { watch_list: updatedUserWatchList})
            .then(res => {
                setWatchListButtonUnClickable(true)
                message.success('با موفقیت از پلی لیست حذف گردید.')
            })
            .catch(err => {
                log(err.response)
            })
        return true
    }

    const addToWatchListClicked = async (quizId, quizCheckIfQuiz) => {
        message.loading('', 1)
        
        const userDetail = await userProfileDetail()

        if (userDetail) {
            checkWatchList(quizId, quizCheckIfQuiz, userDetail)
        } else {
            const key = `open${Date.now()}`;
            const btn = (
                <div className='flex space-x-5 space-x-reverse'>
                    <button className='px-4 py-2 border rounded-xl'>
                        <a href='/login' className='hover:text-gray-300'>
                            وارد میشوم
                        </a>
                    </button>
                    <button onClick={() => notification.close(key)}>
                        بی خیال
                    </button>
                </div>
            );
            notification.open({
                message: '',
                description:

                    <h5>
                        برای اضافه کردن این کوییز به پلی لیست خود می‌بایست ابتدا وارد شوید
                    </h5>,
                duration: 10,
                style: {
                    background: '#ac272e',
                    color: 'white',
                    borderRadius: '15px'
                },
                btn,
                key,
                onClose: close,
            });
        }
    }
    
    const checkWatchList = async (quizId, quizCheckIfQuiz, userDetail) => {
        setWatchListButtonUnClickable(false)
        
        let quizType
        if (quizCheckIfQuiz) {
            quizType = 'q'
        } else {
            quizType = 't'
        }

        if (await checkIfExistsThenRemove(userDetail, quizId, quizType)) { return }
        
        
        await axiosInstance.patch(`/api/user/${userDetail.id}/`, { watch_list: userDetail.watch_list + `_${quizId}${quizType}` })
        .then(res => {
            setWatchListButtonUnClickable(true)
            message.success('با موفقیت به پلی لیست اضافه گردید.')
        })
        .catch(err => {
            log(err.response)
        })
    }

    return (
        props.quizzes.map((quiz) => {
            return (
                <li key={quiz.id} className='relative flex-auto mb-5 md:mr-4 md:mb-4'>
                    <button onClick={() => addToWatchListClicked(quiz.id, quiz.GIF20)} className={`${watchListButtonUnClickable?'':'pointer-events-none'} absolute top-[-0.5rem] right-[-.5rem] z-[1]`}>
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
                            className='flex md:block md:grid-cols-5'
                        >
                            <div className='md:col-span-2 md:w-[260px] h-[7rem] md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                                <img
                                    src={quiz.thumbnail}
                                    width={1366}
                                    height={768}
                                    alt={`${quiz.subCategory} | ${quiz.title}`}
                                    className='object-cover h-full'
                                />
                            </div>
                            <div className='w-full pt-1 pb-3 pr-4 md:pr-0 md:col-span-3 md:mt-2'>
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