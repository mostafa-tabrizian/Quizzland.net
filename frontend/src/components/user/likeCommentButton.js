import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack'
import debounce from 'lodash.debounce'
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';

import Comments from './comments'
import { log, isItMobile } from '../base'
import UserStore from '../../store/userStore';
import axiosInstance from '../axiosAuthApi';
import LoginForm from './loginForm'

const LikeCommentButton = (props) => {
    const [commentsPanelOpen, setCommentsPanelState] = useState(false);
    const [watchListButtonUnClickable, setWatchListButtonUnClickable] = useState(true)
    const [likeStatue, setLikeStatue] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)
    const [lifeline, setLifeline] = useState(false)
    const [lifelineTitle, setLifelineTitle] = useState(null)
    const [lifelineStatue, setLifelineStatue] = useState(null)
    const [lifelineMessage, setLifelineMessage] = useState(null)
    const [lifelinePrice, setLifelinePrice] = useState(null)
    const [lifelineType, setLifelineType] = useState(null)
    const [lifelineIcon, setLifelineIcon] = useState(null)
    
    const [userProfile, userActions] = UserStore()

    const itIsMobile = useRef()
    
    const { enqueueSnackbar } = useSnackbar()
           
    useEffect(() => {
        checkLikeStatue()
        itIsMobile.current = isItMobile()
    }, []);

    const checkLikeStatue = useCallback(
        debounce(
            async () => {
                const now = new Date().getTime()

                userProfile.userDetail &&
                await axiosInstance.get(`/api/likeView/?timestamp=${now}`)
                    .then(res => {
                        res = res.data.filter(like => like.quizV2_id?.id == props.quizId || like.test_id?.id == props.quizId)

                        if (res.length) {
                            setLikeStatue(true)
                        }
                    })
                    .catch(err => {
                        log(err)
                        log(err.response)
                    })
            }
        )
    )
    
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
                    quizV2_id: {
                        id: props.quizType == 'play' ? props.quizId : 0
                    }
                }

                await axiosInstance.post(`/api/likeView/?timestamp=${now}`, payload)
                    .then(res => {
                        if (res.status == 201) {
                            if (res.data?.id) {
                                setLikeStatue(true)
                                enqueueSnackbar('لایک شما ثبت شد!', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            } else {
                                setLikeStatue(false)
                                enqueueSnackbar('لایک شما حذف شد!', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            }
                        } else {
                            log(res)
                        }
                    })
                    .catch(err => {
                        if (err.response.status == 401) {
                            showLoginNotification('like_comment')
                        } else {
                            enqueueSnackbar('در اعمال لایک رخ داد. لطفا کمی دیگر تلاش کنید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            log(err.response)
                        }
                    })
                    setLikeLoading(false)
            }, 500
        )
    )

    const loginNotificationMessage = (action) => {
        if (action == 'like_comment') {
            return 'برای لایک و کامنت کردن لازمه که اول وارد کوییزلند بشی.'
        }
        else if (action == 'pay') {
            return 'ابتدا می‌بایست وارد شوید'
        }
    }

    const showLoginNotification = (action) => {
        enqueueSnackbar(
            <div className='mt-8'>
                <h5 className='mb-5'>
                    {loginNotificationMessage(action)}
                </h5>
                <div className='border-2 rounded-xl w-fit'>
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
            showLoginNotification('like_comment')
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

    const setupLifelineMessage = (type) => {
        setLifelineType(type)
        setLifelineStatue(true)

        switch (type) {
            case 'fiftyFifty':
                setLifelineIcon(<svg class="h-10 w-10 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>)
                setLifelineTitle('پنجاه پنجاه')
                setLifelineMessage('حذف کردن دو گزینه‌ی نادرست سوال')
                setLifelinePrice(30)
                break;

            case 'pollAudience':
                setLifelineIcon(<svg class="h-10 w-10 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>)
                setLifelineTitle('نظرسنجی کاربران')
                setLifelineMessage('نمایش درصد پاسخ دیگر کاربران')
                setLifelinePrice(40)
                break;

            case 'skipQuestion':
                setLifelineIcon(<svg class="h-10 w-10 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" /></svg>)
                setLifelineTitle('رد شدن از سوال')
                setLifelineMessage('این سوال جایگزاری میشود و به سوال بعدی میروید اما امتیازی دریافت نمی‌کنید')
                setLifelinePrice(20)
                break;
        }
        setLifeline(false)
    }

    const payWithQCoin = async () => {
        if (!userProfile.userDetail) {
            showLoginNotification('pay')
            return false
        }
        else if (userProfile.QCoins >= lifelinePrice) {
            const now = new Date().getTime()
            const userId = userProfile.userDetail.id
            const payload = {
                q_coins: userProfile.QCoins - lifelinePrice
            }
    
            await axiosInstance.patch(`/api/userView/${userId}/?timestamp=${now}`, payload)
                .then(res => {
                    userActions.updateQCoins(res.data.q_coins)
                })
                .catch(err => {
                    log(err)
                    log(err.response)
                })

            return true
        } else {
            enqueueSnackbar(<div>شما به اندازه کافی <img className="inline w-8 h-8" src="/static/img/QCoin.png" alt="" /> کیوکوین ندارید </div>, { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }}) 
            return false
        }
    }

    const lifeLineFunctionCall = async () => {
        if (await payWithQCoin()) {
            setLifelineStatue(false)

            switch (lifelineType) {
                case 'fiftyFifty':
                    props.removeHalfTheWrongOptions()
                    break

                case 'pollAudience':
                    props.pollAudience()
                    break
    
                case 'skipQuestion':
                    props.skipQuestion()
                    break
            }
        }
    }
    
    return (
        <React.Fragment>
            <div className='fixed z-10 flex justify-center w-screen md:bottom-6 bottom-14'>
                <div style={{'background': props.theme || '#991b1b'}} className={`flex shadow-[0_0_4px_white] px-4 py-2 space-x-5 rounded-2xl`}>
                    {/* comment button */}
                    <button onClick={() => setCommentsPanelState(true)}>
                        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.1" d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path></svg>
                    </button>
                    
                    <span className='h-6 my-auto border border-white'></span>

                    {/* Lifelines */}
                    {
                        props.quizType == 'play' &&
                        <React.Fragment>
                            <button onClick={() => setLifeline(lifeline ? false : true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                                    <line x1={12} y1={19} x2={12} y2="19.01"></line>
                                </svg>
                            </button>
        
                            <span className='h-6 my-auto border border-white'></span>
                        </React.Fragment>
                    }

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
                                <svg className="h-6 w-6 text-white"  fill={likeStatue ? '#00000070' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                            </button>
                        }
                </div>
            </div>

            <div className='flex justify-center w-screen'>
                <div style={{background: `linear-gradient(180deg, black, ${props.theme}`}} className={`${lifelineStatue ? 'pop_up opacity-100' : 'pop_down opacity-0'} rounded-lg shadow-[0_0_15px_black] w-[25rem] p-3 rounded-t-lg-800 fixed bottom-0 z-10`}>
                    <button style={{background: props.theme}} onClick={() => setLifelineStatue(false)} className='absolute top-2 right-2 rounded-full p-[0.1rem] z-20'>
                        <svg class="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <div className='relative top-[-3rem] space-y-3'>
                        <div style={{background: props.theme}} className='shadow-[0_0_10px_black] mx-auto mb-4 rounded-full p-3 w-16'>
                            {lifelineIcon}
                        </div>
                        
                        <h1 className='text-center'>استفاده از کمک کننده: {lifelineTitle}</h1>
                        <p className='text-center'>{lifelineMessage}</p>
                        <button className='flex mx-auto border border-white rounded w-full justify-center py-2'>ADDS</button>
                        <h3 className='text-center'>یا</h3>
                        <button className='flex mx-auto border border-white rounded w-full justify-center py-2 items-center' onClick={lifeLineFunctionCall}> کیو کوین <img className='inline mx-2 w-6 h-6' src="/static/img/QCoin.png" alt="" /> استفاده از {lifelinePrice}</button>
                    </div>
                </div>
            </div>

            <div className={`${lifeline ? 'pop_up opacity-100' : 'pop_down opacity-0'} fixed z-10 flex justify-center w-screen md:bottom-20 bottom-28`}>
                <div style={{'background': props.theme || '#991b1b'}} className={`flex shadow-[0_0_4px_white] px-4 py-2 space-x-5 rounded-2xl relative`}>
                    <button onClick={() => setupLifelineMessage('fiftyFifty')} id='50:50'>
                        50:50
                    </button>

                    <span className='h-6 my-auto border border-white'></span>

                    <button onClick={() => setupLifelineMessage('pollAudience')} id='pollAudience'>
                        <svg class="h-6 w-6 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </button>

                    <span className='h-6 my-auto border border-white'></span>

                    <button onClick={() => setupLifelineMessage('skipQuestion')} id='skipQuestion'>
                        <svg class="h-6 w-6 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" /></svg>
                    </button>

                    <div style={{'background': props.theme || '#991b1b'}} className={`${lifeline ? 'pop_up opacity-100' : 'pop_down opacity-0'} absolute top-[-2.5rem] px-3 py-1 left-10 md:left-[2.1rem] rounded`}>
                        <p className='text-[.8rem]'>کمک کننده ها</p>
                    </div>
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