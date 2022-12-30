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

const CreateTrivia = () => {
    const [publicState, setPublic] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, selectCategory] = useState()
    const [theme, setTheme] = useState('#ffffff')
    const [fees, setFees] = useState()
    const [thumbnailURL, setThumbnailURL] = useState()
    const [GIF_awful, setGIF_awful] = useState()
    const [GIF_bad, setGIF_bad] = useState()
    const [GIF_ok, setGIF_ok] = useState()
    const [GIF_good, setGIF_good] = useState()
    const [GIF_great, setGIF_great] = useState()

    const slugRef = useRef()
    const titleRef = useRef()
    const tagsRef = useRef()
    const feesRef = useRef()
    
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
        fetchCategories()
    }, []);
    
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

    const postTrivia = async () => {
        let formData = new FormData()

        formData.append('public', publicState)
        formData.append('categoryKey', selectedCategory?.id)
        formData.append('slug', slugRef.current.value)
        formData.append('title', titleRef.current.value)
        formData.append('theme', theme)
        formData.append('fees', feesRef.current.value)
        formData.append('tags', tagsRef.current.value)
        formData.append('theme', theme)
        formData.append('thumbnail', thumbnailURL)
        formData.append('GIF_awful', GIF_awful)
        formData.append('GIF_bad', GIF_bad)
        formData.append('GIF_ok', GIF_ok)
        formData.append('GIF_good', GIF_good)
        formData.append('GIF_great', GIF_great)

        await axiosInstance.post(`/api/quizV2View/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(res => {
                if (res.status === 200) {
                    enqueueSnackbar('کوییز تریویا با موفقیت ایجاد شد.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                }
            })
            .catch(err => {
                enqueueSnackbar('در ایجاد کوییز تریویا خطایی رخ داد.', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                log('err: postTrivia')
                log(err)
                log(err.response)
            })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Trivia Create</title>
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

                        <input type="text" placeholder='عنوان' ref={titleRef} className='px-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='اسلاگ' ref={slugRef} className='px-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="text" placeholder='تگ ها با فاصله ویرگول' ref={tagsRef} className='px-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        <input type="number" placeholder='قیمت ورودی' ref={feesRef} className='px-6 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                        <MuiColorInput
                            value={theme}
                            format="hex"
                            onChange={(e) => setTheme(e)}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            تصویر ثامبنیل
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
                            گیف افتضاح
                            <input
                                hidden accept=".gif" type="file"
                                onChange={e => setGIF_awful(e.target.files[0])}
                            />
                        </Button>

                        {
                            GIF_awful &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(GIF_awful)} alt=""
                            />
                        }

                        <hr className='mx-auto'/>

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            گیف بد
                            <input
                                hidden accept=".gif" type="file"
                                onChange={e => setGIF_bad(e.target.files[0])}
                            />
                        </Button>

                        {
                            GIF_bad &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(GIF_bad)} alt=""
                            />
                        }

                        <hr className='mx-auto'/>

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            گیف اوکی
                            <input
                                hidden accept=".gif" type="file"
                                onChange={e => setGIF_ok(e.target.files[0])}
                            />
                        </Button>

                        {
                            GIF_ok &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(GIF_ok)} alt=""
                            />
                        }

                        <hr className='mx-auto'/>

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            گیف خوب
                            <input
                                hidden accept=".gif" type="file"
                                onChange={e => setGIF_good(e.target.files[0])}
                            />
                        </Button>

                        {
                            GIF_good &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(GIF_good)} alt=""
                            />
                        }

                        <hr className='mx-auto'/>

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            گیف عالی
                            <input
                                hidden accept=".gif" type="file"
                                onChange={e => setGIF_great(e.target.files[0])}
                            />
                        </Button>

                        {
                            GIF_great &&
                            <img
                                className='my-5 h-[20rem] w-fit mx-auto'
                                src={URL.createObjectURL(GIF_great)} alt=""
                            />
                        }
                    </div>

                    <button
                        className='w-full px-5 py-3 mt-10 border border-green-500 rounded hover:text-black hover:bg-green-500'
                        onClick={postTrivia}
                    >
                        دخیره تریویا
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

export default CreateTrivia;