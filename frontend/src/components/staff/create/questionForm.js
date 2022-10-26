import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

import { log } from '../../../components/base'
import axiosInstance from '../../../components/axiosAuthApi';

const QuestionForm = (props) => {
    const [postStatue, setPostStatue] = useState(null)

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

    useEffect(() => {
        fetchQuizzes()
    }, [])

    const fetchQuizzes = async () => {
        await axiosInstance.get('/api/quizView/')
            .then(res => {
                setQuizzes(res.data.reverse())
            })
            .catch(err => {
                log('err: fetchCategories')
                // log(err)
                // log(err.response)
            })
    }

    const postQuestion = async () => {
        let formData = new FormData()

        formData.append('quizKey', selectedQuiz?.id)
        formData.append('question', questionRef.current.value)
        formData.append('question_img', questionImageURL)
        formData.append('option_1st', option1stRef.current.value)
        formData.append('option_2nd', option2ndRef.current.value)
        formData.append('option_3rd', option3rdRef.current.value)
        formData.append('option_4th', option4thRef.current.value)
        formData.append('option_img_1st', optionImage1stURL)
        formData.append('option_img_2nd', optionImage2ndURL)
        formData.append('option_img_3rd', optionImage3rdURL)
        formData.append('option_img_4th', optionImage4thURL)
        formData.append('answer', answerRef.current.value)
        formData.append('answer_imGif', answerImageGIFURL)
        formData.append('answer_text', answerTextRef.current.value)

        await axiosInstance.post(`/api/questionsView/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(res => {
                log(res)

                if (res.status == 200) {
                    setPostStatue(true)
                } else {
                    log('res but else...')
                    setPostStatue(false)
                }
            })
            .catch(err => {
                setPostStatue(false)
                log('err: postQuestion')
                log(err)
                log(err.response)
            })
    }

    const createQuestionForm = () => {
        return (
            <div className='text-center mx-auto my-20 max-w-[40rem]'>
                <div className='flex flex-col space-y-3 relative'>
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
                        onChange={(e, value) => selectQuiz(value)}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="عنوان کوییز" />}
                    />
                    
                    <input type="text" placeholder='سوال' ref={questionRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

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
                            className='my-5'
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
                            className='my-5'
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
                            className='my-5'
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
                            className='my-5'
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
                            className='my-5'
                            src={URL.createObjectURL(optionImage4thURL)} alt=""
                        />
                    }

                    <input type="number" placeholder='گزینه پاسخ صحیح' ref={answerRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

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
                            className='my-5'
                            src={URL.createObjectURL(answerImageGIFURL)} alt=""
                        />
                    }

                    <input type="text" placeholder='توضیحات پاسخ' ref={answerTextRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                </div>

                <button
                    className='border border-green-500 hover:text-black hover:bg-green-500 mt-10 py-3 px-5 w-full rounded'
                    onClick={postQuestion}
                >
                    ذخیره سوال
                </button>

                <hr className='mx-auto border-green-500 w-full' />
            </div>
        )
    }

    return (
        createQuestionForm()
    )
}
 
export default QuestionForm;