import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Tools from './tools'
import PageTravel from './pageTravel'
import HotHeader from './hotHeader'
import LoadingScreen from './loadingScreen'

import { log, replaceFunction, viewsFormat, datePublishHandler } from './base'

const Category = (props) => {
    const [pageTravel, setPageTravel] = useState([])
    const [categories, setCategories] = useState([])
    const [categoryTarget, setCategoryTarget] = useState(props.match.params.category)
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [sortType, setSortType] = useState('newest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const categoryDefinitionInFarsi = {
        'celebrity': 'سلبریتی',
        'movie-series': 'فیلم و سریال'
    }
    const currentCategory = categoryDefinitionInFarsi[categoryTarget]

    useEffect(() => {
        searchChangeDetector()
    })

    useEffect(() => {
        getCategories()
    }, [categoryTarget])

    const searchChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
                setCategoryTarget(window.location.pathname.split('/')[2]);
            };


        })(window.history);
    }

    const getCategories = async () => {
        const sortTypeDefinitionForDb = {
            'newest': 'new_category',
            'bestest': 'best_category',
            'alphabet': 'alphabet_category'
        }

        const pageTravelAndCategories = await axios.get(`/dbQuizzland$M19931506/${sortTypeDefinitionForDb[sortType]}/?category__icontains=${categoryTarget}&limit=${numberOfResult}&offset=${offset}`)
        setPageTravel(pageTravelAndCategories.data)
        setCategories(pageTravelAndCategories.data.results)
        setContentLoaded(true)
    }

    const listCategories = () => {
        return (
            categories.map((category) => {
                return (
                    <li key={category.id}>
                        <article className={`flex tx-al-r quizContainer__trans`}>
                            <a href={`/category/${category.category}/${replaceFunction(category.subCategory, ' ', '-')}?t=${replaceFunction(category.title, ' ', '-')}`}  >
                                <div>
                                    <img src={`${category.thumbnail}`} alt={`${category.subCategory}} | ${category.title}`} loading='lazy' />
                                </div>
                                {/* <div className="quizContainer__views">{viewsFormat(category.views)}</div> */}
                                {/* <div className="quizContainer__date tx-al-c">{datePublishHandler(category.publish)}</div> */}
                                <span className="quizContainer__title quizContainer__title__noViews flex">
                                    { category.title }
                                </span>
                            </a>
                        </article>
                    </li>
                )
            })
        )
    }

    useEffect(() => {
        getCategories()
    }, [sortType, numberOfResult, offset])

    useEffect(() => {

        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
        setLoadState(true)
    }, [])

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <HotHeader
                title={`کوییزلند | ${currentCategory} کوییز های `}
                description={`کوییزلند ${currentCategory} کوییز های`}
                keywords={`${currentCategory} بهترین کوییز های , ${currentCategory} کوییز های`}
            />

            <div className='adverts adverts__left'>
                <div id="pos-article-display-28434"></div>
            </div>
            
            <h3 className='lowTitle'>{categoryTarget}</h3>
            <h3 className='title'>کتگوری {categoryDefinitionInFarsi[categoryTarget]}</h3>

            <Tools
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                sortType={sortType} setSortType={setSortType}
            />

            <ul className={`quizContainer flex flex-jc-fe flex-ai-c wrapper-med ${contentLoaded && 'noVis'}`}>

                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                <li className='skeletonLoading skeletonLoading__quizContainer'></li>

            </ul>

            <ul className="quizContainer flex flex-ai-c wrapper-med">
                
                {listCategories()}

            </ul>

            <PageTravel
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
            />

        </React.Fragment>
    );
}
 
export default Category;