import { Route, Routes } from "react-router-dom"
import Client from "./pages/Client"

import './assets/css/output.css'
import './assets/css/App.css'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Client />}></Route>
      </Routes>
    </>
  )
}

export default App