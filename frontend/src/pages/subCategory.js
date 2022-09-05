import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
import { Helmet } from "react-helmet";
import debounce from 'lodash.debounce'

import AddView from '../components/addView';
import Tools from '../components/tools'
import PageTravel from '../components/pageTravel'
import { log, replaceFunction, takeParameterFromUrl, sortByNewest, sortByMonthlyViews, sortByViews } from '../components/base'
import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import skeletonQuiz from '../components/skeletonQuiz';

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
        applyBackground_AddView()
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

    const fetchContent = useCallback(
        debounce(
            async () => {
                const quiz = await axios.get(`/api/quizView/?subCategory__iexact=${replaceFunction(subCategory, "-", " ")}&limit=${countResult}&offset=${offset_content}&public=true`);
                const pointy = await axios.get(`/api/testView/?subCategory__iexact=${replaceFunction(subCategory, "-", " ")}&limit=${countResult}&offset=${offset_content}&public=true`);
                const content = quiz.data.results.concat(pointy.data.results).sort(sortByMonthlyViews);
        
                if (content.count !== 0) {
                    set_content(content)
                    set_PageTravel(content)
                } else {
                    set_hide_content(true)
                }
        
                setContentLoaded(true)
            }
        )
    )

    const applyBackground_AddView = async () => {
        const quizBg = document.querySelector('#quizBg')
        quizBg &&
        await axios.get(`/api/subcategoryView/?subCategory__iexact=${replaceFunction(subCategory, '-', ' ')}&public=true`)
        .then((categoryData) => {
            AddView('subcategory', categoryData.data[0].id)
            const background = categoryData.data[0].background
            quizBg.style = `background-image: url('${background}'); background-size: cover; background-position: center; filter: blur(3px) brightness(0.5)`
        })
        
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Helmet>
                <title>{`کوییز های ${persianSubCategoryWithoutSign} | کوییزلند`}</title>
                <meta name="description" content={`کوییزلند - کوییز های ${persianSubCategoryWithoutSign} `} />
                <meta name="keywords" content={`بهترین کوییز های ${persianSubCategoryWithoutSign} , کوییز های ${persianSubCategoryWithoutSign}`} />
            </Helmet>

            <div id='quizBg'></div>

            <div className="mx-4 md:w-4/5 md:m-auto" >
                {/* <div className='adverts adverts__left'>
                    Banner
                </div> */}

                <h3 className='lowTitle' style={{ color: 'white' }}>{replaceFunction(props.match.params.subCategory, '-', ' ')}</h3>
                <h3 className='title' style={{ color: 'white' }}>{persianSubCategoryWithoutSign}</h3>

                <Tools
                    sortType={sortType} setSortType={setSortType}
                />

                {skeletonQuiz(contentLoaded)}

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

        </React.Fragment>
    );
}

export default SubCategory;