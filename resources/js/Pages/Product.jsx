import Header from "@/Components/Header";
import { useState, useEffect } from "react";
import WelcomeFooter from "@/Components/WelcomeFooter";
import { FiHome, FiBox, FiInfo, FiCode, FiCalendar, FiDroplet, FiLayers, FiUser } from "react-icons/fi";

export default function AllProducts({ batikData, user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("product");

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveMenu(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* Header  */}
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                activeMenu={activeMenu}
                handleMenuClick={handleMenuClick}
                user={user}  // Pass user prop
            >
                <nav className="flex justify-between items-center py-4 px-6 bg-orange-600 shadow-lg">
                    <div className="text-white text-2xl font-bold">Logo</div>
                    <ul className="flex space-x-6">
                        <li
                            className={`flex items-center space-x-2 cursor-pointer text-white text-lg ${
                                activeMenu === "home" ? "font-bold underline" : ""
                            }`}
                            onClick={() => handleMenuClick("home")}
                        >
                            <FiHome />
                            <span>Home</span>
                        </li>
                        <li
                            className={`flex items-center space-x-2 cursor-pointer text-white text-lg ${
                                activeMenu === "product" ? "font-bold underline" : ""
                            }`}
                            onClick={() => handleMenuClick("product")}
                        >
                            <FiBox />
                            <span>Products</span>
                        </li>
                        <li
                            className={`flex items-center space-x-2 cursor-pointer text-white text-lg ${
                                activeMenu === "about" ? "font-bold underline" : ""
                            }`}
                            onClick={() => handleMenuClick("about")}
                        >
                            <FiInfo />
                            <span>About</span>
                        </li>
                    </ul>
                </nav>
            </Header>

            {/* All Batik Product  */}
            <section id="product" className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 md:px-20">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center gap-4">
                        <span>
                            <FiBox className="text-orange-600" />
                        </span>
                        Semua Produk
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {batikData?.length > 0 ? (
                            batikData.map((batik) => (
                                <div
                                    key={batik?.id}
                                    className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <img
                                        src={`/storage/${batik?.image}`}
                                        alt={batik?.name || '-'}
                                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-start justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-lg text-gray-300 mb-2 flex items-center gap-1">
                                            <FiCode className="text-orange-400" /> {batik?.code_batik || '-'}
                                        </p>
                                        <p className="text-lg text-gray-300 mb-2 flex items-center gap-1">
                                            <FiBox className="text-orange-400" /> {batik?.name || '-'}
                                        </p>
                                        <p className="text-lg text-gray-300 mb-2 flex items-center gap-1">
                                            <FiCalendar className="text-orange-400" /> {batik?.production_year || '-'}
                                        </p>
                                        <p className="text-lg text-gray-300 mb-2 flex items-center gap-1">
                                            <FiDroplet className="text-orange-400" /> {batik?.color_materials || '-'}
                                        </p>
                                        <p className="text-lg text-gray-300 mb-2 flex items-center gap-1">
                                            <FiLayers className="text-orange-400" /> {batik?.materials || '-'}
                                        </p>
                                        <p className="text-lg text-gray-300 flex items-center gap-1">
                                            <FiUser className="text-orange-400" /> {batik?.member?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No products available</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer  */}
            <WelcomeFooter />
        </>
    );
}
