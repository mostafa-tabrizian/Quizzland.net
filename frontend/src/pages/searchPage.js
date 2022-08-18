import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom'

import { log, takeParameterFromUrl, replaceFunction, getTheme } from '../components/base'
import skeletonQuiz from '../components/skeletonQuiz';
import Search from '../components/search/search'

const SearchMoreResult = () => {
    const [contentLoaded, setContentLoaded] = useState(false)
    const [searchValue, setSearchValue] = useState()

    const location = useLocation();

    useEffect(() => {
        const query = takeParameterFromUrl('q')
        setSearchValue(query)
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
    }, [location]);

    const searchValueWithOutSign = searchValue && replaceFunction(searchValue, '+', ' ')

    return (
        <React.Fragment>

            <Helmet>
                <title>{`جستجو | کوییزلند`}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                <meta name="robots" content="noindex, follow"></meta>
            </Helmet>

            <div className='w-[85%] mx-auto'>

                {/* <div className='adverts adverts__left'>
                    <div id='mediaad-DLgb'></div>
                    <div id="pos-article-display-26094"></div>
                </div> */}

                <h3 className='title'>{searchValueWithOutSign}</h3>

                {skeletonQuiz(contentLoaded)}

                <Search value={searchValue} setContentLoaded={setContentLoaded} contentLength={200}/>

                {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}

            </div>

        </React.Fragment>
    );
}

export default SearchMoreResult;