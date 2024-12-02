import ClientCarousel from "./ClientCarousel"
import ClientHomeLastProduct from "./ClientHomeLastProduct"

const ClientHome = () => {
    return (
        <main className="container mx-auto mt-8">
            <ClientCarousel />
            <ClientHomeLastProduct />
        </main>
    )
}


export default ClientHome