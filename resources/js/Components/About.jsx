import React from 'react';
import { Link } from '@inertiajs/react';
import { FiCheckCircle } from 'react-icons/fi';
import sejarahImage from '../../images/sejarah.png'


const About = () => {
    return (
        <section id="about" className="py-16 bg-white scroll-mt-20">
            <div className="container mx-auto px-6 md:px-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                        Tentang Kami
                    </h2>
                    <p className="text-lg text-gray-600">
                        Mengenal lebih dekat dengan keindahan Batik Tulis Merawit Cirebon
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Content: Image */}
                    <div className="flex justify-center md:block md:pr-6">
                        <img
                            src={sejarahImage}
                            alt="Batik Merawit Cirebon"
                            className="rounded-lg max-w-full md:max-w-sm xl:max-w-md md:block hidden"
                        />
                    </div>

                    {/* Right Content: Text */}
                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                            Batik Tulis Merawit
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
                            Batik Tulis Merawit Cirebon merupakan warisan budaya yang memiliki nilai seni
                            dan filosofi mendalam. Teknik <strong>"merawit"</strong> menjadi keunikan tersendiri,
                            mencerminkan keindahan dan kearifan lokal masyarakat Cirebon yang diwariskan dari
                            generasi ke generasi.
                        </p>

                        {/* List with React Icons */}
                        <ul className="space-y-4 text-gray-700 text-lg mb-6">
                            <li className="flex items-center">
                                <FiCheckCircle className="text-blue-500 text-2xl mr-3" />
                                Menggunakan teknik khusus yang diwarisi dari seni Keratonan Cirebonan.
                            </li>
                            <li className="flex items-center">
                                <FiCheckCircle className="text-blue-500 text-2xl mr-3" />
                                Dihasilkan oleh pengrajin lokal dengan sentuhan tradisional dan modern.
                            </li>
                            <li className="flex items-center">
                                <FiCheckCircle className="text-blue-500 text-2xl mr-3" />
                                Memiliki motif yang kaya akan simbolisme mitologi dan spiritual.
                            </li>
                        </ul>

                        <Link href="/about">
                        <button className="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all">
                                Pelajari Selengkapnya ➔
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
