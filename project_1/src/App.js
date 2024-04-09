import "./index.css";
import Login from "./routes/Login";
import {Route,Routes,Navigate} from 'react-router-dom'
import DashMain from "./routes/DashMain";
import DashGraph from "./routes/DashGraph";
import DashReports from "./routes/DashReports";
import DashSettings from "./routes/DashSettings";
import DashAdmin from "./routes/DashAdmin";
import SkfAdmin from "./routes/SkfAdmin";
import ProtectedRoutes from "./routes/ProtectedRoutes";


function App() {

  return (
    <div>
      <Routes>
        {/* protected routes */}
        <Route path="/" element={<ProtectedRoutes/>}>
          <Route path="/" element={<Navigate replace to="dashmain" />} />
          <Route path="dashmain" element={<DashMain />}/>
          <Route path="dashgraph" element={<DashGraph />} />
          <Route path="dashreports" element={<DashReports />} />
          <Route path="dashsettings" element={<DashSettings />} />
          <Route path="/" element={<ProtectedRoutes roleRequired='admin'/>}>
            <Route path="dashadmin" element={<DashAdmin />} />
            <Route path="skfadmin" element={<SkfAdmin />} />
          </Route>
        </Route>

        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    </div>
  );
}

export default App;
