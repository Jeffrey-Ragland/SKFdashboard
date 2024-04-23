import "./index.css";
import Login from "./routes/Login";
import {Route,Routes,Navigate} from 'react-router-dom'
import DashMain from "./routes/DashMain";
import DashGraph from "./routes/DashGraph";
import DashReports from "./routes/DashReports";
import DashSettings from "./routes/DashSettings";
import DashAdmin from "./routes/DashAdmin";
import SkfAdmin from "./routes/SkfAdmin";
import DisplayMain from "./routes/DisplayMain";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import DisplayGraph from "./routes/DisplayGraph";
import DisplayReport from "./routes/DisplayReport";
import DisplayRoutePage from "./routes/DisplayRoutePage";
import DisplaySettings from "./routes/DisplaySettings";


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
          <Route path="displayMain" element={<DisplayMain />} />
          <Route path="displayGraph" element={<DisplayGraph />} />
          <Route path="displayReport" element={<DisplayReport />} />
          <Route path="displayRoutePage" element={<DisplayRoutePage />} />
          <Route path="displaySettings" element={<DisplaySettings />} />
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
