import React from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    FiPenTool,
    FiUser,
    FiMapPin,
    FiShoppingBag,
    FiTool,
    FiCalendar,
    FiLayers,
} from "react-icons/fi";

export default function QrCode() {
    const { batik } = usePage().props;

    return (
        <>
            <Head title={`Detail Batik: ${batik.name}`} />
            <div className="bg-orange-100 min-h-screen py-10 flex justify-center items-center">
                <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-300 to-orange-500 p-6 text-white text-center rounded-t-xl">
                        <h1 className="text-3xl font-semibold">{batik.name}</h1>
                        <p className="text-sm mt-2 font-semibold">{`Kode Batik: M-${batik.code_batik
                            .slice(1)
                            .match(/.{1,2}/g)
                            .join("-")}`}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Image and Description */}
                        <div className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center">
                            {/* Image */}
                            <img
                                src={`/storage/${batik.image}`}
                                alt={batik.name}
                                className="w-56 h-56 object-cover rounded-lg shadow-md"
                            />
                            {/* Description */}
                            <div className="mt-4 text-center">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Deskripsi Batik
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    {batik.description || "Deskripsi tidak tersedia."}
                                </p>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            {/* Member Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiUser className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Kode Batik</h2>
                                    <p className="text-gray-900 font-semibold">{` M-${batik.code_batik
                                        .slice(1)
                                        .match(/.{1,2}/g)
                                        .join("-")}`}
                                    </p>
                                </div>
                            </div>
                            {/* Member Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiUser className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Anggota MPIG-BTMC</h2>
                                    <p className="text-gray-900 font-semibold">
                                        {batik.member?.name || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Store Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiShoppingBag className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Nama Merek (Toko)</h2>
                                    <p className="text-gray-900 font-semibold">
                                        {batik.member?.store_name || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Bricklayer Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiTool className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Nama Penembok</h2>
                                    <p className="text-gray-900 font-semibold">
                                        {batik.bricklayer_name || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Motif Creator */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiPenTool className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Pembuat Motif</h2>
                                    <p className="text-gray-900 font-semibold">{batik.motif_creator}</p>
                                </div>
                            </div>

                            {/* Production Year */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiCalendar className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Tahun Produksi</h2>
                                    <p className="text-gray-900 font-semibold">
                                        {batik.production_year}
                                    </p>
                                </div>
                            </div>

                            {/* Materials */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiLayers className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Bahan</h2>
                                    <p className="text-gray-900 font-semibold">
                                        {batik.materials || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <FiMapPin className="text-orange-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-700 font-medium">Alamat Toko</h2>
                                    <p className="text-gray-900 font-semibold">
                                        {batik.member?.address || ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
