export async function getInitialProps() {
    const res = 'hello'
    return {
        props: {res}, // will be passed to the page component as props
    }
}