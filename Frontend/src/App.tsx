import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';
// import Calendar from './pages/Calendar';
// import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/Overall';
// import FormElements from './pages/Form/FormElements';
// import FormLayout from './pages/Form/FormLayout';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Tables from './pages/Tables';
// import Alerts from './pages/UiElements/Alerts';
// import Buttons from './pages/UiElements/Buttons';
import PerticularBranch from './pages/Dashboard/PerticularBranch';
import BranchList from './pages/Branches/List';
import UserList from './pages/Users/List';
import RolesList from './pages/Roles/List';
import DepartmentList from './pages/Department/List';
import NewBranch from './pages/Branches/NewBranch';
import NewUser from './pages/Users/NewUser';
import NewRole from './pages/Roles/NewRole';
import NewDepartment from './pages/Department/NewDepartment';
import FileSystem from './pages/FileSystem/MenuBar/FileSystem';
import ShowFolder from './pages/Show Folder/ShowFolder';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | Overall" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/dashboard/perticularBranch"
          element={
            <>
              <PageTitle title="Dashboard | Perticular Branch" />
              <PerticularBranch />
            </>
          }
        />
        <Route
          path="/files/:projectId"
          element={
            <>
              <PageTitle title="Dashboard | Perticular Branch" />
              <ShowFolder />
            </>
          }
        />
        <Route
          path="/files"
          element={
            <>
              <PageTitle title="Files" />
              <FileSystem />
            </>
          }
        />
        <Route
          path="/branches/list"
          element={
            <>
              <PageTitle title="Branches List" />
              <BranchList />
            </>
          }
        />
        <Route
          path="/branches/createNew"
          element={
            <>
              <PageTitle title="Create Branch" />
              <NewBranch />
            </>
          }
        />
        <Route
          path="/branches/edit/:id"
          element={
            <>
              <PageTitle title="Edit Branch" />
              <NewBranch />
            </>
          }
        />
        <Route
          path="/users/list"
          element={
            <>
              <PageTitle title="Users List" />
              <UserList />
            </>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <>
              <PageTitle title="Edit User" />
              <NewUser />
            </>
          }
        />
        <Route
          path="/users/createNew"
          element={
            <>
              <PageTitle title="Create User" />
              <NewUser />
            </>
          }
        />
        <Route
          path="/roles/list"
          element={
            <>
              <PageTitle title="Roles List" />
              <RolesList />
            </>
          }
        />
        <Route
          path="/roles/createNew"
          element={
            <>
              <PageTitle title="Create role" />
              <NewRole />
            </>
          }
        />
        <Route
          path="/roles/edit/:id"
          element={
            <>
              <PageTitle title="Edit Role" />
              <NewRole />
            </>
          }
        />
        <Route
          path="/departments/list"
          element={
            <>
              <PageTitle title="Department List" />
              <DepartmentList />
            </>
          }
        />
        <Route
          path="/departments/createNew"
          element={
            <>
              <PageTitle title="Create Department" />
              <NewDepartment />
            </>
          }
        />
        <Route
          path="/departments/edit/:id"
          element={
            <>
              <PageTitle title="Edit Role" />
              <NewDepartment />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup" />
              <SignUp />
            </>
          }
        />
        {/* <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile" />
              <Profile />
            </>
          }
        /> */}
        {/* <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons" />
              <Buttons />
            </>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;
