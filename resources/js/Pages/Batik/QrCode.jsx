import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { FiUser, FiShoppingBag, FiTag, FiCreditCard, FiCalendar, FiPenTool, FiTool, FiLayers } from "react-icons/fi";
import btmcLogo from '../../../images/BTMC.png';
import igiLogo from '../../../images/IGI.png';

export default function QrCode() {
    const { batik } = usePage().props;

    return (
        <>
            <Head title={`Detail Batik: ${batik.name}`} />
            <div className="bg-gray-100 min-h-screen py-0 sm:py-12 flex justify-center items-center">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl relative">
                    {/* SVG Batik Background */}
                    <div className="absolute inset-0 bg-[url('/path-to-your-batik-pattern.svg')] bg-cover bg-center opacity-20 z-0"></div>

                    {/* Bagian Header */}
                    <div className="bg-white p-4 text-gray-800 text-center relative border-b z-10">
                        {/* Logo BTMC */}
                        <div className="absolute top-4 right-20 hidden md:block">
                            <img src={btmcLogo} alt="BTMC Logo" className="w-14 h-14" />
                        </div>
                        {/* Logo IGI */}
                        <div className="absolute top-4 right-4 hidden md:block">
                            <img src={igiLogo} alt="IGI Logo" className="w-14 h-14" />
                        </div>
                        {/* Nama Batik */}
                        <h1 className="text-3xl font-bold">{batik.name}</h1>
                        <p className="text-sm">Informasi Detail Batik</p>
                    </div>

                    {/* Bagian Konten */}
                    <div className="p-8 space-y-6 z-10">
                        {/* Bagian Deskripsi */}
                        <div className="border-b pb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-3">Deskripsi</h2>
                            <p className="text-gray-600 text-base leading-relaxed text-justify">
                                {batik.description || "Deskripsi tidak tersedia."}
                            </p>
                        </div>

                        {/* Bagian Gambar */}
                        {batik.image && (
                            <div className="text-center">
                                <img
                                    src={`/storage/${batik.image}`}
                                    alt={batik.name}
                                    className="w-full max-w-xs mx-auto rounded-md shadow-md"
                                />
                            </div>
                        )}

                        {/* Bagian Detail */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiTag className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Kode Batik:</span>
                                    <span className="text-gray-900 font-semibold">{batik.code_batik}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiCreditCard className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Harga:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(batik.price)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiUser className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Anggota MPIG-BTMC:</span>
                                    <span className="text-gray-900 font-semibold">{batik.member?.name || "Tidak diketahui"}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiShoppingBag className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Nama Merek (Toko):</span>
                                    <span className="text-gray-900 font-semibold">{batik.member?.store_name || "Tidak diketahui"}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiPenTool className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Pembuat Motif:</span>
                                    <span className="text-gray-900 font-semibold">{batik.motif_creator || "Tidak diketahui"}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiTool className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Nama Tukang:</span>
                                    <span className="text-gray-900 font-semibold">{batik.bricklayer_name || "Tidak diketahui"}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiCalendar className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Tahun Produksi:</span>
                                    <span className="text-gray-900 font-semibold">{batik.production_year}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 border p-4 rounded-md">
                                <FiLayers className="text-gray-500 text-xl" />
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">Bahan:</span>
                                    <span className="text-gray-900 font-semibold">{batik.materials || "Tidak disebutkan"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
