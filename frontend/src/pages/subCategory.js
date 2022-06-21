import React, { useState, useEffect } from 'react';


import axiosInstance from '../components/axiosApi';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import AddView from '../components/addView';

import Tools from '../components/tools'
import PageTravel from '../components/pageTravel'
import { log, replaceFunction, takeParameterFromUrl, sortByNewest, sortByMonthlyViews, sortByViews } from '../components/base'
import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import SkeletonLoading from '../components/skeletonLoading';

const SubCategory = (props) => {

    const [pageTravel, set_PageTravel] = useState([])
    const [content, set_content] = useState([])
    const [hide_content, set_hide_content] = useState(false)
    const [countResult, setCountResult] = useState(16)
    const [currentPageNumberQuiz, setCurrentPageNumberQuiz] = useState(1)
    const [offset_content, setOffset_content] = useState(0)
    const [sortType, setSortType] = useState('trend')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const subCategory = props.match.params.subCategory
    const persianSubCategory = takeParameterFromUrl('sc')
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()

    useEffect(() => {
        if (persianSubCategory) {
            fetchContent()
        }
    }, [persianSubCategory, countResult, offset_content])

    useEffect(() => {
        sortContent()
    }, [sortType])

    useEffect(() => {
        backgroundOfSubCategory()
        setLoadState(true)
    }, [persianSubCategory])

    const persianSubCategoryWithoutSign = replaceFunction(persianSubCategory, '-', ' ')

    const sortContent = () => {
        switch (sortType) {
            case 'newest':
                whenChangeThisIDKWhyTheSortAffect('sort1')
                set_content(content.sort(sortByNewest))
                break
            case 'views':
                whenChangeThisIDKWhyTheSortAffect('sort2')
                set_content(content.sort(sortByViews))
                break
            case 'trend':
                whenChangeThisIDKWhyTheSortAffect('sort3')
                set_content(content.sort(sortByMonthlyViews))
                break
        }
    }

    const fetchContent = async () => {
        const quiz = await axiosInstance.get(`/api/quiz/?subCategory__icontains=${replaceFunction(subCategory, "-", " ")}&limit=${countResult}&offset=${offset_content}&public=true`);
        const pointy = await axiosInstance.get(`/api/test/?subCategory__icontains=${replaceFunction(subCategory, "-", " ")}&limit=${countResult}&offset=${offset_content}&public=true`);
        const content = quiz.data.results.concat(pointy.data.results).sort(sortByMonthlyViews);

        if (content.count !== 0) {
            set_content(content)
            set_PageTravel(content)
        } else {
            set_hide_content(true)
        }

        setContentLoaded(true)
    }

    const backgroundOfSubCategory = async () => {
        await axiosInstance.get(`/api/subcategory/?subCategory__icontains=${replaceFunction(subCategory, '-', ' ')}&public=true`)
            .then((categoryData) => {
                AddView('subcategory', categoryData.data[0].id)
                const background = categoryData.data[0].background
                document.getElementById('html').style = `
                    background: url('${background}') center/cover fixed no-repeat !important;
                `
            })
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>{`کوییز های ${persianSubCategoryWithoutSign} | کوییزلند`}</title>
                <meta name="description" content={`کوییزلند - کوییز های ${persianSubCategoryWithoutSign} `} />
                <meta name="keywords" content={`بهترین کوییز های ${persianSubCategoryWithoutSign} , کوییز های ${persianSubCategoryWithoutSign}`} />
            </Helmet>

            <div className="md:w-4/5 mx-4 md:m-auto" >
                {/* <div className='adverts adverts__left'>
                    Banner
                </div> */}

                <h3 className='lowTitle' style={{ color: 'white' }}>{replaceFunction(props.match.params.subCategory, '-', ' ')}</h3>
                <h3 className='title' style={{ color: 'white' }}>{persianSubCategoryWithoutSign}</h3>

                <Tools
                    sortType={sortType} setSortType={setSortType}
                />

                {SkeletonLoading(contentLoaded)}

                {
                    hide_content
                        ?
                        <div>
                            <h1>کتگوری نیست </h1>
                        </div>
                        :
                        <div>
                            <ul className={`flex flex-wrap`}>
                                <QuizContainer quizzes={content} bgStyle='bg' />
                            </ul>

                            <PageTravel
                                pageTravel={pageTravel} set_PageTravel={set_PageTravel}
                                countResult={countResult} setCountResult={setCountResult}
                                offset={offset_content} setOffset={setOffset_content}
                                currentPageNumber={currentPageNumberQuiz} setCurrentPageNumber={setCurrentPageNumberQuiz}
                            />
                        </div>
                }

            </div>

            <Footer />

        </React.Fragment>
    );
}

export default SubCategory;