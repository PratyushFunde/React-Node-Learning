import React from 'react'
import Users from './Users'
import {Link} from "react-router-dom"
const Admin = () => {
  return (
    <section>
        <h1>Admin Page</h1>
        <br />
        <Users/>
        <br />
        <p>You must have been assigned an Admin role.</p>
        <div>
            <Link to="/"></Link>
        </div>
    </section>
  )
}

export default Admin