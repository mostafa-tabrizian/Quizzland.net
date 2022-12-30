import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { MuiColorInput } from 'mui-color-input'
import { useSnackbar } from 'notistack'

import { log } from '../../../../components/base';
import axiosInstance from '../../../../components/axiosAuthApi';
import UserStore from '../../../../store/userStore';

const CreateTest = () => {
    const [publicState, setPublic] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, selectCategory] = useState()
    const [subcategories, setSubcategories] = useState([])
    const [selectedSubcategory, selectSubcategory] = useState()
    const [questionBackgroundColor, setQuestionBackgroundColor] = useState('#ffffff')
    const [thumbnailURL, setThumbnailURL] = useState()
    const [backgroundURL, setBackgroundURL] = useState()

    const [resultImg1st, setResultImg1st] = useState()
    const [resultImg2nd, setResultImg2nd] = useState()
    const [resultImg3rd, setResultImg3rd] = useState()
    const [resultImg4th, setResultImg4th] = useState()
    const [resultImg5th, setResultImg5th] = useState()
    const [resultImg6th, setResultImg6th] = useState()
    const [resultImg7th, setResultImg7th] = useState()
    const [resultImg8th, setResultImg8th] = useState()
    const [resultImg9th, setResultImg9th] = useState()
    const [resultImg10th, setResultImg10th] = useState()

    const slugRef = useRef()
    const titleRef = useRef()
    const tagsRef = useRef()

    const resultUpTo1stRef = useRef()
    const resultUpTo2ndRef = useRef()
    const resultUpTo3rdRef = useRef()
    const resultUpTo4thRef = useRef()
    const resultUpTo5thRef = useRef()
    const resultUpTo6thRef = useRef()
    const resultUpTo7thRef = useRef()
    const resultUpTo8thRef = useRef()
    const resultUpTo9thRef = useRef()
    const resultUpTo10thRef = useRef()
    const resultTitle1stRef = useRef()
    const resultTitle2ndRef = useRef()
    const resultTitle3rdRef = useRef()
    const resultTitle4thRef = useRef()
    const resultTitle5thRef = useRef()
    const resultTitle6thRef = useRef()
    const resultTitle7thRef = useRef()
    const resultTitle8thRef = useRef()
    const resultTitle9thRef = useRef()
    const resultTitle10thRef = useRef()
    const resultText1stRef = useRef()
    const resultText2ndRef = useRef()
    const resultText3rdRef = useRef()
    const resultText4thRef = useRef()
    const resultText5thRef = useRef()
    const resultText6thRef = useRef()
    const resultText7thRef = useRef()
    const resultText8thRef = useRef()
    const resultText9thRef = useRef()
    const resultText10thRef = useRef()
    
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        fetchCategories()
    }, []);

    useEffect(() => {
        fetchSubcategories()
    }, [selectedCategory]);

    const [userProfile, userActions] = UserStore()

    const fetchCategories = async () => {
        await axiosInstance.get('/api/categoryView/')
            .then(res => {
                setCategories(res.data)
            })
            .catch(err => {
                log('err: fetchCategories')
                log(err)
                log(err.response)
            })
    }

    const fetchSubcategories = async () => {
        selectedCategory &&
            await axiosInstance.get(`/api/subcategoryView/?categoryKey=${selectedCategory?.id}`)
                .then(res => {
                    setSubcategories(res.data)
                })
                .catch(err => {
                    log('err: fetchSubcategories')
                    log(err)
                    log(err.response)
                })
    }

    const postQuiz = async () => {
        let formData = new FormData()

        formData.append('public', publicState)
        formData.append('categoryKey', selectedCategory?.id)
        formData.append('subCategory', selectedSubcategory?.subCategory)
        formData.append('slug', slugRef.current.value)
        formData.append('title', titleRef.current.value)
        formData.append('tags', tagsRef.current.value)

        formData.append('question_background', questionBackgroundColor)
        formData.append('thumbnail', thumbnailURL)
        formData.append('background', backgroundURL)

        formData.append('result_upTo_1st', resultUpTo1stRef.current.value)
        formData.append('result_upTo_2nd', resultUpTo2ndRef.current.value)
        formData.append('result_upTo_3rd', resultUpTo3rdRef.current.value)
        formData.append('result_upTo_4th', resultUpTo4thRef.current.value)
        formData.append('result_upTo_5th', resultUpTo5thRef.current.value)
        formData.append('result_upTo_6th', resultUpTo6thRef.current.value)
        formData.append('result_upTo_7th', resultUpTo7thRef.current.value)
        formData.append('result_upTo_8th', resultUpTo8thRef.current.value)
        formData.append('result_upTo_9th', resultUpTo9thRef.current.value)
        formData.append('result_upTo_10th', resultUpTo10thRef.current.value)

        formData.append('result_title_1st', resultTitle1stRef.current.value)
        formData.append('result_title_2nd', resultTitle2ndRef.current.value)
        formData.append('result_title_3rd', resultTitle3rdRef.current.value)
        formData.append('result_title_4th', resultTitle4thRef.current.value)
        formData.append('result_title_5th', resultTitle5thRef.current.value)
        formData.append('result_title_6th', resultTitle6thRef.current.value)
        formData.append('result_title_7th', resultTitle7thRef.current.value)
        formData.append('result_title_8th', resultTitle8thRef.current.value)
        formData.append('result_title_9th', resultTitle9thRef.current.value)
        formData.append('result_title_10th', resultTitle10thRef.current.value)

        formData.append('result_text_1st', resultText1stRef.current.value)
        formData.append('result_text_2nd', resultText2ndRef.current.value)
        formData.append('result_text_3rd', resultText3rdRef.current.value)
        formData.append('result_text_4th', resultText4thRef.current.value)
        formData.append('result_text_5th', resultText5thRef.current.value)
        formData.append('result_text_6th', resultText6thRef.current.value)
        formData.append('result_text_7th', resultText7thRef.current.value)
        formData.append('result_text_8th', resultText8thRef.current.value)
        formData.append('result_text_9th', resultText9thRef.current.value)
        formData.append('result_text_10th', resultText10thRef.current.value)

        formData.append('result_img_1st', resultImg1st)
        formData.append('result_img_2nd', resultImg2nd)
        formData.append('result_img_3rd', resultImg3rd)
        formData.append('result_img_4th', resultImg4th)
        formData.append('result_img_5th', resultImg5th)
        formData.append('result_img_6th', resultImg6th)
        formData.append('result_img_7th', resultImg7th)
        formData.append('result_img_8th', resultImg8th)
        formData.append('result_img_9th', resultImg9th)
        formData.append('result_img_10th', resultImg10th)

        await axiosInstance.post(`/api/testView/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(res => {
                if (res.status === 200) {
                    enqueueSnackbar('کوییز تست با موفقیت ایجاد شد.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                }
            })
            .catch(err => {
                enqueueSnackbar('در ایجاد کوییز تست خطایی رخ داد.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                log('err: postQuiz')
                log(err)
                log(err.response)
            })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Test Create</title>
                <meta name='robots' content='noindex' />
            </Helmet>
            
            {
                userProfile.userDetail?.is_staff ?
                <div className='text-center mx-auto my-20 max-w-[40rem]'>
                    <div className='flex flex-col space-y-3'>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={() => { setPublic(publicState ? false : true) }}
                                />
                            }
                            label="عمومی"
                        />

                        <Autocomplete
                            id="categoryKey"
                            options={categories}
                            onChange={(e, value) => selectCategory(value)}
                            getOptionLabel={(option) => option.title_english}
                            renderInput={(params) => <TextField {...params} label="کتگوری" />}
                        />

                        <Autocomplete
                            id="subcategoryKey"
                            options={subcategories}
                            onChange={(e, value) => selectSubcategory(value)}
                            getOptionLabel={(option) => option.subCategory}
                            renderInput={(params) => <TextField {...params} label="زیرکتگوری" />}
                        />

                        <input type="text" placeholder='عنوان' ref={titleRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='اسلاگ' ref={slugRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='تگ ها با فاصله ویرگول' ref={tagsRef} className='first-letter:pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Upload Thumbnail
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setThumbnailURL(e.target.files[0])}
                            />
                        </Button>

                        {
                            thumbnailURL &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(thumbnailURL)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Upload Background
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setBackgroundURL(e.target.files[0])}
                            />
                        </Button>

                        {
                            backgroundURL &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(backgroundURL)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <input type="number" placeholder='سقف نتیجه اول' ref={resultUpTo1stRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه دوم' ref={resultUpTo2ndRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه سوم' ref={resultUpTo3rdRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه چهارم' ref={resultUpTo4thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه پنجم' ref={resultUpTo5thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه ششم' ref={resultUpTo6thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه هفتم' ref={resultUpTo7thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه هشتم' ref={resultUpTo8thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه نهم' ref={resultUpTo9thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='سقف نتیجه دهم' ref={resultUpTo10thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                        <hr className='mx-auto' />

                        <input type="text" placeholder='عنوان سطح اول' ref={resultTitle1stRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح دوم' ref={resultTitle2ndRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح سوم' ref={resultTitle3rdRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح چهارم' ref={resultTitle4thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح پنجم' ref={resultTitle5thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح ششم' ref={resultTitle6thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح هفتم' ref={resultTitle7thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح هشتم' ref={resultTitle8thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح نهم' ref={resultTitle9thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='عنوان سطح دهم' ref={resultTitle10thRef} className='pl-4 pr-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                        <hr className='mx-auto' />

                        <textarea placeholder='نتیجه سطح اول' ref={resultText1stRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح دوم' ref={resultText2ndRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح سوم' ref={resultText3rdRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح چهارم' ref={resultText4thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح پنجم' ref={resultText5thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح ششم' ref={resultText6thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح هفتم' ref={resultText7thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح هشتم' ref={resultText8thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح نهم' ref={resultText9thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>
                        <textarea placeholder='نتیجه سطح دهم' ref={resultText10thRef} cols="30" rows="10" className='pl-4 pr-6 py-1 border border-[#8C939D] rounded text-right bg-transparent text-[0.9rem] my-auto pt-3'></textarea>

                        <MuiColorInput
                            value={questionBackgroundColor}
                            format="hex"
                            onChange={(e) => setQuestionBackgroundColor(e)}
                        />

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه اول
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg1st(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg1st &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg1st)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه دوم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg2nd(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg2nd &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg2nd)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه سوم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg3rd(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg3rd &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg3rd)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه چهارم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg4th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg4th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg4th)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه پنجم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg5th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg5th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg5th)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه ششم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg6th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg6th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg6th)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه هفتم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg7th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg7th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg7th)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه هشتم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg8th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg8th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg8th)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه نهم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg9th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg9th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg9th)} alt=""
                            />
                        }

                        <hr className='mx-auto' />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر نتیجه دهم
                            <input
                                hidden accept=".png, .jpg, .webp" type="file"
                                onChange={e => setResultImg10th(e.target.files[0])}
                            />
                        </Button>

                        {
                            resultImg10th &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(resultImg10th)} alt=""
                            />
                        }
                    </div>

                    <button
                        className='w-full px-5 py-3 mt-10 border border-green-500 rounded hover:text-black hover:bg-green-500'
                        onClick={postQuiz}
                    >
                        ایجاد تست
                    </button>
                </div>
                :
                <h1>
                    not staff. sorry!
                </h1>
            }
        </React.Fragment>
            
    );
}

export default CreateTest;