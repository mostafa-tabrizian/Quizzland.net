import { useState } from 'react';
import { Drawer, message } from 'antd';

import Comments from './comments'
import axiosInstance from './axiosApi';
import { log } from './base'
import userProfileDetail from './userProfileDetail';

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
           
    const userLikedThisQuizBefore = (userDetail) => {
        return userDetail.liked_quizzes.split('_').includes(String(props.quizId))
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

    const removeLikeQuizFromUser = async (userDetail) => {  
        const userLikedQuizzes = userDetail.liked_quizzes.split('_')
        const findCurrentQuizLike = userLikedQuizzes.indexOf(String(props.quizId))
        let updatedUserLikedQuizzes = userLikedQuizzes.splice(findCurrentQuizLike, findCurrentQuizLike)
        updatedUserLikedQuizzes = userLikedQuizzes.join('_')
        
        await axiosInstance.patch(`/api/user/${userDetail.id}/`, { liked_quizzes: updatedUserLikedQuizzes})
            // .then(res => {
            // })
            .catch(err => {
                log(err.response)
            })
    }
    
    const submitUserLikedTheQuiz = async (userDetail) => {
        await axiosInstance.patch(`/api/user/${userDetail.id}/`, { liked_quizzes: userDetail.liked_quizzes + `${props.quizId}_` })
        // .then(res => {
        // })
        .catch(err => {
            log(err.response)
        })
    }

    const previousLikeCount = async () => {
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/${props.quizType}/${props.quizId}/?timestamp=${now}&public=true`)
            .then((req) => {
                return req.data.like
            })
    }

    const likeButtonClicked = async () => {
        const userDetail = await userProfileDetail()
        log(userDetail)
        
        if (userLikedThisQuizBefore(userDetail)) {
            removeLike()
            removeLikeQuizFromUser(userDetail)
            message.error('لایک شما حذف شد')
        } else {
            submitLike()
            submitUserLikedTheQuiz(userDetail)
            message.success('لایک شما ثبت شد')
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
            <div className='fixed z-10 flex justify-center w-screen bottom-6'>
                <div className='flex px-4 py-1 space-x-5 bg-red-800 rounded-2xl'>
                    <button className='likeCommentButton' onClick={() => likeButtonClicked()}>👍</button>
                    <span className='h-6 my-auto border border-red-700 '></span>
                    <button className='likeCommentButton' onClick={() => setCommentsPanelState(true)}>💬</button>
                </div>
            </div>

            <Drawer
                placement="right"
                onClose={() => setCommentsPanelState(false)}
                visible={commentsPanelOpen}
                drawerStyle={{
                    background: '#060101',
                }}
                headerStyle={{
                    background: '#060101',
                }}
                bodyStyle={{
                    padding: 0,
                }}
            >
                <Comments quizId={props.quizId} quizType={props.quizType} />
            </Drawer>
        </React.Fragment>
    );
}
 
export default LikeCommentButton;