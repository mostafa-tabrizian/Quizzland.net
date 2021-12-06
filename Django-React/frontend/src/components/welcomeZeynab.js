import React from 'react'
import { Helmet } from "react-helmet";

const zeynabPage = '../images/zeynabPage.webp'

const welcomePage = () => {
    document.body.style = `
        background: url('${zeynabPage}');
        background-position: center center;
        background-size: contain !important;
        background-attachment: fixed;
    `

    return (
        <React.Fragment>

            <Helmet>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div style={{marginBottom: '80rem'}}></div>

        </React.Fragment>
    );
}
 
export default welcomePage;