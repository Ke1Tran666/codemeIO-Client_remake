import { Route, Routes } from "react-router-dom"
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
            <Route path="/reset-password" element={<ClientResetPassword />} />
            <Route path="/profile" element={<ClientUserProfile />} />
            <Route path="/learningProfile" element={<ClientLearningProfile />} />
            <Route path="/course/:courseId" element={<ClientProduct />} />
            <Route path="/course/:courseId/lessons" element={<ClientCourseInterface />} />
          </Route>
          <Route path="/admin" element={<ClientAdmin />}>

          </Route>
        </Routes>
      </NotificationProvider>
    </>
  )
}

export default App