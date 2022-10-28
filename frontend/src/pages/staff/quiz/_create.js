import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { MuiColorInput } from 'mui-color-input'

import { log } from '../../../components/base'
import userStore from '../../../store/userStore';
import axiosInstance from '../../../components/axiosAuthApi';

const CreateQuiz = () => {
    const [publicState, setPublic] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, selectCategory] = useState()
    const [subcategories, setSubcategories] = useState([])
    const [selectedSubcategory, selectSubcategory] = useState()
    const [questionBackgroundColor, setQuestionBackgroundColor] = useState('#ffffff')
    const [thumbnailURL, setThumbnailURL] = useState()
    const [backgroundURL, setBackgroundURL] = useState()
    const [GIF20URL, setGIF20URL] = useState()
    const [GIF40URL, setGIF40URL] = useState()
    const [GIF60URL, setGIF60URL] = useState()
    const [GIF80URL, setGIF80URL] = useState()
    const [GIF100URL, setGIF100URL] = useState()

    const slugRef = useRef()
    const titleRef = useRef()
    const tagsRef = useRef()
    const fanNameRef = useRef()

    useEffect(() => {
        fetchCategories()
    }, []);
    
    useEffect(() => {
        fetchSubcategories()
    }, [selectedCategory]);
    
    const [userProfile, userActions] = userStore()
    
    const fetchCategories = async () => {
        await axiosInstance.get('/api/categoryView/')
            .then(res => {
                setCategories(res.data)
            })
            .catch(err => {
                log('err: fetchCategories')
                // log(err)
                // log(err.response)
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
                // log(err)
                // log(err.response)
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
        formData.append('fan_name', fanNameRef.current.value)
        formData.append('question_background', questionBackgroundColor)
        formData.append('thumbnail', thumbnailURL)
        formData.append('background', backgroundURL)
        formData.append('GIF20', GIF20URL)
        formData.append('GIF40', GIF40URL)
        formData.append('GIF60', GIF60URL)
        formData.append('GIF80', GIF80URL)
        formData.append('GIF100', GIF100URL)

        await axiosInstance.post(`/api/quizView/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(res => {
                log(res)
            })
            .catch(err => {
                log('err: postQuiz')
                log(err)
                log(err.response)
            })
    }

    return (
        userProfile.userDetail?.is_staff ?
            <div className='text-center mx-auto my-20 max-w-[40rem]'>
                <div className='flex flex-col space-y-3'>
                    <FormControlLabel
                        control={
                            <Switch
                                onChange={() => { setPublic(publicState ? false : true) }}
                            />
                        }
                        label="Public"
                    />

                    <Autocomplete
                        id="categoryKey"
                        options={categories}
                        onChange={(e, value) => selectCategory(value)}
                        getOptionLabel={(option) => option.title_english}
                        renderInput={(params) => <TextField {...params} label="Category" />}
                    />

                    <Autocomplete
                        id="subcategoryKey"
                        options={subcategories}
                        onChange={(e, value) => selectSubcategory(value)}
                        getOptionLabel={(option) => option.subCategory}
                        renderInput={(params) => <TextField {...params} label="Subcategory" />}
                    />

                    <input type="text" placeholder='Slug' ref={slugRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='Title' ref={titleRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='Tags' ref={tagsRef} className='first-letter:pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                    <input type="text" placeholder='Fan name' ref={fanNameRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                    <MuiColorInput
                        value={questionBackgroundColor}
                        format="hex"
                        onChange={(e) => setQuestionBackgroundColor(e)}
                    />

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

                    <hr className='mx-auto'/>

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

                    <hr className='mx-auto'/>

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        GIF 20
                        <input
                            hidden accept=".gif" type="file"
                            onChange={e => setGIF20URL(e.target.files[0])}
                        />
                    </Button>

                    {
                        GIF20URL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(GIF20URL)} alt=""
                        />
                    }

                    <hr className='mx-auto'/>

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        GIF 40
                        <input
                            hidden accept=".gif" type="file"
                            onChange={e => setGIF40URL(e.target.files[0])}
                        />
                    </Button>

                    {
                        GIF40URL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(GIF40URL)} alt=""
                        />
                    }

                    <hr className='mx-auto'/>

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        GIF 60
                        <input
                            hidden accept=".gif" type="file"
                            onChange={e => setGIF60URL(e.target.files[0])}
                        />
                    </Button>

                    {
                        GIF60URL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(GIF60URL)} alt=""
                        />
                    }

                    <hr className='mx-auto'/>

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        GIF 80
                        <input
                            hidden accept=".gif" type="file"
                            onChange={e => setGIF80URL(e.target.files[0])}
                        />
                    </Button>

                    {
                        GIF80URL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(GIF80URL)} alt=""
                        />
                    }

                    <hr className='mx-auto'/>

                    <Button
                        variant="outlined"
                        component="label"
                    >
                        GIF 100
                        <input
                            hidden accept=".gif" type="file"
                            onChange={e => setGIF100URL(e.target.files[0])}
                        />
                    </Button>

                    {
                        GIF100URL &&
                        <img
                            className='my-5 h-[20rem] w-fit mx-auto'
                            src={URL.createObjectURL(GIF100URL)} alt=""
                        />
                    }
                </div>

                <button
                    className='w-full px-5 py-3 mt-10 border border-green-500 rounded hover:text-black hover:bg-green-500'
                    onClick={postQuiz}
                >
                    Post Quiz
                </button>
            </div>
            :
            <h1>
                not staff. sorry!
            </h1>
    );
}

export default CreateQuiz;