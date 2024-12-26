import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { FiUser, FiShoppingBag, FiTag, FiCalendar, FiPenTool, FiTool, FiLayers, FiMapPin } from "react-icons/fi";
import btmcLogo from '../../../images/BTMC.png';
import igiLogo from '../../../images/IGI.png';

export default function QrCode() {
    const { batik } = usePage().props;

    return (
        <>
            <Head title={`Detail Batik: ${batik.name}`} />
            <div className="bg-gray-50 min-h-screen py-6 sm:py-12 flex justify-center items-center">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-3xl relative">
                    {/* SVG Batik Background */}
                    <div className="absolute inset-0 bg-[url('/path-to-your-batik-pattern.svg')] bg-cover bg-center opacity-15 z-0"></div>

                    {/* Header Section */}
                    <div className="bg-white p-6 text-gray-800 text-center relative border-b z-10">
                        {/* Logo BTMC */}
                        <div className="absolute top-4 left-4 hidden md:block">
                            <img src={btmcLogo} alt="BTMC Logo" className="w-12 h-12" />
                        </div>
                        {/* Logo IGI */}
                        <div className="absolute top-4 right-4 hidden md:block">
                            <img src={igiLogo} alt="IGI Logo" className="w-12 h-12" />
                        </div>
                        {/* Batik Name */}
                        <h1 className="text-3xl font-bold text-orange-600">{batik.name}</h1>
                        <p className="text-sm text-gray-600">Informasi Detail Batik</p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-8 z-10">
                        {/* Description Section */}
                        <div className="border-b pb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-3">Deskripsi</h2>
                            <p className="text-gray-600 text-base leading-relaxed text-justify">
                                {batik.description || "Deskripsi tidak tersedia."}
                            </p>
                        </div>

                        {/* Batik Image */}
                        {batik.image && (
                            <div className="text-center mb-6">
                                <img
                                    src={`/storage/${batik.image}`}
                                    alt={batik.name}
                                    className="w-full max-w-xs mx-auto rounded-md shadow-lg"
                                />
                            </div>
                        )}

                        {/* Detail Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Batik Code */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiTag className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Kode Batik:</span>
                                    <span className="text-gray-900 font-semibold">
                                        M-{batik.code_batik.slice(1).match(/.{1,2}/g).join('-')}
                                    </span>
                                </div>
                            </div>

                            {/* Member Name */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiUser className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Anggota MPIG-BTMC:</span>
                                    <span className="text-gray-900 font-semibold">{batik.member?.name || "Tidak diketahui"}</span>
                                </div>
                            </div>

                            {/* Store Name */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiShoppingBag className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Nama Merek (Toko):</span>
                                    <span className="text-gray-900 font-semibold">{batik.member?.store_name || "Tidak diketahui"}</span>
                                </div>
                            </div>

                            {/* Motif Creator */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiPenTool className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Pembuat Motif:</span>
                                    <span className="text-gray-900 font-semibold">{batik.motif_creator || "Tidak diketahui"}</span>
                                </div>
                            </div>

                            {/* Bricklayer */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiTool className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Nama Penembok:</span>
                                    <span className="text-gray-900 font-semibold">{batik.bricklayer_name || "Tidak diketahui"}</span>
                                </div>
                            </div>

                            {/* Production Year */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiCalendar className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Tahun Produksi:</span>
                                    <span className="text-gray-900 font-semibold">{batik.production_year}</span>
                                </div>
                            </div>

                            {/* Materials */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiLayers className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Bahan:</span>
                                    <span className="text-gray-900 font-semibold">{batik.materials || "Tidak disebutkan"}</span>
                                </div>
                            </div>

                            {/* Store Address */}
                            <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-orange-100 transition-all">
                                <FiMapPin className="text-orange-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Alamat Toko:</span>
                                    <span className="text-gray-900 font-semibold">{batik.member?.address || "Tidak diketahui"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
