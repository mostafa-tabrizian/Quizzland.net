import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack'
import debounce from 'lodash.debounce'

import Comments from './comments'
import { log, getTheme } from '../base'
import userStore from '../../store/userStore';
import axiosInstance from '../axiosApi';
import BackdropLoading from '../bacdropLoading';

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [theme, setTheme] = useState('dark')
    const [loading, setLoading] = useState(false)
    
    const [userProfile] = userStore()
    
    const { enqueueSnackbar } = useSnackbar()
           
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
                                enqueueSnackbar('لایک شما ثبت شد!', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            } else {
                                enqueueSnackbar('لایک شما حذف شد!', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                        } else {
                            log(res)
                        }
                    })
                    .catch(err => {
                        if (err.response.status == 401) {
                            props.showLoginNotification()
                        } else {
                            enqueueSnackbar('در اعمال لایک رخ داد. لطفا کمی دیگر تلاش کنید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            log(err.response)
                        }
                    })
                    setLoading(false)
            }, 500
        )
    )

    const likeButtonClicked = async () => {
        setLoading(true)
        setWatchListButtonUnClickable(false)
        
        if (userProfile.userDetail.id) {
            debounceSubmitLike(userProfile.userDetail.id)
            setWatchListButtonUnClickable(true)
        } else {
            props.showLoginNotification()
            setWatchListButtonUnClickable(true)
            setLoading(false)
        }
    }
    
    return (
        <React.Fragment>
            <BackdropLoading loadingStatue={loading} />

            <div className='fixed z-10 flex justify-center w-screen md:bottom-6 bottom-14'>
                <div className={`flex px-4 py-1 space-x-5 bg-red-800 rounded-2xl`}>
                    <button className={`${watchListButtonUnClickable?'':'pointer-events-none'} likeCommentButton`} onClick={() => likeButtonClicked()}>👍</button>
                    <span className='h-6 my-auto border border-red-700 '></span>
                    <button className='likeCommentButton' onClick={() => setCommentsPanelState(true)}>💬</button>
                </div>
            </div>

            {/* <Drawer
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
            </Drawer> */}
        </React.Fragment>
    );
}
 
export default LikeCommentButton;