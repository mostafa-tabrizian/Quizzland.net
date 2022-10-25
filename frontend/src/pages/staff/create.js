import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Helmet } from "react-helmet";
const debounce = require('lodash.debounce')
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { MuiColorInput } from 'mui-color-input'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

import { log } from '../../components/base'
import userStore from '../../store/userStore';
import axiosInstance from '../../components/axiosAuthApi';

const create = () => {
    const [tabsValue, setTabsValue] = useState(0);

    const [publicState, setPublic] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, selectCategory] = useState(null)
    const [subcategories, setSubcategories] = useState([])
    const [selectedSubcategory, selectSubcategory] = useState(null)
    const [questionBackgroundColor, setQuestionBackgroundColor] = useState('#ffffff')
    const [thumbnailURL, setThumbnailURL] = useState(null)
    const [backgroundURL, setBackgroundURL] = useState(null)
    const [GIF20URL, setGIF20URL] = useState(null)
    const [GIF40URL, setGIF40URL] = useState(null)
    const [GIF60URL, setGIF60URL] = useState(null)
    const [GIF80URL, setGIF80URL] = useState(null)
    const [GIF100URL, setGIF100URL] = useState(null)

    const [quizzes, setQuizzes] = useState([])
    const [selectedQuiz, selectQuiz] = useState(null) 
    const [questionImageURL, setQuestionImageURL] = useState(null)
    const [optionImage1stURL, setOptionImage1stURL] = useState(null)
    const [optionImage2ndURL, setOptionImage2ndURL] = useState(null)
    const [optionImage3rdURL, setOptionImage3rdURL] = useState(null)
    const [optionImage4thURL, setOptionImage4thURL] = useState(null)
    const [answerImageGIFURL, setAnswerImageGIFURL] = useState(null)

    const slugRef = useRef(null)
    const titleRef = useRef(null)
    const tagsRef = useRef(null)
    const fanNameRef = useRef(null)

    const questionRef = useRef(null)
    const option1stRef = useRef(null)
    const option2ndRef = useRef(null)
    const option3rdRef = useRef(null)
    const option4thRef = useRef(null)
    const answerRef = useRef(null)
    const answerTextRef = useRef(null)

    useEffect(() => {
        fetchCategories()
        fetchQuizzes()
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
        formData.append('subCategory', selectedSubcategory?.title)
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
            })
            .catch(err => {
                log('err: postQuestion')
                log(err)
                log(err.response)
            })
    }
    
    const handleTabsChange = (event, newValue) => {
      setTabsValue(newValue);
    };

    const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
          textTransform: 'none',
          fontWeight: theme.typography.fontWeightRegular,
          fontSize: theme.typography.pxToRem(15),
          marginRight: theme.spacing(1),
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': {
            color: '#aa4949',
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
          },
        }),
    );

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <h1>{children}</h1>
              </Box>
            )}
          </div>
        );
      }
      
      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function tabProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        userProfile.userDetail?.is_staff ?
            <div className='text-center mx-auto my-20 max-w-[40rem]'>
                <div>
                    <Tabs value={tabsValue} onChange={handleTabsChange}>
                        <StyledTab label="Create Quiz" {...tabProps(0)} />
                        <StyledTab label="Create Question" {...tabProps(1)} />
                    </Tabs>

                    <TabPanel value={tabsValue} index={0}>
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
                                disablePortal
                                id="categoryKey"
                                options={categories}
                                onChange={(e, value) => selectCategory(value)}
                                getOptionLabel={(option) => option.title_english}
                                renderInput={(params) => <TextField {...params} label="Category" />}
                            />

                            <Autocomplete
                                disablePortal
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
                                    className='my-5'
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
                                    className='my-5'
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
                                    className='my-5'
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
                                    className='my-5'
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
                                    className='my-5'
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
                                    className='my-5'
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
                                    className='my-5'
                                    src={URL.createObjectURL(GIF100URL)} alt=""
                                />
                            }
                        </div>

                        <button
                            className='border border-green-500 hover:text-black hover:bg-green-500 mt-10 py-3 px-5 w-full rounded'
                            onClick={postQuiz}
                        >
                            Post Quiz
                        </button>
                    </TabPanel>

                    <TabPanel value={tabsValue} index={1}>
                        <div className='flex flex-col space-y-3'>
                            <Autocomplete
                                disablePortal
                                id="quizKey"
                                options={quizzes}
                                onChange={(e, value) => selectQuiz(value)}
                                getOptionLabel={(option) => option.title}
                                renderInput={(params) => <TextField {...params} label="Question" />}
                            />
                            
                            <input type="text" placeholder='Question' ref={questionRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Question Image
                                <input
                                    hidden accept=".png, .jpg, .webp" type="file"
                                    onChange={e => setQuestionImageURL(e.target.files[0])}
                                />
                            </Button>

                            <input type="text" placeholder='Options 1st' ref={option1stRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                            <input type="text" placeholder='Options 2nd' ref={option2ndRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                            <input type="text" placeholder='Options 3nd' ref={option3rdRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                            <input type="text" placeholder='Options 4nd' ref={option4thRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Option Image 1st
                                <input
                                    hidden accept=".png, .jpg, .webp" type="file"
                                    onChange={e => setOptionImage1stURL(e.target.files[0])}
                                />
                            </Button>

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Option Image 2nd
                                <input
                                    hidden accept=".png, .jpg, .webp" type="file"
                                    onChange={e => setOptionImage2ndURL(e.target.files[0])}
                                />
                            </Button>

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Option Image 3rd
                                <input
                                    hidden accept=".png, .jpg, .webp" type="file"
                                    onChange={e => setOptionImage3rdURL(e.target.files[0])}
                                />
                            </Button>

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Option Image 4th
                                <input
                                    hidden accept=".png, .jpg, .webp" type="file"
                                    onChange={e => setOptionImage4thURL(e.target.files[0])}
                                />
                            </Button>

                            <input type="number" placeholder='Answer' ref={answerRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />

                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Answer Image/GIF
                                <input
                                    hidden accept=".png, .jpg, .webp" type="file"
                                    onChange={e => setAnswerImageGIFURL(e.target.files[0])}
                                />
                            </Button>

                            <input type="text" placeholder='Answer Text' ref={answerTextRef} className='pl-4 pr-12 py-1 border border-[#8C939D] rounded-full text-right bg-transparent text-[0.9rem] my-auto' />
                        </div>

                        <button
                            className='border border-green-500 hover:text-black hover:bg-green-500 mt-10 py-3 px-5 w-full rounded'
                            onClick={postQuestion}
                        >
                            Post Question
                        </button>
                    </TabPanel>
                </div>
            </div>
            :
            <h1>
                not staff. sorry!
            </h1>
    );
}

export default create;