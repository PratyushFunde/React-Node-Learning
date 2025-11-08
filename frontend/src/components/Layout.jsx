import { Link, Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <main className="App">
            <nav className="p-4 bg-gray-200">
                <Link className="ml-5 mr-5" to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
            </nav>
            <Outlet />
        </main>
    )
}

export default Layout