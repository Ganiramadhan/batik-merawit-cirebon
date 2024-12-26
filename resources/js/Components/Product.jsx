import { Link } from '@inertiajs/react';
import { FiCheckCircle } from "react-icons/fi";
import product1 from '../../images/product1.jpg'
import product2 from '../../images/product2.jpg'
import product3 from '../../images/product3.jpg'

    const Product = () => {
    return (
        <section id="product" className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Produk Kami</h2>
            <p className="text-lg text-gray-600">
                Menjelajahi keindahan dan filosofi di balik Batik Tulis Merawit Cirebon
            </p>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Motif Batik Tulis Merawit</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
                Motif Batik Tulis Merawit Cirebon yang menggunakan teknik merawit ini pada umumnya dipengaruhi oleh estetika batik Keratonan Cirebonan, sehingga teknik ini digunakan sebagai teknik batik Keraton Cirebonan dan Batik Tulis Pesisiran (daerah Trusmi dan sekitarnya).
                </p>
                <ul className="space-y-4 text-lg mb-6">
                <li className="flex items-center text-gray-700">
                    <FiCheckCircle className="text-orange-500 text-2xl mr-4" />
                    Makna Simbolik
                </li>
                <li className="flex items-center text-gray-700">
                    <FiCheckCircle className="text-orange-500 text-2xl mr-4" />
                    Simbol Mitologi
                </li>
                <li className="flex items-center text-gray-700">
                    <FiCheckCircle className="text-orange-500 text-2xl mr-4" />
                    Makna Spiritual
                </li>
                <li className="flex items-center text-gray-700">
                    <FiCheckCircle className="text-orange-500 text-2xl mr-4" />
                    Tradisional Trusmi Pesisiran
                </li>
                </ul>
                <Link href="/product">
                    <button className="bg-orange-500 text-white px-6 py-3 rounded shadow hover:bg-orange-600 transition-all text-sm md:text-base">
                        Selengkapnya ➔
                    </button>
                </Link>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-8 relative">
                <div className="relative">
                <img
                    src={product1}
                    alt="Batik Merawit 1"
                    className="rounded-lg shadow-lg object-cover h-72 w-72 absolute top-[50px] left-0 md:left-20 transition-transform duration-300 hover:scale-110 hover:z-50"
                />
                <img
                    src={product2}
                    alt="Batik Merawit 2"
                    className="rounded-lg shadow-lg object-cover h-72 w-72 absolute top-[100px] left-10 md:left-[100px] transition-transform duration-300 hover:scale-110 hover:z-50"
                />
                <img
                    src={product3}
                    alt="Batik Merawit 3"
                    className="rounded-lg shadow-lg object-cover h-72 w-72 absolute top-[150px] left-20 md:left-[180px] transition-transform duration-300 hover:scale-110 hover:z-50"
                />
                </div>
            </div>
            </div>
        </div>
        </section>
    );
    };

    export default Product;
