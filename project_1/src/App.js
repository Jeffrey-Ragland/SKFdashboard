import "./index.css";
//import SignUp from "./routes/SignUp";
import Login from "./routes/Login";
import {Route,Routes,Navigate} from 'react-router-dom'
import DashMain from "./routes/DashMain";
import DashGraph from "./routes/DashGraph";
import DashReports from "./routes/DashReports";
import DashSettings from "./routes/DashSettings";
import DashAdmin from "./routes/DashAdmin";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ChildRoutes from "./routes/ChildRoutes";


function App() {
  return (
    <div>
    
      <Routes>
        {/* protected routes */}
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/" element={<ChildRoutes/>}>
              <Route path="/" element={<Navigate replace to="dashmain" />} />
              <Route path="dashmain" element={<DashMain />}/>
              <Route path="dashgraph" element={<DashGraph />} />
              <Route path="dashreports" element={<DashReports />} />
              <Route path="dashsettings" element={<DashSettings />} />
              <Route path="dashadmin" element={<DashAdmin />} />
            </Route>
          </Route>

        {/* public routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
  
      </Routes>
    
    </div>
  );
}

export default App;









// function App() 
// {

//   return (
//     <Routes>
//       <Route path='/' element={<Login/>}/>
//       <Route path='/signup' element={<SignUp/>}/>
//       <Route path="/dashmain" element={<DashMain/>}/>
//       <Route path="/dashgraph" element={<DashGraph/>}/>
//       <Route path="/dashreports" element={<DashReports/>}/>
//       <Route path="/dashsettings" element={<DashSettings/>}/>

//     </Routes>
  
//   );
// }
