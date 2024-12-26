import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { FiMail, FiPhone, FiUser, FiMapPin, FiCalendar, FiShoppingBag } from "react-icons/fi";

export default function QrCode() {
    const { member } = usePage().props;

    return (
        <>
            <Head title={`Detail Member: ${member.name}`} />
            <div className="bg-orange-100 min-h-screen py-10 flex justify-center items-center">
                <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-300 to-orange-500 p-8 text-white text-center rounded-t-xl">
                        <h1 className="text-3xl font-semibold">{member.name}</h1>
                        <p className="text-sm mt-2">{`Nomor Member: ${member.member_number}`}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Image */}
                        {member.image && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={`/storage/${member.image}`}
                                    alt={member.name}
                                    className="w-36 h-36 rounded-full border-4 border-white shadow-lg"
                                />
                            </div>
                        )}

                        {/* Information */}
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiUser className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Nama</h2>
                                    <p className="text-gray-900 font-semibold">{member.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiMail className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Email</h2>
                                    <p className="text-gray-900 font-semibold">{member.email}</p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiPhone className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Nomor Telepon</h2>
                                    <p className="text-gray-900 font-semibold">{member.phone_number}</p>
                                </div>
                            </div>

                            {/* Date of Birth and Place */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiCalendar className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Tempat & Tanggal Lahir</h2>
                                    <p className="text-gray-900 font-semibold">{member.place_of_birth}</p>
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiUser className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Jenis Kelamin</h2>
                                    <p className="text-gray-900 font-semibold">{member.gender}</p>
                                </div>
                            </div>
                             
                             {/* Store Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiShoppingBag className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Nama Toko</h2>
                                    <p className="text-gray-900 font-semibold">{member.store_name}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <div className="flex items-center space-x-4">
                                    <FiMapPin className="text-orange-400 text-3xl" />
                                    <div>
                                        <h2 className="text-gray-700 font-medium">Alamat</h2>
                                        <p className="text-gray-900 font-semibold">{member.address}</p>
                                    </div>
                                </div>

                                {/* Google Map */}
                                {member.address && (
                                    <iframe
                                        title="Google Map"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(member.address)}&output=embed`}
                                        width="100%"
                                        height="250"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
