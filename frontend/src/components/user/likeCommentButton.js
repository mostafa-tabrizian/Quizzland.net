import { useState, useEffect, useCallback } from 'react';
import { Drawer, message } from 'antd';
import debounce from 'lodash.debounce'

import Comments from './comments'
import axios from 'axios'
import { log, getTheme } from '../base'
import userStore from '../../store/userStore';
import axiosInstance from '../axiosApi';

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [theme, setTheme] = useState('dark')
    const [likedState, setLikeState] = useState(false)
    
    const [userProfile, userActions] = userStore()
           
    useEffect(() => {
        setTheme(getTheme())
    }, []);

    const userLikedThisQuizBefore = () => {
        return userProfile.userDetail.liked_quizzes.split('_').includes(String(props.quizId) + props.quizType.slice(0, 1))
    }

    const removeLikeFromQuiz = async () => {
        const previousLikeCountValue = await previousLikeCount()
        const now = new Date().getTime()
        
        await axiosInstance.put(`/api/${props.quizType}View/${props.quizId}/?timestamp=${now}`, {like: previousLikeCountValue - 1})
            .then(res => {
                setLikeState(false)
                message.error('لایک شما حذف شد')
            })
            .catch(err => {
                message.error('در اعمال لایک بر کوییز خطایی رخ داد. لطفا کمی دیگر تلاش کنید.')
                log(err)
            })
    }

    const debounceRemoveLikeQuizFromUser = useCallback(
        debounce(
            async (userId) => {  
                const userLikedQuizzes = userProfile.userDetail.liked_quizzes.split('_')
                const findCurrentQuizLike = userLikedQuizzes.indexOf(String(props.quizId) + props.quizType.slice(0, 1))
                let updatedUserLikedQuizzes = userLikedQuizzes.splice(findCurrentQuizLike, 1)
                updatedUserLikedQuizzes = userLikedQuizzes.join('_')
                const now = new Date().getTime()
                
                await axiosInstance.patch(`/api/userView/${userId}/?timestamp=${now}`, { liked_quizzes: updatedUserLikedQuizzes})
                    .then(res => {
                        removeLikeFromQuiz()
                    })
                    .catch(err => {
                        message.error('در اعمال لایک از کاربر خطایی رخ داد. لطفا کمی دیگر تلاش کنید.')
                        log(err.response)
                    })
            }
        , 1000), []
    )
    
    const debounceSubmitUserLikedTheQuiz = useCallback(
        debounce(
            async (userId) => {
                const now = new Date().getTime()
                
                const updatedLikedQuizzes = userProfile.userDetail.liked_quizzes + `_${props.quizId}${props.quizType.slice(0, 1)}`

                await axiosInstance.patch(`/api/userView/${userId}/?timestamp=${now}`, { liked_quizzes: updatedLikedQuizzes })
                .then(res => {
                    submitLikeToQuiz()
                })
                .catch(err => {
                    message.error('در اعمال لایک از کاربر خطایی رخ داد. لطفا کمی دیگر تلاش کنید.')
                    log(err.response)
                })
            }
        , 1000), []
    )

    const previousLikeCount = async () => {
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/${props.quizType}View/${props.quizId}/?timestamp=${now}&public=true`)
            .then((req) => {
                return req.data.like
            })
            .catch(err => {
                log(err)
                log(err.response)
            })
    }

    const likeButtonClicked = async () => {
        setWatchListButtonUnClickable(false)
        message.loading()
        
        if (userProfile.userDetail.id) {
            if (userLikedThisQuizBefore() || likedState) {
                debounceRemoveLikeQuizFromUser(userProfile.userDetail.id)
                setWatchListButtonUnClickable(true)
            } else {
                debounceSubmitUserLikedTheQuiz(userProfile.userDetail.id)
                setWatchListButtonUnClickable(true)
            }
        } else {
            props.showLoginNotification()
            setWatchListButtonUnClickable(true)
        }
    }

    const submitLikeToQuiz = async () => {
        const previousLikeCountValue = await previousLikeCount()
        const now = new Date().getTime()
        
        await axiosInstance.put(`/api/${props.quizType}View/${props.quizId}/?timestamp=${now}`, {like: previousLikeCountValue + 1})
            .then(res => {
                setLikeState(true)
                message.success('لایک شما ثبت شد')
            })
            .catch(err => {
                message.error('در اعمال لایک بر کوییز خطایی رخ داد. لطفا کمی دیگر تلاش کنید.')
                log(err.response)
            })
    }
    
    return (
        <React.Fragment>
            <div className='fixed z-10 flex justify-center w-screen md:bottom-6 bottom-14'>
                <div className={`flex px-4 py-1 space-x-5 bg-red-800 rounded-2xl`}>
                    <button className={`${watchListButtonUnClickable?'':'pointer-events-none'} likeCommentButton`} onClick={() => likeButtonClicked()}>👍</button>
                    <span className='h-6 my-auto border border-red-700 '></span>
                    <button className='likeCommentButton' onClick={() => setCommentsPanelState(true)}>💬</button>
                </div>
            </div>

            <Drawer
                placement="right"
                onClose={() => setCommentsPanelState(false)}
                visible={commentsPanelOpen}
                drawerStyle={{
                    background: `${theme == 'dark' ? '#161616' : 'white'}`,
                    color:'white'
                }}
                headerStyle={{
                    background: `${theme == 'dark' ? '#161616' : 'white'}`,
                    color:'white'
                }}
                bodyStyle={{
                    padding: 0,
                    color:'white'
                }}
            >
                <Comments quizId={props.quizId} quizType={props.quizType} showLoginNotification={props.showLoginNotification} setCommentsPanelState={setCommentsPanelState} />
            </Drawer>
        </React.Fragment>
    );
}
 
export default LikeCommentButton;