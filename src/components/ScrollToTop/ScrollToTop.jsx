import { useEffect } from "react";

const ScrollToTop = () => {
    useEffect(() => {
        const scroll = document.querySelector(".scrollToTop");

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const bodyHeight = document.body.scrollHeight;
            const windowHeight = window.innerHeight;

            const width = (scrollY / (bodyHeight - windowHeight)) * 100;

            if (scroll) {
                scroll.style.width = width + "%";
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div className="w-0 h-[5px] bg-blue-600 fixed z-10 top-0 left-0 scrollToTop"></div>
        </>
    );
};

export default ScrollToTop;
