import { useState, useEffect, useCallback } from 'react';
import { Drawer, message } from 'antd';
import debounce from 'lodash.debounce'

import Comments from './comments'
import axiosInstance from '../axiosApi';
import { log, getTheme } from '../base'
import userProfileDetail from './userProfileDetail';

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [theme, setTheme] = useState('dark')
           
    useEffect(() => {
        setTheme(getTheme())
    }, []);

    const userLikedThisQuizBefore = (userDetail) => {
        return userDetail.liked_quizzes.split('_').includes(String(props.quizId) + props.quizType.slice(0, 1))
    }

    const removeLike = async () => {
        const previousLikeCountValue = await previousLikeCount()

        await axiosInstance.put(`/api/${props.quizType}/${props.quizId}/`, {like: previousLikeCountValue - 1})
            // .then(res => {
            // })
            .catch(err => {
                log(err)
            })
    }

    const debounceRemoveLikeQuizFromUser = useCallback(
        debounce(
            async (userDetail) => {  
                const userLikedQuizzes = userDetail.liked_quizzes.split('_')
                const findCurrentQuizLike = userLikedQuizzes.indexOf(String(props.quizId) + props.quizType.slice(0, 1))
                let updatedUserLikedQuizzes = userLikedQuizzes.splice(findCurrentQuizLike, 1)
                updatedUserLikedQuizzes = userLikedQuizzes.join('_')
                
                await axiosInstance.patch(`/api/userView/${userDetail.id}/`, { liked_quizzes: updatedUserLikedQuizzes})
                    // .then(res => {
                    // })
                    .catch(err => {
                        log(err.response)
                    })
            }
        , 1000), []
    )
    
    const debounceSubmitUserLikedTheQuiz = useCallback(
        debounce(
            async (userDetail) => {
                await axiosInstance.patch(`/api/userView/${userDetail.id}/`, { liked_quizzes: userDetail.liked_quizzes + `_${props.quizId}${props.quizType.slice(0, 1)}` })
                // .then(res => {
                // })
                .catch(err => {
                    log(err.response)
                })
            }
        , 1000), []
    )

    const previousLikeCount = async () => {
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/${props.quizType}/${props.quizId}/?timestamp=${now}&public=true`)
            .then((req) => {
                return req.data.like
            })
    }

    const likeButtonClicked = async () => {
        setWatchListButtonUnClickable(false)
        message.loading()

        const userDetail = await userProfileDetail()
        
        if (userDetail) {
            if (userLikedThisQuizBefore(userDetail)) {
                removeLike()
                debounceRemoveLikeQuizFromUser(userDetail)
                setWatchListButtonUnClickable(true)
                message.error('لایک شما حذف شد')
            } else {
                submitLike()
                debounceSubmitUserLikedTheQuiz(userDetail)
                setWatchListButtonUnClickable(true)
                message.success('لایک شما ثبت شد')
            }
        } else {
            props.setShowLoginForm(true)
            setWatchListButtonUnClickable(true)
        }
    }

    const submitLike = async () => {
        const previousLikeCountValue = await previousLikeCount()

        await axiosInstance.put(`/api/${props.quizType}/${props.quizId}/`, {like: previousLikeCountValue + 1})
            // .then(res => {
            // })
            .catch(err => {
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
                <Comments quizId={props.quizId} quizType={props.quizType} setShowLoginForm={props.setShowLoginForm} setCommentsPanelState={setCommentsPanelState} />
            </Drawer>
        </React.Fragment>
    );
}
 
export default LikeCommentButton;