import React from "react";

export default function WelcomeFooter() {
    return (
        <footer className="bg-white py-8 border-t border-gray-200">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Address Section */}
                {/* <div>
                    <h4 className="text-lg font-bold mb-4">Address</h4>
                    <p className="text-gray-600 leading-relaxed">
                        Jl. Panembahan Utara No.01, Panembahan, Kec. Plered, Kabupaten Cirebon, Jawa Barat 45154.
                    </p>
                </div> */}

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
                    <form
                        className="flex"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const userEmail = e.target.email.value;
                            const subject = "Subscription Request";
                            const body = "Halo, saya ingin berlangganan informasi lebih lanjut.";

                            const mailtoLink = `mailto:admin@example.com?subject=${encodeURIComponent(
                                subject
                            )}&body=${encodeURIComponent(body)}%0AEmail pengguna: ${encodeURIComponent(userEmail)}`;

                            window.location.href = mailtoLink;
                        }}
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:ring-orange-200"
                            required
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
    );
}
