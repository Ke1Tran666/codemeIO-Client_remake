import { Navigate, Route, Routes } from "react-router-dom"
import Client from "./pages/Client"

import './assets/css/output.css'
import './assets/css/App.css'
import ClientSignUp from "./pages/Client/Auth/ClientSignUp/ClientSignUp"
import ClientSignIn from "./pages/Client/Auth/ClientSignIn/ClientSignIn"
import ClientProduct from "./pages/Client/ClientProduct/ClientProduct"
import ClientHome from "./pages/Client/ClientHome/ClientHome"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"
import { NotificationProvider } from "./components/Notification/NotificationContext"
import ClientResetPassword from "./pages/Client/Auth/ClientSignIn/ClientResetPassword"
import ClientUserProfile from "./pages/Client/User/ClientUserProfile/ClientUserProfile"
import ClientCourseInterface from "./pages/Client/ClientCourseInterface/ClientCourseInterface"
import ClientLearningProfile from "./pages/Client/User/ClientLearningProfile/ClientLearningProfile"
import ClientAdmin from "./pages/ClientAdmin"
import ClientCategory from "./pages/Client/Admin/ClientCategory/ClientCategory"
import ClientOverview from "./pages/Client/Admin/ClientOverview/ClientOverview"
import ClientCourses from "./pages/Client/Admin/ClientCourses/ClientCourses"
import ClientRoles from "./pages/Client/Admin/ClientRoles/ClientRoles"
import ClientUsers from "./pages/Client/Admin/ClientUsers/ClientUsers"
import ClientLessons from "./pages/Client/Admin/ClientLessons/ClientLessons"
import ClientUserRoles from "./pages/Client/Admin/ClientUsers/ClientUserRoles"
import NotFound from "./pages/Client/NotFound/NotFound"
import ClientShopping from "./pages/Client/ClientShopping/ClientShopping"

const App = () => {
  return (
    <>
      <ScrollToTop />
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Client />}>
            <Route index element={<ClientHome />} />
            <Route path="/signup" element={<ClientSignUp />} />
            <Route path="/signin" element={<ClientSignIn />} />
            <Route path="/shopping" element={<ClientShopping />} />
            <Route path="/reset-password" element={<ClientResetPassword />} />
            <Route path="/profile" element={<ClientUserProfile />} />
            <Route path="/learningProfile" element={<ClientLearningProfile />} />
            <Route path="/course/:courseId" element={<ClientProduct />} />
            <Route path="/course/:courseId/lessons" element={<ClientCourseInterface />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<ClientAdmin />}>
            <Route index element={<Navigate replace to="/admin/overview" />} />
            <Route path="/admin/overview" element={<ClientOverview />} />
            <Route path="/admin/category" element={<ClientCategory />} />
            <Route path="/admin/courses" element={<ClientCourses />} />
            <Route path="/admin/lessons" element={<ClientLessons />} />
            <Route path="/admin/roles" element={<ClientRoles />} />
            <Route path="/admin/roles/:roleName" element={<ClientUserRoles />} />
            <Route path="/admin/users" element={<ClientUsers />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </>
  )
}

export default App