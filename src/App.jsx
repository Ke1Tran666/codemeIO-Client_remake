import { Route, Routes } from "react-router-dom"
import Client from "./pages/Client"

import './assets/css/output.css'
import './assets/css/App.css'
import ClientSignUp from "./pages/Client/ClientSignUp/ClientSignUp"
import ClientSignIn from "./pages/Client/ClientSignIn/ClientSignIn"
import ClientProduct from "./pages/Client/ClientProduct/ClientProduct"
import ClientHome from "./pages/Client/ClientHome/ClientHome"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"
import { NotificationProvider } from "./components/Notification/NotificationContext"

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
            <Route path="/product" element={<ClientProduct />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </>
  )
}

export default App