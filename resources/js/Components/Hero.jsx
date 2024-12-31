import React from 'react';
import { FiAward, FiUsers, FiShoppingCart } from 'react-icons/fi';
import btmcLogo from '../../images/BTMC.png';
import apbiLogo from '../../images/APBI.png';
import ybiLogo from '../../images/YBI.png';
import p3bcLogo from '../../images/P3BC.png';


const Hero = ({ totalBatik, totalMember }) => {
    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 flex-grow" id="home">
                {/* Left Content */}
                <div className="max-w-lg text-center md:text-left md:ml-12 mb-6 md:mb-0 flex-1">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                        BATIK TULIS
                        <br />
                        MERAWIT CIREBON
                    </h1>
                    <p className="text-md md:text-lg text-gray-700 mb-4 leading-relaxed">
                        Satu keunggulan dari batik tulis Cirebon adalah teknik "merawit" yang tidak dimiliki oleh daerah penghasil batik tradisional lainnya. Teknik ini menjadi ciri khas yang membedakan Batik Cirebon di kancah nusantara.
                    </p>

                   {/* Logos Section */}
                    <div className="flex flex-col items-center md:items-start space-y-4 mt-16">
                        {/* Keterangan */}
                        <p className="text-md md:text-lg font-medium text-gray-700">
                            Didukung oleh:
                        </p>
                        {/* Logo Images */}
                        <div className="flex items-center justify-center md:justify-start space-x-6">
                            <img
                                src={apbiLogo}
                                alt="APBI Logo"
                                className="h-20 w-auto md:h-28 md:w-auto" // Perbesar ukuran logo
                            />
                            <img
                                src={ybiLogo}
                                alt="YBI Logo"
                                className="h-20 w-auto md:h-28 md:w-auto" // Perbesar ukuran logo
                            />
                            <img
                                src={p3bcLogo}
                                alt="P3BC Logo"
                                className="h-20 w-auto md:h-28 md:w-auto" // Perbesar ukuran logo
                            />
                        </div>
                    </div>

                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col items-center md:justify-center md:ml-12 lg:ml-20 relative">
                    <img
                        src={btmcLogo}
                        alt="Batik Merawit Cirebon"
                        className="h-48 w-48 md:h-64 md:w-64 rounded-lg hidden md:block"
                    />
                    {/* Slogan */}
                    <div
                        className="bg-gray-100 bg-opacity-70 backdrop-blur-md text-gray-700 font-medium text-center rounded-lg shadow-md px-8 py-5 mt-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        <p className="text-md md:text-lg italic leading-relaxed">
                            "Cantik Batiknya, Hijau Lingkungannya"
                        </p>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <div className="bg-gray-800 text-white py-4 px-4 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-4 w-full" id="about">
                {/* Info 1 */}
                <div className="text-center flex flex-col items-center">
                    <FiAward className="text-blue-500 text-3xl mb-2" />
                    <span className="text-base md:text-lg font-bold">Batik</span>
                    <p className="text-sm">{totalBatik} motif batik merawit Cirebon</p>
                </div>

                {/* Info 2 */}
                <div className="text-center flex flex-col items-center">
                    <FiUsers className="text-blue-500 text-3xl mb-2" />
                    <span className="text-base md:text-lg font-bold">Perajin</span>
                    <p className="text-sm">{totalMember} Perajin batik merawit Cirebon</p>
                </div>

                {/* Info 3 */}
                <div className="text-center flex flex-col items-center">
                    <FiShoppingCart className="text-blue-500 text-3xl mb-2" />
                    <span className="text-base md:text-lg font-bold">Toko</span>
                    <p className="text-sm">Tersebar di berbagai toko batik Cirebon</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
