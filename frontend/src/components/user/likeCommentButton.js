import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack'
import debounce from 'lodash.debounce'
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';

const Comments = React.lazy(() => import('./comments'))
import { log, isItMobile } from '../base'
import userStore from '../../store/userStore';
import axiosInstance from '../axiosAuthApi';
const LoginForm = React.lazy(() => import('./loginForm'))

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [likeLoading, setLikeLoading] = useState(false)
    
    const [userProfile] = userStore()

    const itIsMobile = useRef()
    
    const { enqueueSnackbar } = useSnackbar()
           
    useEffect(() => {
        itIsMobile.current = isItMobile()
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
                            showLoginNotification()
                        } else {
                            enqueueSnackbar('در اعمال لایک رخ داد. لطفا کمی دیگر تلاش کنید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            log(err.response)
                        }
                    })
                    setLikeLoading(false)
            }, 500
        )
    )

    const showLoginNotification = () => {
        enqueueSnackbar(
            <div className='mt-8'>
                <h5 className='mb-5'>
                    برای لایک و کامنت کردن لازمه که اول وارد کوییزلند بشی.
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

    const likeButtonClicked = async () => {
        setLikeLoading(true)
        setWatchListButtonUnClickable(false)
        
        if (userProfile.userDetail.id) {
            debounceSubmitLike(userProfile.userDetail.id)
            setWatchListButtonUnClickable(true)
        } else {
            showLoginNotification()
            setWatchListButtonUnClickable(true)
            setLikeLoading(false)
        }
    }

    const decideAnchor = () => {
        if (itIsMobile.current) {
            return 'bottom'
        } else {
            return 'right'
        }
    }
    
    return (
        <React.Fragment>
            <div className='fixed z-10 flex justify-center w-screen md:bottom-6 bottom-14'>
                <div className={`flex border border-[#4c4c4c] px-4 py-2 space-x-5 bg-red-800 rounded-2xl`}>
                    {/* like button */}
                        {
                            likeLoading ?
                            <CircularProgress
                                color="inherit"
                                size={20}
                                thickness={7} 
                            />
                            :
                            <button className={`${watchListButtonUnClickable?'':'pointer-events-none'} flex items-center`} onClick={() => likeButtonClicked()}>
                                <svg class="h-6 w-6 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                            </button>
                        }
                    <span className='h-6 my-auto border border-red-700 '></span>
                    {/* comment button */}
                    <button onClick={() => setCommentsPanelState(true)}>
                        <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.1" d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path></svg>
                    </button>
                </div>
            </div>

            <Drawer
                anchor={decideAnchor()}
                open={commentsPanelOpen}
                onClose={() => setCommentsPanelState(false)}
            >
                <Comments quizId={props.quizId} quizType={props.quizType} showLoginNotification={showLoginNotification} setCommentsPanelState={setCommentsPanelState} />
            </Drawer>
            
        </React.Fragment>
    );
}
 
export default LikeCommentButton;