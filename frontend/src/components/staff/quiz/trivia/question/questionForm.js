import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack'
import UserStore from '../../../../../store/userStore';

import { log } from '../../../../base'
import axiosInstance from '../../../../axiosAuthApi';

const TriviaQuestionForm = (props) => {
    const { enqueueSnackbar } = useSnackbar()

    const [quizzes, setQuizzes] = useState([])
    const [selectedQuiz, selectQuiz] = useState() 
    const [questionImageURL, setQuestionImageURL] = useState()
    const [optionImage1stURL, setOptionImage1stURL] = useState()
    const [optionImage2ndURL, setOptionImage2ndURL] = useState()
    const [optionImage3rdURL, setOptionImage3rdURL] = useState()
    const [optionImage4thURL, setOptionImage4thURL] = useState()
    const [answerImageGIFURL, setAnswerImageGIFURL] = useState()

    const questionRef = useRef()
    const option1stRef = useRef()
    const option2ndRef = useRef()
    const option3rdRef = useRef()
    const option4thRef = useRef()
    const answerRef = useRef()
    const answerTextRef = useRef()

    const [userProfile, userActions] = UserStore()

    useEffect(() => {
        fetchQuizzes()
        document.querySelector('#questionBackground').style = `background: black`
    }, [])

    const fetchQuizzes = async () => {
        const now = new Date().getTime()
        
        await axiosInstance.get(`/api/quizV2View/?timestamp=${now}`)
            .then(res => {
                setQuizzes(res.data.reverse())
            })
            .catch(err => {
                log('err: fetchQuizzes')
                log(err)
                log(err.response)
            })
    }

    const removeWhiteSpace = (value) => {
        if (value) {
            return String(value).replace(/\s/g, "")
        }
    }

    const validCheckQuestionAnswer = () => {
        const answerCorrectRange = 0 <= answerRef.current.value <= 4
        const quizSelected = selectedQuiz?.id !== undefined
        // const questionFilled = removeWhiteSpace(questionRef.current.innerText) !== undefined

        if (answerCorrectRange && quizSelected) {
            return true
        } else {
            enqueueSnackbar('برخی از ورودی ها نامعتبر هستند.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            return false
        }
    }

    const resetInputs = () => {
        questionRef.current.innerText = null
        setQuestionImageURL(null)

        setOptionImage1stURL(null)
        setOptionImage2ndURL(null)
        setOptionImage3rdURL(null)
        setOptionImage4thURL(null)
        option1stRef.current.value = null
        option2ndRef.current.value = null
        option3rdRef.current.value = null
        option4thRef.current.value = null

        answerRef.current.value = null
        answerTextRef.current.value = null
        setAnswerImageGIFURL(null)
    }

    const postQuestion = async () => {
        document.getElementById('quizKey').scrollIntoView()

        if (validCheckQuestionAnswer()) {
            let questionFormData = new FormData()

            questionFormData.append('quizKey', selectedQuiz?.id)
            questionFormData.append('submitter_id', userProfile.userDetail.id)
            questionFormData.append('question', questionRef.current.innerText)
            questionFormData.append('question_img', questionImageURL)
            questionFormData.append('option_1st', option1stRef.current.value)
            questionFormData.append('option_2nd', option2ndRef.current.value)
            questionFormData.append('option_3rd', option3rdRef.current.value)
            questionFormData.append('option_4th', option4thRef.current.value)
            questionFormData.append('option_img_1st', optionImage1stURL)
            questionFormData.append('option_img_2nd', optionImage2ndURL)
            questionFormData.append('option_img_3rd', optionImage3rdURL)
            questionFormData.append('option_img_4th', optionImage4thURL)
    
            await axiosInstance.post(`/api/questionsV2View/`, questionFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(res => {
                    if (res.status == 200) {
                        enqueueSnackbar('سوال با موفقیت ثبت گردید.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                        postAnswer(res.data)
                    } else {
                        log(res)
                        enqueueSnackbar('در ثبت سوال خطایی رخ داد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                    }
                })
                .catch(err => {
                    enqueueSnackbar('در ثبت سوال خطایی رخ داد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                    log('err: postQuestion')
                    log(err)
                    log(err.response)
                })
        } else {

        }
    }

    const deleteTheQuestion = async (questionId) => {
        await axiosInstance.delete(`/api/questionsV2View/${questionId}/`)
            .then(res => {
                enqueueSnackbar('به دلیل خطا در ارسال پاسخ، سوال حذف گردید.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            })
            .catch(err => {
                if (res.status !== 404) {
                    enqueueSnackbar('به دلیل خطا در ارسال پاسخ، در تلاش حذف سوال همچنین خطایی رخ داد!.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                }
                log(err)
                log(err.response)
            })
    }

    const postAnswer = async (questionId) => {        
        let answerFormData = new FormData()

        answerFormData.append('questionKey', questionId)
        answerFormData.append('answer', answerRef.current.value)
        answerFormData.append('answer_imGif', answerImageGIFURL)
        answerFormData.append('answer_text', answerTextRef.current.value)
        
        await axiosInstance.post('/api/answerV2View/', answerFormData)
            .then(res => {
                if (res.status == 200) {
                    enqueueSnackbar('جواب با موفقیت ثبت گردید.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                    resetInputs()
                } else {
                    enqueueSnackbar('در ثبت جواب خطایی رخ داد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                    deleteTheQuestion(questionId)
                    log(res)
                    log(res.response)
                }
            })
            .catch(err => {
                enqueueSnackbar('در ثبت جواب خطایی رخ داد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                deleteTheQuestion(questionId)
                log('err: postAnswer')
                log(err)
                log(err.response)
            })
        

    }

    const quizKeyChanged = (e, value) => {
        selectQuiz(value)
        document.querySelectorAll('#questionBackground').forEach((q) => q.style = `background: ${value.theme}`)
    }

    const createTriviaQuestionForm = () => {
        return (
            <div className='text-center mx-auto my-20 max-w-[40rem]'>
                <div className='relative flex flex-col space-y-3'>
                    <Autocomplete
                        id="quizKey"
                        options={quizzes}
                        onChange={(e, value) => quizKeyChanged(e, value)}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="عنوان کوییز" />}
                    />

                    <div className={`my-3 mx-auto w-[22rem] md:w-[29rem]`} >
                        <div
                            contenteditable='true'
                            id='questionBackground'
                            ref={questionRef} className='p-3 text-[2rem] w-full quiz_question mix-blend-hard-light text-center backdrop-blur-2xl h-[17rem] py-1 rounded-xl flex overflow-auto items-center justify-center'
                        />
                    </div>

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر سوال
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setQuestionImageURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        questionImageURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(questionImageURL)} alt=""
                        />
                    }

                    <input type="text" placeholder='گزینه اول' ref={option1stRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه دوم' ref={option2ndRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه سوم' ref={option3rdRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه چهارم' ref={option4thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه اول
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage1stURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage1stURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage1stURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه دوم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage2ndURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage2ndURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage2ndURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه سوم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage3rdURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage3rdURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage3rdURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه چهارم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage4thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage4thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage4thURL)} alt=""
                        />
                    }

                    <input type="number" max={4} placeholder='گزینه پاسخ صحیح' ref={answerRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        عکس/گیف پاسخ
                        <input
                            hidden accept=".png, .jpg, .webp, .gif" type="file"
                            onChange={e => setAnswerImageGIFURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        answerImageGIFURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(answerImageGIFURL)} alt=""
                        />
                    }

                    <textarea rows={3} placeholder='توضیحات پاسخ' ref={answerTextRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-lg text-right bg-transparent text-[0.9rem] my-auto' />
                </div>

                <button
                    className='w-full px-5 py-3 mt-10 border border-green-500 rounded hover:text-black hover:bg-green-500'
                    onClick={postQuestion}
                >
                    ذخیره سوال
                </button>

                <hr className='w-full mx-auto border-green-500' />
            </div>
        )
    }

    return (
        createTriviaQuestionForm()
    )
}
 
export default TriviaQuestionForm;