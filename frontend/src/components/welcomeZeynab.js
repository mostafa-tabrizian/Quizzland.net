import React from 'react'

const zeynabPage = '/static/img/zeynabPage.webp'

const welcomePage = () => {
    document.body.style = `
        background: url('${zeynabPage}');
        background-position: center center;
        background-size: contain !important;
        background-attachment: fixed;
    `

    return (
        <React.Fragment>

            <div style={{marginBottom: '80rem'}}></div>

        </React.Fragment>
    );
}
 
export default welcomePage;