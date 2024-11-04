import { Route, Routes } from "react-router-dom"
import Client from "./pages/Client"

import './assets/css/output.css'
import './assets/css/App.css'
import ClientSignUp from "./components/Clients/ClientSignUp/ClientSignUp"
import ClientSignIn from "./components/Clients/ClientSignIn/ClientSignIn"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Client />}>
          <Route path="/signup" element={<ClientSignUp />} />
          <Route path="/signin" element={<ClientSignIn />} />
        </Route>
      </Routes>
    </>
  )
}

export default App