import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { CiBarcode, CiUser, CiLocationOn, CiCalendarDate } from "react-icons/ci";
import { TfiPaintBucket } from "react-icons/tfi";
import { PiPaintBrushLight, PiStorefrontThin } from "react-icons/pi";
import { SlLayers } from "react-icons/sl";

export default function QrCode() {
    const { batik } = usePage().props;

    const address = batik.member?.address || "Cirebon, Indonesia"; 
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <>
            <Head title={`Detail Batik: ${batik.name}`} />
            <div className="bg-blue-100 min-h-screen flex justify-center items-center">
                <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-6 rounded-t-xl relative shadow-md">
                        <div className="text-left">
                            <p className="text-sm font-bold text-blue-200 tracking-wide">Informasi Detail Batik</p>
                            <h1 className="text-3xl font-semibold text-white mt-2">{batik.name || " - "}</h1>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Image and Description */}
                        <div className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center">
                            {/* Image */}
                            {batik.image ? (
                                <img
                                    src={`/storage/${batik.image}`}
                                    alt={batik.name}
                                    className="w-62 h-auto object-cover rounded-lg shadow-md"
                                />
                            ) : (
                                <div className="w-62 h-62 bg-gray-300 rounded-lg shadow-md"></div>
                            )}
                            {/* Description */}
                            <div className="mt-4 text-center">
                                <h2 className="text-lg font-semibold text-gray-800">Deskripsi Batik</h2>
                                <p className="text-gray-600 mt-2 text-justify">
                                    {batik.description || "Deskripsi tidak tersedia."}
                                </p>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            {/* Batik Code */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiBarcode className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Kode Batik</h2>
                                    <p className="text-sm">
                                            {`M-${batik.code_batik.slice(1, 4)}-${ batik.code_batik.slice(4).match(/.{1,2}/g)?.join("-") || ""}`}
                                    </p>
                                </div>
                            </div>

                            {/* Member Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiUser className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Anggota MPIG-BTMC</h2>
                                    <p className="text-sm">{batik.member?.name || " - "}</p>
                                </div>
                            </div>

                            {/* Store Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <PiStorefrontThin className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Nama Merek (Toko)</h2>
                                    <p className="text-sm">{batik.member?.store_name || " - "}</p>
                                </div>
                            </div>

                            {/* Bricklayer Name */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <TfiPaintBucket className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Nama Penembok</h2>
                                    <p className="text-sm">{batik.bricklayer_name || " - "}</p>
                                </div>
                            </div>

                            {/* Motif Creator */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <PiPaintBrushLight className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Pembuat Motif</h2>
                                    <p className="text-sm">{batik.motif_creator || " - "}</p>
                                </div>
                            </div>

                            {/* Production Year */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiCalendarDate className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Tahun Produksi</h2>
                                    <p className="text-sm">{batik.production_year || " - "}</p>
                                </div>
                            </div>

                            {/* Materials */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <SlLayers className="text-blue-400 text-3xl" />
                                <div>
                                    <h2 className="text-gray-900 font-semibold">Bahan</h2>
                                    <p className="text-sm">{batik.materials || " - "}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="relative p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all">
                                <CiLocationOn className="absolute top-4 left-4 text-blue-400 text-3xl" />
                                <div className="pl-12">
                                    <h2 className="text-gray-900 font-semibold">Alamat Toko</h2>
                                    <p className="text-sm">{batik.member?.address || " - "}</p>
                                </div>
                            </div>

                            {/* Google Map */}
                            <div className="mt-6">
                                <iframe
                                    src={googleMapsUrl}
                                    width="100%"
                                    height="300"
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
