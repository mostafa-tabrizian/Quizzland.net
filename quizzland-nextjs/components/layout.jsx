import Meta from './meta'
import Header from './header'

const Layout = ({ children }) => {
    return (
        <>
            <Meta />
            <Header />

            <div>
                layout component
            </div>

            <h1>Footer</h1>
        </>
    );
}
 
export default Layout;