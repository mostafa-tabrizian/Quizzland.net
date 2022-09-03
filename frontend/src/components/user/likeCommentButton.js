import { useState, useEffect, useCallback } from 'react';
import { Drawer, message } from 'antd';
import debounce from 'lodash.debounce'

import Comments from './comments'
import { log, getTheme } from '../base'
import userStore from '../../store/userStore';
import axiosInstance from '../axiosApi';

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [theme, setTheme] = useState('dark')
    
    const [userProfile, userActions] = userStore()
           
    useEffect(() => {
        setTheme(getTheme())
    }, []);
    
    const debounceSubmitLike = useCallback(
        debounce(
            async (userId) => {
                const now = new Date().getTime()

                const payload = {
                    user_id: {
                        username: userId
                    },
                    test_id: {
                        id: props.quizType == 'test' ? props.quizId : 0
                    },
                    trivia_id: {
                        id: props.quizType == 'quiz' ? props.quizId : 0
                    }
                }

                await axiosInstance.post(`/api/likeView/?timestamp=${now}`, payload)
                    .then(res => {
                        if (res.status == 201) {
                            if (res.data?.id) {
                                message.success('لایک شما ثبت شد')
                            } else {
                                message.error('لایک شما حذف شد')
                            }
                        } else {
                            log(res)
                        }
                    })
                    .catch(err => {
                        log(err.response)
                        if (err.response.status == 401) {
                            props.showLoginNotification()
                        } else {
                            message.error('در اعمال لایک رخ داد. لطفا کمی دیگر تلاش کنید.')
                            log(err.response)
                        }
                    })
            }
        , 1000), []
    )

    const likeButtonClicked = async () => {
        setWatchListButtonUnClickable(false)
        message.loading()
        
        if (userProfile.userDetail.id) {
            debounceSubmitLike(userProfile.userDetail.id)
            setWatchListButtonUnClickable(true)
        } else {
            props.showLoginNotification()
            setWatchListButtonUnClickable(true)
        }
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