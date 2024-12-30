import Header from "@/Components/Header";
import { useState, useEffect } from "react";
import WelcomeFooter from "@/Components/WelcomeFooter";
import { FiHome, FiBox, FiInfo } from "react-icons/fi";
import sejarahImage from '../../images/sejarah.png'


export default function AboutPage({user}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("about");

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
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                activeMenu={activeMenu}
                handleMenuClick={handleMenuClick}
                user={user}  // Pass user prop

            >
                <nav className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 shadow-md">
                    <div className="text-white text-2xl font-bold">Logo</div>
                    <ul className="hidden md:flex space-x-6">
                        <li
                            className={`flex items-center space-x-2 cursor-pointer text-white text-lg ${
                                activeMenu === "home" ? "font-bold border-b-2 border-white" : ""
                            }`}
                            onClick={() => handleMenuClick("home")}
                        >
                            <FiHome />
                            <span>Home</span>
                        </li>
                        <li
                            className={`flex items-center space-x-2 cursor-pointer text-white text-lg ${
                                activeMenu === "product" ? "font-bold border-b-2 border-white" : ""
                            }`}
                            onClick={() => handleMenuClick("product")}
                        >
                            <FiBox />
                            <span>Products</span>
                        </li>
                        <li
                            className={`flex items-center space-x-2 cursor-pointer text-white text-lg ${
                                activeMenu === "about" ? "font-bold border-b-2 border-white" : ""
                            }`}
                            onClick={() => handleMenuClick("about")}
                        >
                            <FiInfo />
                            <span>About</span>
                        </li>
                    </ul>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                </nav>
                {isMenuOpen && (
                    <ul className="md:hidden bg-orange-600 text-white space-y-2 p-4">
                        <li
                            className={`cursor-pointer ${
                                activeMenu === "home" ? "font-bold underline" : ""
                            }`}
                            onClick={() => handleMenuClick("home")}
                        >
                            Home
                        </li>
                        <li
                            className={`cursor-pointer ${
                                activeMenu === "product" ? "font-bold underline" : ""
                            }`}
                            onClick={() => handleMenuClick("product")}
                        >
                            Products
                        </li>
                        <li
                            className={`cursor-pointer ${
                                activeMenu === "about" ? "font-bold underline" : ""
                            }`}
                            onClick={() => handleMenuClick("about")}
                        >
                            About
                        </li>
                    </ul>
                )}
            </Header>

            
            <main className="p-0 md:p-6 bg-gray-100">
            <section id="about" className="w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">SEJARAH BATIK TULIS MERAWIT <br /> CIREBON</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p className="text-justify">
                                Dimulai pada abad ke-14 Masehi dengan seorang tokoh yang dikenal sebagai Mbah Kuwu Cirebon atau Pangeran Cakrabhuwana. Ia hijrah dari daerah Cirebon (Keraton Pakungwati atau Keraton Cirebon) ke sebuah wilayah yang kini dikenal sebagai Trusmi. Dalam hijrahnya, Mbah Kuwu Cirebon mengenakan pakaian seorang kyai dan menyebarkan ajaran agama Islam. Hingga saat ini, ia lebih dikenal dengan nama Mbah Buyut Trusmi.
                            </p>
                            <p className="text-justify">
                                Istilah "Trusmi" berasal dari sebuah kisah yang menceritakan bagaimana Mbah Buyut Trusmi, putra Raja Pajajaran Prabu Siliwangi, tiba di daerah tersebut. Selain menyebarkan Islam, ia juga memperbaiki kehidupan masyarakat setempat dengan mengajarkan cara-cara bercocok tanam.
                            </p>
                            <p className="text-justify">
                                Dalam kisahnya, Pangeran Manggarajati (Bung Cikal), putra pertama Pangeran Carbon Girang yang menjadi yatim sejak kecil, diangkat sebagai anak oleh Syekh Syarif Hidayatullah (Sunan Gunung Jati). Bung Cikal diasuh oleh Mbah Buyut Trusmi, yang juga kakak kandung dari ibu Sunan Gunung Jati.
                            </p>
                            <p className="text-justify">
                                Kesaktian Bung Cikal sudah terlihat sejak kecil. Salah satu kebiasaannya adalah merusak tanaman yang ditanam oleh Mbah Buyut Trusmi. Namun, yang mengherankan adalah tanaman yang dirusak olehnya selalu tumbuh kembali dan bersemi dengan cepat. Hal ini menjadi asal mula nama "Trusmi," yang berasal dari kata "Terussemi" atau "terus bersemi."
                            </p>
                        </div>
                        <div className="flex justify-center items-center">
                            <img
                                src={sejarahImage}
                                alt="Gambar terkait Trusmi"
                                className="rounded-lg shadow-md"
                            />
                        </div>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p className="text-justify">
                                Mbah Buyut Trusmi, yang juga dikenal dengan nama Raden Walangsungsang (Ki Cakrabumi atau Pangeran Cakrabhuwana), datang ke Pedukuhan Trusmi dan berhasil menaklukkan Ki Gede Trusmi.
                            </p>
                            <p className="text-justify">
                                menaklukkan Ki Gede Trusmi. Kelahiran seni batik Trusmi berawal dari ajaran Ki Buyut Trusmi bersama Sunan Gunung Jati. Diperkirakan, kerajinan batik ini mulai berkembang sejak abad ke-14 M. Sunan Gunung Jati, yang diangkat sebagai Sultan Cirebon pada tahun 1480 M, menyebarkan ajaran Islam di kawasan Desa Trusmi sambil mengajarkan keterampilan membatik kepada masyarakat setempat. Hal inilah yang menjadikan Desa Trusmi terkenal sebagai kampung batik hingga saat ini.
                            </p>
                            <p className="text-justify">
                                Menurut cerita, Sultan Gunung Jati pernah meminta seorang warga Trusmi untuk membuat batik serupa miliknya tanpa membawa contoh aslinya. Warga tersebut hanya diperbolehkan melihat motifnya. Ketika batik selesai dibuat, ia membawa hasil karyanya kepada Sultan, yang kemudian membandingkannya dengan batik asli.
                            </p>
                            <p> Sultan diminta memilih antara batik asli dan duplikatnya. Karena kemiripannya yang luar biasa, Sultan tidak dapat membedakan antara keduanya. Akhirnya, Sultan mengakui bahwa batik buatan warga Trusmi sangatlah bagus, bahkan dapat menyamai kualitas batik aslinya tanpa perlu membawa contoh langsung.</p>
                        </div>
                    </div>
                </section>
            </main>
            <WelcomeFooter />
        </>
    );
}
