import React from 'react';
import ReactDOM from 'react-dom';

import pageNotFound_404 from './components/pageNotFound_404.js'
import HotFooter from './components/hotFooter'

const CategoryApp = () => {
    return (
        <React.Fragment>

            <pageNotFound_404 />
            <HotFooter />

        </React.Fragment>
    );
}

export default CategoryApp;

ReactDOM.render(
    <CategoryApp />,
    document.getElementById('404Root')
);
