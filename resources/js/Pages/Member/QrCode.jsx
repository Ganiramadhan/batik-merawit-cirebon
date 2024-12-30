import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { CiMail, CiPhone, CiCalendarDate, CiUser, CiLocationOn} from "react-icons/ci";
import { PiStorefrontThin } from "react-icons/pi";

export default function QrCode() {
    const { member } = usePage().props;

    const address = member.address || "Cirebon, Indonesia"; 
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <>
            <Head title={`Detail Member: ${member.name}`} />
            <div className="bg-blue-100 min-h-screen flex justify-center items-center">
                <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-6 rounded-xl text-white relative shadow-md">
                        <h1 className="text-2xl font-semibold">{member.name}</h1>
                        <p className="text-sm mt-2 font-semibold">{`Nomor Member: ${member.member_number || '-'}`}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Image */}
                        {member.image ? (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={`/storage/${member.image}`}
                                    alt={member.name}
                                    className="w-36 h-auto"
                                />
                            </div>
                        ) : null}

                        {/* Information */}
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiMail className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Email</h2>
                                    <p className="text-sm">{member.email || '-'}</p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiPhone className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Nomor Telepon</h2>
                                    <p className="text-sm">{member.phone_number || '-'}</p>
                                </div>
                            </div>

                            {/* Date of Birth and Place */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiCalendarDate className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Tempat & Tanggal Lahir</h2>
                                    <p className="text-sm">{member.place_of_birth || '-'}</p>
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiUser className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Jenis Kelamin</h2>
                                    <p className="text-sm">{member.gender || '-'}</p>
                                </div>
                            </div>

                            {/* Store Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <PiStorefrontThin className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Nama Toko</h2>
                                    <p className="text-sm">{member.store_name || '-'}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="relative p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                {/* Icon di Pojok Kiri Atas */}
                                <CiLocationOn className="absolute top-4 left-4 text-blue-400 text-3xl" />
                                {/* Label dan Address */}
                                <div className="pl-12 mb-2">
                                    <h2 className="text-gray-900 font-semibold">Alamat Toko</h2>
                                    <p className="text-sm">{member.address || '-'}</p>
                                </div>
                                
                            </div>
                            {/* Google Map */}
                            <div className="mt-6">
                                {/* Google Map */}
                                    <iframe
                                        title="Google Map"
                                        src={googleMapsUrl}
                                        width="100%"
                                        height="250"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                    ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
