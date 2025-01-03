import ClientHeader from "../components/Clients/ClientHeader/ClientHeader"
import ClientFooter from "../components/Clients/ClientFooter/ClientFooter"
import { Outlet } from "react-router-dom"

const Client = () => {
    return (
        <>
            <ClientHeader />
            <Outlet />
            <ClientFooter />
        </>
    )
}

export default Client