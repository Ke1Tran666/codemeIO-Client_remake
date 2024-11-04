import Logo from '/logo.png'

const ElectroLogo = () => {
    return (
        <a href='/' className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary sm:h-12 sm:w-12">
                <img
                    className="h-8 w-8 object-cover sm:h-10 sm:w-10"
                    src={Logo}
                    alt="Logo của web khoa học CodemeIO"
                />
            </div>
            <p className="hidden text-2xl font-extrabold text-primary sm:block">Codeme-IO</p>
        </a>
    )
}

export default ElectroLogo