import React from 'react'

const owlPage = '/static/img/owl-page.png'
const zeynabPage = '/static/img/zeynabPage.webp'

const welcomePage = () => {
    const target = document.location.pathname.split('/')[2]
    switch (target) {

        case 'owl':
            if (document.body) {
                document.body.style = `
                    background: url('${owlPage}');
                    background-position: center center;
                    background-size: contain !important;
                    background-attachment: fixed;
                `
            }
            break

        case 'zeynab':
            if (document.body) {
                document.body.style = `
                    background: url('${zeynabPage}');
                    background-position: center center;
                    background-size: contain !important;
                    background-attachment: fixed;
                `
            }
            break

        default:
            break
    }

    return (
        <React.Fragment>

            <div style={{marginBottom: '80rem'}}></div>

        </React.Fragment>
    );
}
 
export default welcomePage;