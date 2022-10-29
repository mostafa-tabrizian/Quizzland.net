import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { BigHead } from "@bigheads/core";
import { useSnackbar } from 'notistack'
import CircularProgress from '@mui/material/CircularProgress';

import axios from '../axiosApi';
import axiosInstance from '../axiosAuthApi';
import { log, getTheme, datePublishHandler } from '../base'
import ExplicitWords from './explicitWords';
import UserStore from '../../store/userStore';
import CommentsMenu from './commentsMenu';

const Comments = (props) => {
    const [comments, setComments] = useState([])
    const [theme, setTheme] = useState('dark')
    const [commentBeingPosted, setCommentBeingPostedStatue] = useState(false)

    const commentTextRef = useRef()
    
    const [userProfile, userActions] = UserStore()
    
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        const theme = getTheme()
        setTheme(theme)
        fetchComments()
    }, []);

    const checkIfCommentValid = (comment) => {
        const commentLength = comment.trim().length
        if (commentLength == 0) {
            enqueueSnackbar('شما هیچ کامنتی ننوشته‌اید!', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        } else if (commentLength < 2) {
            enqueueSnackbar('کامنت شما کافی نمی‌باشد!', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        } else if (255 <= commentLength) {
            enqueueSnackbar('کامنت شما بیش از حد مجاز بلند است!', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        } else {
            return true
        }
    }

    const postClicked = async () => {
        const comment = commentTextRef.current.value
        let verifyState = true

        if (!checkIfCommentValid(comment)) { return }  // not valid

        if (ExplicitWords(comment)) { verifyState = false }
        
        setCommentBeingPostedStatue(true)
        await debouncePostComment(comment, verifyState)
    }

    const debouncePostComment = useCallback(
        debounce(
            async (comment, verifyState) => {
                await axiosInstance.post('/api/commentView/', {
                    comment_text: comment,
                    trivia_id: props.quizType == 'quiz' ? props.quizId : null,
                    test_id: props.quizType == 'test' ? props.quizId : null,
                    verified: verifyState,
                    submitter_id: {
                        username: userProfile.userDetail.id
                    }
                })
                    .then(res => {
                        if (res.status == 201) {
                            verifyState == true ?
                            enqueueSnackbar('کامنت با موفقیت ثبت شد.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                            :
                            enqueueSnackbar('کامنت شما مشکوک به داشتن کلمات نامناسب است. پس از تایید توسط ادمین، کامنت شما نمایش داده می‌شود.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                        }
                    })
                    .catch(err => {
                        if (err.response.status == 401) {
                            enqueueSnackbar('شما میبایست ابتدا وارد شوید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                        } else if (err.response.status == 500) {
                            enqueueSnackbar('استفاده از ایموجی در حال حاضر امکان پذیر نمی باشد', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                        } else {
                            log(err.response)
                        }
                    })

                setCommentBeingPostedStatue(false)
            }, 500
        )
    )

    const sortCommentsByNewest = (a, b) => {
        return new Date(b.date_submitted) - new Date(a.date_submitted)
    }

    const fetchComments = async () => {
        const now = new Date().getTime()
        
        await axios.get(`/api/commentView/?verified=true&${props.quizType == 'quiz' ? `trivia_id=${props.quizId}&` : ''}${props.quizType == 'test' ? `test_id=${props.quizId}&` : ''}timestamp=${now}`)
            .then(res => {
                setComments(res.data.sort(sortCommentsByNewest))
            })
            .catch(err => {
                log(err.response)
            })
    }

    const returnComments = () => {
        return (
            comments.length == 0 ?
            <div>
                <h4 className={`text-center ${theme == 'light' ? 'text-[#060101]' : 'text-[#ffeaeb]'}`}>فعلا هیچ کامنتی نیست!</h4>
            </div>
            :
            comments?.map(comment => {
                return (
                    <div>
                        <div>
                            <div className='flex justify-between'>
                                {
                                    comment.submitter_id ?
                                    <Link to={`/profile/${comment.submitter_id?.username}`}>
                                        <div className='flex space-x-3 space-x-reverse'>
                                            <div className='w-12 h-12'>
                                                {
                                                    comment.submitter_id?.avatar &&
                                                    <BigHead {...JSON.parse(comment.submitter_id.avatar)} />
                                                }
                                            </div>
                                            <div>
                                                <div className={`flex space-x-2 space-x-reverse ${theme == 'light' ? 'text-[#060101]' : 'text-[#ffeaeb]'}`}>
                                                    <h4>{comment.submitter_id?.first_name}</h4>
                                                    <h4>{comment.submitter_id?.last_name}</h4>
                                                </div>
                                                <h4 className='text-gray-500'>{datePublishHandler(comment.date_submitted)}</h4>
                                            </div>
                                        </div>
                                    </Link>
                                    :
                                    <div>
                                        <div className='flex space-x-3 space-x-reverse'>
                                            <div className='w-8 h-8 bg-red-800 rounded-full'>
                                            </div>
                                            <div>
                                                <h4>کاربر حذف شده</h4>
                                                <h4 className='text-gray-500'>{datePublishHandler(comment.date_submitted)}</h4>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <CommentsMenu comment={comment}/>

                            </div>

                            <pre>
                                <p className='mt-5 break-words'>
                                        {comment.comment_text}
                                </p>
                            </pre>
                        </div>
                        
                        <hr className='md:ml-auto md:mr-0'/>
                    </div>
                )
            })
        )
    }

    const checkIfUserLoggedIn = () => {
        if (!(userProfile.userDetail.id)) {
            props.setCommentsPanelState(false)
            props.showLoginNotification()
        }
    }
    
    return (
        <div>
            <h3 className='flex items-center justify-center my-3 quiz__tags__title beforeAfterDecor'>کامنت ها</h3>
            <div>
                <div className='relative'>
                    <textarea name="text" rows="3" ref={commentTextRef} onClick={checkIfUserLoggedIn} className={`px-4 py-2 w-full ${theme == 'light' ? 'bg-[#ffeaeb] text-black' : 'bg-[#161616] text-white'} placeholder:text-gray-300 border-b-[#ac272e]`} type="text" placeholder='کامنت خود را اینجا بنویسید...'></textarea>
                    {
                        commentBeingPosted ?
                        <div className='absolute left-12 bottom-4'>
                            <CircularProgress
                                color="error"
                                size={30}
                                thickness={7} 
                            />
                        </div>
                        :
                        <button className={`absolute flex px-4 mb-3 space-x-1 ${theme == 'light' ? 'bg-[#ffeaeb] text-black' : 'bg-[#161616] text-white'} bottom-2 left-4`} onClick={() => postClicked()}>
                            <svg class="h-6 w-6 text-[#ac272e]"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="10" y1="14" x2="21" y2="3" />  <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" /></svg>
                            <span>ارسال</span>
                        </button>
                    }
                </div>
            </div>
            <div className='p-4'>
                {returnComments()}
            </div>
        </div>
    );
}
 
export default Comments;