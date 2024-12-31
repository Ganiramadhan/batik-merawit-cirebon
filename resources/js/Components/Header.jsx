import React from "react";
import { FiMenu, FiHome, FiInfo, FiShoppingBag, FiPhone, FiLogIn, FiGrid } from "react-icons/fi";  // Add FiUser icon
import { Link } from '@inertiajs/react';
import btmcLogo from "../../images/BTMC.png";

export default function Header({ isMenuOpen, setIsMenuOpen, activeMenu, handleMenuClick, user }) {
    // Function to handle smooth scrolling
    const handleScrollToSection = (id) => {
        const currentPath = window.location.pathname;

        if (currentPath !== "/") {
            // Navigate to the root with hash if not on root page
            window.location.href = `/#${id}`;
        } else {
            // Scroll to the section if already on root page
            const section = document.querySelector(`#${id}`);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <header className="flex justify-between items-center px-8 md:px-24 py-4 sticky top-0 z-10 bg-gray-100 bg-opacity-70 backdrop-blur-md">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
                <img
                    src={btmcLogo}
                    alt="Logo"
                    className="h-12"
                />
                <div>
                    <span className="block text-xl text-gray-800 font-bold">KMPIG-BTMC</span>
                    <span className="block text-sm text-gray-">
                        Komunitas Masyarakat Perlindungan Indikasi Geografis - Batik Tulis Merawit Cirebon
                    </span>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-600 hover:text-blue-500 focus:outline-none"
                >
                    <FiMenu className="text-2xl" />
                </button>
            </div>

            {/* Navigation Menu */}
            <nav
                className={`absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none md:flex md:items-center md:space-x-4 transition-all ${
                    isMenuOpen ? 'block' : 'hidden'
                }`}
            >
                {/* Home Link */}
                <Link
                    href="/#home"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection("home");
                        handleMenuClick("home");
                    }}
                    className={`block md:inline-block px-2 py-2 text-gray-600 hover:text-blue-500 transition ${
                        activeMenu === "home" ? "text-blue-600 font-bold" : ""
                    }`}
                >
                    <FiHome className="inline md:mr-2" /> Home
                </Link>

                {/* About Link */}
                <Link
                    href="/#about"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection("about");
                        handleMenuClick("about");
                    }}
                    className={`block md:inline-block px-2 py-2 text-gray-600 hover:text-blue-500 transition ${
                        activeMenu === "about" ? "text-blue-600 font-bold" : ""
                    }`}
                >
                    <FiInfo className="inline md:mr-2" /> Tentang Kami
                </Link>

                {/* Product Link */}
                <Link
                    href="/#product"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection("product");
                        handleMenuClick("product");
                    }}
                    className={`block md:inline-block px-2 py-2 text-gray-600 hover:text-blue-500 transition ${
                        activeMenu === "product" ? "text-blue-600 font-bold" : ""
                    }`}
                >
                    <FiShoppingBag className="inline md:mr-2" /> Produk
                </Link>

                {/* Contact Link */}
                <Link
                    href="/#contact"
                    onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection("contact");
                        handleMenuClick("contact");
                    }}
                    className={`block md:inline-block px-2 py-2 text-gray-600 hover:text-blue-500 transition ${
                        activeMenu === "contact" ? "text-blue-600 font-bold" : ""
                    }`}
                >
                    <FiPhone className="inline md:mr-2" /> Informasi
                </Link>

                {/* Conditionally Render Login or User Icon */}
                {user ? (
                    <Link
                        href="/dashboard"
                        onClick={(e) => handleMenuClick("user")}
                        className={`block md:inline-block px-2 py-2 text-gray-600 hover:text-blue-500 transition ${
                            activeMenu === "user" ? "text-blue-600 font-bold" : ""
                        }`}
                    >
                        <FiGrid className="inline md:mr-2" /> Dashboard
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        onClick={(e) => handleMenuClick("login")}
                        className={`block md:inline-block px-2 py-2 text-gray-600 hover:text-blue-500 transition ${
                            activeMenu === "login" ? "text-blue-600 font-bold" : ""
                        }`}
                    >
                        <FiLogIn className="inline md:mr-2" /> Login
                    </Link>
                )}
            </nav>
        </header>
    );
}
