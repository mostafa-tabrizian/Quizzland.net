import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { message, Spin } from 'antd';
import debounce from 'lodash.debounce'

import axiosInstance from '../axiosApi';
import userProfileDetail from './userProfileDetail';
import { log, getTheme, replaceFunction, datePublishHandler } from '../base'
import ExplicitWords from './explicitWords';

const Comments = (props) => {
    const [comments, setComments] = useState([]) 
    const [userProfile, setUserProfile] = useState(null)
    const [theme, setTheme] = useState('dark')

    const commentTextRef = useRef()

    useEffect(async () => {
        const theme = getTheme()
        setTheme(theme)
        
        fetchComments()
        setUserProfile(await userProfileDetail())
    }, []);

    const checkIfCommentValid = (comment) => {
        return comment.trim().length !== 0 && comment.length < 255 ? true : false
    }

    const postClicked = async () => {
        const comment = commentTextRef.current.value
        let verifyState = true
        
        if (!checkIfCommentValid(comment)) {
            comment.trim().length == 0 ?
                message.error('شما هیچ کامنتی ننوشته‌اید!')
                :
                message.error('کامنت شما بیش از حد مجاز بلند است!')
            return  // not valid
        }

        if (ExplicitWords(comment)) {
            log('THIS COMMENT IS SUS!!!!!')
            verifyState = false
        }
        
        await debouncePostComment(comment, verifyState)
    }

    const debouncePostComment = useCallback(
        debounce(
            async (comment, verifyState) => {
                message.loading("در حال ثبت کامنت ...", 1)
                await axiosInstance.post('/api/commentView/', {
                    comment_text: comment,
                    quiz_related: props.quizType == 'quiz' ? props.quizId : null,
                    test_related: props.quizType == 'test' ? props.quizId : null,
                    verified: verifyState,
                    submitter_related: {
                        username: userProfile.id
                    }
                })
                    .then(res => {
                        if (res.status == 201) {
                            verifyState == true ?
                            message.success('کامنت با موفقیت ثبت شد.')
                            :
                            message.warning('کامنت شما مشکوک به داشتن کلمات نامناسب است. پس از تایید توسط ادمین، کامنت شما نمایش داده می‌شود.', 7)
                        }
                    })
                    .catch(err => {
                        log(err.response)
                    })
            }
        , 1000), []
    )

    const sortCommentsByNewest = (a, b) => {
        return new Date(b.date_submitted) - new Date(a.date_submitted)
    }

    const fetchComments = async () => {
        const now = new Date().getTime()
        
        await axiosInstance.get(`/api/commentView/?verified=true&${props.quizType == 'quiz' ? `quiz_related=${props.quizId}&` : ''}${props.quizType == 'test' ? `test_related=${props.quizId}&` : ''}timestamp=${now}`)
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
                <h4 className='text-center text-black'>فعلا هیچ کامنتی نیست!</h4>
            </div>
            :
            comments?.map(comment => {
                return (
                    <div>
                        <div>
                            <Link to={`/profile/${comment.submitter_related?.username}`}>
                                <div className='flex space-x-3 space-x-reverse'>
                                    {
                                        comment.submitter_related?.avatar ?
                                        <img src={comment.submitter_related?.avatar} alt={comment.submitter_related?.username} />
                                        :
                                        <svg class="h-10 w-10 text-[#ac272e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

                                    }
                                    <div>
                                        <div className='flex space-x-2 space-x-reverse text-black'>
                                            <h4>{comment.submitter_related?.first_name}</h4>
                                            <h4>{comment.submitter_related?.last_name}</h4>
                                        </div>
                                        <h4 className='text-gray-500'>{datePublishHandler(comment.date_submitted)}</h4>
                                    </div>
                                </div>
                            </Link>
                            <p className='mt-5 break-words'>{comment.comment_text}</p>
                        </div>
                        
                        <hr className='md:ml-auto md:mr-0'/>
                    </div>
                )
            })
        )
    }

    const checkIfUserLoggedIn = () => {
        if (!(userProfile)) {
            props.setCommentsPanelState(false)
            props.setShowLoginForm(true)
        }
    }
    
    return (
        <div>
            {/* <h3 className='flex items-center justify-center quiz__tags__title beforeAfterDecor'>کامنت ها</h3> */}
            <div>
                <div className='relative my-10'>
                    <textarea name="text" rows="3" ref={commentTextRef} onClick={checkIfUserLoggedIn} className='px-4 py-2 w-full text-white placeholder:text-gray-300 border-b-[#ac272e]' type="text" placeholder='.کامنت تان را اینجا بنویسید'></textarea>
                    <button className={`absolute flex px-4 space-x-1 ${theme == 'dark' ? 'bg-[#060101]' : 'bg-[#ffeaeb]'} bottom-2 left-4`} onClick={() => postClicked()}>
                        <svg class="h-6 w-6 text-[#ac272e]"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="10" y1="14" x2="21" y2="3" />  <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" /></svg>
                        <span>ارسال</span>
                    </button>
                </div>
            </div>
            <div className='p-4'>
                {returnComments()}
            </div>
        </div>
    );
}
 
export default Comments;