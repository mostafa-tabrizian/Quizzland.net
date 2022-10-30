import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack'

import { log } from '../../../../base'
import axiosInstance from '../../../../axiosAuthApi';

const TestQuestionForm = (props) => {
    const [postStatue, setPostStatue] = useState(null)
    const { enqueueSnackbar } = useSnackbar()

    const [quizzes, setQuizzes] = useState([])
    const [selectedQuiz, selectQuiz] = useState() 
    const [questionImageURL, setQuestionImageURL] = useState()

    const [optionImage1stURL, setOptionImage1stURL] = useState()
    const [optionImage2ndURL, setOptionImage2ndURL] = useState()
    const [optionImage3rdURL, setOptionImage3rdURL] = useState()
    const [optionImage4thURL, setOptionImage4thURL] = useState()
    const [optionImage5thURL, setOptionImage5thURL] = useState()
    const [optionImage6thURL, setOptionImage6thURL] = useState()
    const [optionImage7thURL, setOptionImage7thURL] = useState()
    const [optionImage8thURL, setOptionImage8thURL] = useState()
    const [optionImage9thURL, setOptionImage9thURL] = useState()
    const [optionImage10thURL, setOptionImage10thURL] = useState()

    const questionRef = useRef()

    const option1stRef = useRef()
    const option2ndRef = useRef()
    const option3rdRef = useRef()
    const option4thRef = useRef()
    const option5thRef = useRef()
    const option6thRef = useRef()
    const option7thRef = useRef()
    const option8thRef = useRef()
    const option9thRef = useRef()
    const option10thRef = useRef()
    
    const optionPoint1stRef = useRef()
    const optionPoint2ndRef = useRef()
    const optionPoint3rdRef = useRef()
    const optionPoint4thRef = useRef()
    const optionPoint5thRef = useRef()
    const optionPoint6thRef = useRef()
    const optionPoint7thRef = useRef()
    const optionPoint8thRef = useRef()
    const optionPoint9thRef = useRef()
    const optionPoint10thRef = useRef()

    useEffect(() => {
        fetchQuizzes()
        document.querySelector('#questionBackground').style = `background: black`
    }, [])

    const fetchQuizzes = async () => {
        const now = new Date().getTime()
        
        await axiosInstance.get(`/api/testView/?timestamp=${now}`)
            .then(res => {
                setQuizzes(res.data.reverse())
            })
            .catch(err => {
                log('err: fetchQuizzes')
                // log(err)
                // log(err.response)
            })
    }

    const postQuestion = async () => {
        let formData = new FormData()

        formData.append('quizKey', selectedQuiz?.id)
        formData.append('question', questionRef.current.innerText)
        formData.append('question_img', questionImageURL)

        formData.append('option_1st', option1stRef.current.value)
        formData.append('option_2nd', option2ndRef.current.value)
        formData.append('option_3rd', option3rdRef.current.value)
        formData.append('option_4th', option4thRef.current.value)
        formData.append('option_5th', option5thRef.current.value)
        formData.append('option_6th', option6thRef.current.value)
        formData.append('option_7th', option7thRef.current.value)
        formData.append('option_8th', option8thRef.current.value)
        formData.append('option_9th', option9thRef.current.value)
        formData.append('option_10th', option10thRef.current.value)

        formData.append('option_img_1st', optionImage1stURL)
        formData.append('option_img_2nd', optionImage2ndURL)
        formData.append('option_img_3rd', optionImage3rdURL)
        formData.append('option_img_4th', optionImage4thURL)
        formData.append('option_img_5th', optionImage5thURL)
        formData.append('option_img_6th', optionImage6thURL)
        formData.append('option_img_7th', optionImage7thURL)
        formData.append('option_img_8th', optionImage8thURL)
        formData.append('option_img_9th', optionImage9thURL)
        formData.append('option_img_10th', optionImage10thURL)

        formData.append('option_point_1st', optionPoint1stRef.current.value)
        formData.append('option_point_2nd', optionPoint2ndRef.current.value)
        formData.append('option_point_3rd', optionPoint3rdRef.current.value)
        formData.append('option_point_4th', optionPoint4thRef.current.value)
        formData.append('option_point_5th', optionPoint5thRef.current.value)
        formData.append('option_point_6th', optionPoint6thRef.current.value)
        formData.append('option_point_7th', optionPoint7thRef.current.value)
        formData.append('option_point_8th', optionPoint8thRef.current.value)
        formData.append('option_point_9th', optionPoint9thRef.current.value)
        formData.append('option_point_10th', optionPoint10thRef.current.value)

        await axiosInstance.post(`/api/questionsPointyView/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(res => {
                if (res.status == 200) {
                    setPostStatue(true)
                    enqueueSnackbar('سوال با موفقیت ثبت گردید.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                } else {
                    setPostStatue(false)
                    log(res)
                    enqueueSnackbar('در ثبت سوال خطایی رخ داد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                }
            })
            .catch(err => {
                enqueueSnackbar('در ثبت سوال خطایی رخ داد.', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                setPostStatue(false)
                log('err: postQuestion')
                log(err)
                log(err.response)
            })
    }

    const quizKeyChanged = (e, value) => {
        selectQuiz(value)
        document.querySelectorAll('#questionBackground').forEach((q) => q.style = `background: ${value.question_background}`)
    }

    const createTestQuestionForm = () => {
        return (
            <div className='text-center mx-auto my-20 max-w-[40rem]'>
                <div className='relative flex flex-col space-y-3'>
                    {
                        postStatue !== null &&
                        <div className='absolute right-[-4rem] top-[1rem] text-[2rem]'>
                            {
                                postStatue ?
                                "✅"
                                :
                                "⛔"
                            }
                        </div>
                    }

                    <h2>
                        سوال {props.id + 1}
                    </h2>

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
                    <input type="text" placeholder='گزینه پنجم' ref={option5thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه ششم' ref={option6thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه هفتم' ref={option7thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه هشتم' ref={option8thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه نهم' ref={option9thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='گزینه دهم' ref={option10thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                    <input type="number" placeholder='امتیاز گزینه اول' ref={optionPoint1stRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه دوم' ref={optionPoint2ndRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه سوم' ref={optionPoint3rdRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه چهارم' ref={optionPoint4thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه پنجم' ref={optionPoint5thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه ششم' ref={optionPoint6thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه هفتم' ref={optionPoint7thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه هشتم' ref={optionPoint8thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه نهم' ref={optionPoint9thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="number" placeholder='امتیاز گزینه دهم' ref={optionPoint10thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

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

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه پنجم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage5thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage5thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage5thURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه ششم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage6thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage6thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage6thURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه هفتم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage7thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage7thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage7thURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه هشتم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage8thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage8thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage8thURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه نهم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage9thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage9thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage9thURL)} alt=""
                        />
                    }

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        تصویر گزینه دهم
                        <input
                            hidden accept=".png, .jpg, .webp" type="file"
                            onChange={e => setOptionImage10thURL(e.target.files[0])}
                        />
                    </Button>

                    {
                        optionImage10thURL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(optionImage10thURL)} alt=""
                        />
                    }
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
        createTestQuestionForm()
    )
}
 
export default TestQuestionForm;