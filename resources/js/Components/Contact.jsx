    import React, { useState } from "react";
    import { FiLoader } from "react-icons/fi";

    const Contact = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const name = e.target.name.value;
        const email = e.target.email.value;
        const message = e.target.message.value;

        const phoneNumber = "628156205251";
        const waMessage = `Halo, saya ${name}.\n\nEmail: ${email}\nPesan:${message}`;

        const encodedMessage = encodeURIComponent(waMessage);

        // Simulate a delay for 2 seconds before sending the message
        setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        setLoading(false); // Stop loading after the message is sent
        }, 2000);
    };

    return (
        <section id="contact" className="py-16 bg-white scroll-mt-20">
        <div className="container mx-auto px-6 md:px-20">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Hubungi Kami</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Kirim Pesan</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Masukkan nama Anda"
                    className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Masukkan email Anda"
                    className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan</label>
                    <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Tuliskan pesan Anda di sini"
                    className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition-all"
                    disabled={loading} // Disable the button when loading
                >
                    {loading ? (
                    <div className="flex items-center justify-center">
                        <FiLoader className="animate-spin mr-2" /> Kirim Pesan
                    </div>
                    ) : (
                    "Kirim Pesan"
                    )}
                </button>
                </form>
            </div>

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
                    <a href="mailto:batikmerawittrusmi@gmail.com" className="text-gray-600 hover:text-gray-800">
                        batikmerawittrusmi@gmail.com
                    </a>
                    </li>
                </ul>
                </div>

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
    );
    };

    export default Contact;
