import Logo from '/logo.png'

const ElectroLogo = () => {
    return (
        <div className='flex justify-center items-center gap-2'>
            <div className="size-12 flex items-center justify-center bg-primary rounded-full flex-shrink-0">
                <img className='size-10 object-cover' src={Logo} alt='logo-cua-web-khoa-hoc-codemeIO ' />
            </div>
            <p className='text-primary font-extrabold text-2xl'>Codeme-IO</p>
        </div>
    )
}

export default ElectroLogo