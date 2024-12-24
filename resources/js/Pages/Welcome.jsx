import { 
    FiHome, 
    FiInfo, 
    FiShoppingBag, 
    FiPhone, 
    FiAward, 
    FiUsers, 
    FiShoppingCart, 
    FiMenu, 
    FiCheckCircle,
    FiLogIn

} from 'react-icons/fi';

import { useState, useEffect  } from 'react';
import btmcLogo from '../../images/BTMC.png';
import igiLogo from '../../images/IGI.png';
import product1 from '../../images/product1.jpg'
import product2 from '../../images/product2.jpg'
import product3 from '../../images/product3.jpg'

export default function Welcome() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("home");

    
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setIsMenuOpen(false); 
    };

    useEffect(() => {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveMenu(entry.target.id); 
                }
            });
        }, { threshold: 0.5 }); 

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);



    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-between items-center px-8 md:px-24 py-4 sticky top-0 z-10 bg-gray-100 bg-opacity-70 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                    <img
                        src={igiLogo}
                        alt="Logo"
                        className="h-10"
                    />
                    <span className="text-xl text-gray-800 font-bold">KMPIG-BTMC</span>
                </div>
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-600 hover:text-orange-500 focus:outline-none"
                    >
                        <FiMenu className="text-2xl" />
                    </button>
                </div>
                <nav
                    className={`absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none md:flex md:items-center md:space-x-4 transition-all ${
                        isMenuOpen ? 'block' : 'hidden'
                    }`}
                >
                    <a
                        href="#home"
                        onClick={() => handleMenuClick("home")}
                        className={`block md:inline-block px-4 py-2 text-gray-600 hover:text-orange-500 transition ${activeMenu === "home" ? "text-orange-500 font-bold" : ""}`}
                    >
                        <FiHome className="inline md:mr-2" /> Home
                    </a>
                    <a
                        href="#about"
                        onClick={() => handleMenuClick("about")}
                        className={`block md:inline-block px-4 py-2 text-gray-600 hover:text-orange-500 transition ${activeMenu === "about" ? "text-orange-500 font-bold" : ""}`}
                    >
                        <FiInfo className="inline md:mr-2" /> About
                    </a>
                    <a
                        href="#product"
                        onClick={() => handleMenuClick("product")}
                        className={`block md:inline-block px-4 py-2 text-gray-600 hover:text-orange-500 transition ${activeMenu === "product" ? "text-orange-500 font-bold" : ""}`}
                    >
                        <FiShoppingBag className="inline md:mr-2" /> Product
                    </a>
                    <a
                        href="#contact"
                        onClick={() => handleMenuClick("contact")}
                        className={`block md:inline-block px-4 py-2 text-gray-600 hover:text-orange-500 transition ${activeMenu === "contact" ? "text-orange-500 font-bold" : ""}`}
                    >
                        <FiPhone className="inline md:mr-2" /> Contact
                    </a>
                    {/* Login Button with Icon */}
                    <a
                        href="/login"
                        onClick={() => handleMenuClick("login")}
                        className={`block md:inline-block px-4 py-2 text-gray-600 hover:text-orange-500 transition ${activeMenu === "login" ? "text-orange-500 font-bold" : ""}`}
                    >
                        <FiLogIn className="inline md:mr-2" /> Login
                    </a>

                </nav>
            </header>


            {/* Main Content */}
            <main className="flex-1">


                {/* Hero and Info Section Combined */}
                <div className="relative min-h-screen bg-gray-100 flex flex-col">
                    <section
                            className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 flex-grow"
                            id="home"
                        >
                            {/* Hero Section - Left Content */}
                            <div className="max-w-lg text-center md:text-left md:ml-12 mb-6 md:mb-0 flex-1">
                                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6"> {/* Increased font size */}
                                    BATIK TULIS
                                    <br />
                                    MERAWIT CIREBON
                                </h1>
                                <p className="text-md md:text-lg text-gray-700 mb-8 leading-relaxed"> {/* Increased font size */}
                                    Satu keunggulan dari batik tulis Cirebon adalah teknik "merawit" yang tidak dimiliki oleh daerah penghasil batik tradisional lainnya. Teknik ini menjadi ciri khas yang membedakan Batik Cirebon di kancah nusantara.
                                </p>
                                <button className="bg-orange-500 text-white px-6 py-3 rounded shadow hover:bg-orange-600 transition-all text-sm md:text-base"> {/* Increased padding */}
                                    Selengkapnya ➔
                                </button>
                            </div>

                            {/* Hero Section - Right Content */}
                            <div className="flex-1 flex justify-center md:justify-center">
                                <img
                                    src={btmcLogo}
                                    alt="Batik Merawit Cirebon"
                                    className="h-48 w-48 md:h-64 md:w-64 rounded-lg" 
                                />
                            </div>
                        </section>

                        {/* Info Section */}
                        <div
                            className="bg-gray-800 text-white py-4 flex justify-around w-full"
                            id="about"
                        >
                            {/* Info 1 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center md:justify-start mb-2">
                                    <FiAward className="text-orange-500 text-2xl mr-2" />
                                    <span className="text-base md:text-lg font-bold">Batik</span>
                                </div>
                                <p className="text-xs md:text-sm">60 motif batik merawit Cirebon</p>
                            </div>

                            {/* Info 2 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center md:justify-start mb-2">
                                    <FiUsers className="text-orange-500 text-2xl mr-2" />
                                    <span className="text-base md:text-lg font-bold">Perajin</span>
                                </div>
                                <p className="text-xs md:text-sm">60 Perajin batik merawit Cirebon</p>
                            </div>

                            {/* Info 3 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center md:justify-start mb-2">
                                    <FiShoppingCart className="text-orange-500 text-2xl mr-2" />
                                    <span className="text-base md:text-lg font-bold">Toko</span>
                                </div>
                                <p className="text-xs md:text-sm">
                                    Terjual di berbagai toko batik Cirebon
                                </p>
                            </div>
                        </div>
                </div>


              {/* About Section  */}
                <section id="about" className="py-16 bg-gray-100">
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
                            <div className="flex justify-center">
                                <img
                                    src={btmcLogo} 
                                    alt="Batik Merawit Cirebon"
                                    className="rounded-lg max-w-full md:max-w-sm"  
                                />
                            </div>

                            {/* Right Content: Text */}
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                                    Batik Tulis Merawit
                                </h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                    Batik Tulis Merawit Cirebon merupakan warisan budaya yang memiliki nilai seni
                                    dan filosofi mendalam. Teknik <strong>"merawit"</strong> menjadi keunikan tersendiri,
                                    mencerminkan keindahan dan kearifan lokal masyarakat Cirebon yang diwariskan dari
                                    generasi ke generasi.
                                </p>

                                {/* List with React Icons */}
                                <ul className="space-y-4 text-gray-700 text-lg mb-6">
                                    <li className="flex items-center">
                                        <FiCheckCircle className="text-orange-500 text-2xl mr-3" />
                                        Menggunakan teknik khusus yang diwarisi dari seni Keratonan Cirebonan.
                                    </li>
                                    <li className="flex items-center">
                                        <FiCheckCircle className="text-orange-500 text-2xl mr-3" />
                                        Dihasilkan oleh pengrajin lokal dengan sentuhan tradisional dan modern.
                                    </li>
                                    <li className="flex items-center">
                                        <FiCheckCircle className="text-orange-500 text-2xl mr-3" />
                                        Memiliki motif yang kaya akan simbolisme mitologi dan spiritual.
                                    </li>
                                </ul>

                                <button className="bg-orange-500 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-all">
                                    Pelajari Lebih Lanjut ➔
                                </button>
                            </div>
                        </div>
                    </div>
                </section>


              {/* Product Section */}
                <section id="product" className="py-16 bg-gray-100">
                    <div className="container mx-auto px-6 md:px-20">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Produk Kami</h2>
                            <p className="text-lg text-gray-600">
                                Menjelajahi keindahan dan filosofi di balik Batik Tulis Merawit Cirebon
                            </p>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col md:flex-row items-start gap-12">
                            {/* Left Content */}
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-gray-800 mb-6">Motif Batik Tulis Merawit</h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                    Motif Batik Tulis Merawit Cirebon menggabungkan teknik tradisional dan estetika
                                    khas Keratonan Cirebonan. Teknik "merawit" menghasilkan desain yang unik dengan
                                    nilai simbolik, spiritual, dan budaya.
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
                                <button className="bg-orange-500 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-all">
                                    Cek lainnya ➔
                                </button>
                            </div>

                            {/* Right Content */}
                            <div className="flex-1 grid grid-cols-1 gap-8 relative">
                                <div className="relative">
                                    {/* Gambar Produk */}
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



                {/* Contact Section */}
                <section id="contact" className="py-16 bg-white scroll-mt-20">
                    <div className="container mx-auto px-6 md:px-20">
                        {/* Header */}
                        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Hubungi Kami</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Formulir Kontak */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Kirim Pesan</h3>
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Masukkan nama Anda"
                                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Masukkan email Anda"
                                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="4"
                                            placeholder="Tuliskan pesan Anda di sini"
                                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-200"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-orange-500 text-white px-6 py-3 rounded shadow hover:bg-orange-600 transition-all"
                                    >
                                        Kirim Pesan
                                    </button>
                                </form>
                            </div>

                            {/* Informasi Kontak */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Informasi Kontak</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center">
                                            <span className="mr-3">📍</span>
                                            <p className="text-gray-600 leading-relaxed">
                                                Jl. Panembahan Utara No.01, Panembahan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154.
                                            </p>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-3">📱</span>
                                            <a href="tel:08156205251" className="text-gray-600 hover:text-gray-800">
                                                0815 6205 251
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-3">📞</span>
                                            <a href="tel:0811244632" className="text-gray-600 hover:text-gray-800">
                                                0811 2446 632
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-3">📧</span>
                                            <a
                                                href="mailto:batikmerawittrusmi@gmail.com"
                                                className="text-gray-600 hover:text-gray-800"
                                            >
                                                batikmerawittrusmi@gmail.com
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* Peta */}
                                <div>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.163092906942!2d108.52435901432246!3d-6.706422267532926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9e89e511a6b%3A0x31b9c1a680858942!2sPanembahan%2C%20Kec.%20Plered%2C%20Kabupaten%20Cirebon%2C%20Jawa%20Barat!5e0!3m2!1sen!2sid!4v1675883061347!5m2!1sen!2sid"
                                        width="100%"
                                        height="200"
                                        allowFullScreen=""
                                        loading="lazy"
                                        className="border rounded-md"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* Footer */}
                <footer className="bg-white py-8 border-t border-gray-200">
                    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Address Section */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Address</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Jl. Panembahan Utara No.01, Panembahan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154.
                            </p>
                        </div>

                        {/* Get in Touch Section */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Get in touch</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <span className="mr-2">📱</span>
                                    <a href="tel:08156205251" className="text-gray-600 hover:text-gray-800">
                                        0815 6205 251
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">📞</span>
                                    <a href="tel:0811244632" className="text-gray-600 hover:text-gray-800">
                                        0811 2446 632
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">📧</span>
                                    <a
                                        href="mailto:batikmerawittrusmi@gmail.com"
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        batikmerawittrusmi@gmail.com
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Useful Links Section */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Useful link</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#services" className="text-gray-600 hover:text-gray-800">
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a href="#our-team" className="text-gray-600 hover:text-gray-800">
                                        Our team
                                    </a>
                                </li>
                                <li>
                                    <a href="#portfolio" className="text-gray-600 hover:text-gray-800">
                                        Portfolio
                                    </a>
                                </li>
                                <li>
                                    <a href="#blog" className="text-gray-600 hover:text-gray-800">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter Section */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Join our newsletter</h4>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We searched extensively for a provider that could bring.
                            </p>
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:ring-orange-200"
                                />
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
