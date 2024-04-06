import React from 'react'
import { Outlet} from 'react-router-dom'

const ChildRoutes = () => 
{
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default ChildRoutes