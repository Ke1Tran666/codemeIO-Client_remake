import ClientCarousel from "./ClientCarousel"
import ClientHomeLastProduct from "./ClientHomeLastProduct"

const ClientHome = () => {
    return (
        <main className="container mx-auto">
            <ClientCarousel />
            <ClientHomeLastProduct />
        </main>
    )
}


export default ClientHome