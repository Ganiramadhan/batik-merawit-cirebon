import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { FiEdit, FiTrash, FiDownload, FiPlus, FiX, FiSave , FiUser, FiTag,FiSearch, FiXCircle   } from "react-icons/fi";
import btmcLogo from '../../../images/BTMC.png';
import igiLogo from '../../../images/IGI.png';
import defaultLogo from '../../../images/newBTMC.png';



export default function BatikIndex({ user, batikData, title, members, batikDescription }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [imageName, setImageName] = useState('');
    const [customName, setCustomName] = useState('');
    const [newBatik, setNewBatik] = useState({
        code_batik: '',
        name: '',
        price: '',
        stock: '',
        description: '',
        image: null,
        motif_creator: '',
        bricklayer_name: '',
        production_year: '',
        materials: '',
        color_materials: '',
        coordinate: '',
        member_id: '',


    });
    const [imagePreview, setImagePreview] = useState(null);
    const [filteredBatikData, setFilteredBatikData] = useState(batikData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setNewBatik((prevState) => ({
            ...prevState,
            [name]: name === "code_batik" 
                ? value 
                : name === "price"
                ? value.replace(/\./g, "") 
                : value, 
        }));
    };

    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageName(file.name);
            setNewBatik((prevState) => ({
                ...prevState,
                image: file, 
            }));
        }
    };

    useEffect(() => {
        setFilteredBatikData(
            batikData.filter((batik) =>
                batik.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                batik.code_batik.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, batikData]);


    const filteredData = filteredBatikData.filter((batik) =>
        (batik.name && batik.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (batik.code_batik && batik.code_batik.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const cleanedPrice = newBatik.price && typeof newBatik.price === 'string' && newBatik.price.trim() !== ''
            ? parseFloat(newBatik.price.replace(/\./g, ""))
            : 0;
        
        
            // Validasi harga apakah valid (angka dan lebih besar dari 0)
            if (isNaN(cleanedPrice) || cleanedPrice <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Validasi',
                    text: 'Harga harus berupa angka valid dan lebih besar dari 0.',
                });
                return;
            }
    
            // Validasi nama batik
            if (!newBatik.name || newBatik.name.trim() === '') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Validasi',
                    text: 'Nama batik tidak boleh kosong.',
                });
                return;
            }
    
            const formData = new FormData();
            formData.append("price", cleanedPrice);
            formData.append("code_batik", `M${newBatik.code_batik}`);
    
            Object.keys(newBatik).forEach((key) => {
                if (newBatik[key]) {
                    formData.append(key, newBatik[key]);
                }
            });
    
            // Jika nama batik adalah 'custom', gunakan customName
            if (newBatik.name === 'custom' && customName) {
                formData.set("name", customName);
            }
    
            let response;
    
            // Jika mode edit, lakukan update
            if (isEditMode && newBatik.id) {
                response = await axios.post(`/batik/${newBatik.id}`, formData);
                const updatedImage = response.data.batik.image;
    
                setFilteredBatikData((prevData) => {
                    return prevData.map((item) =>
                        item.id === newBatik.id
                            ? {
                                ...item,
                                ...newBatik,
                                price: cleanedPrice,
                                image: updatedImage || item.image,
                            }
                            : item
                    );
                });
    
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data.message,
                });
            } else {
                // Jika mode tambah, lakukan insert
                response = await axios.post('/batik', formData);
                setFilteredBatikData((prevData) => {
                    const newData = [
                        ...prevData,
                        {
                            ...response.data.batik,
                            price: cleanedPrice,
                            image: response.data.batik.image || '',
                            qr_code: response.data.batik.qr_code || {},
                        },
                    ];
                    return newData;
                });
    
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data.message,
                });
            }
    
            // Menutup modal dan mereset form
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
    
            if (error.response && error.response.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: errorMessages || 'Tidak dapat memproses permintaan.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal mengirimkan data ke server.',
                });
            }
        }
    };


    const handleEditClick = (id) => {
        const selectedBatik = filteredBatikData.find((item) => item.id === id);
        if (selectedBatik) {
            setNewBatik({
                id: selectedBatik.id,
                code_batik: selectedBatik.code_batik || '',
                name: selectedBatik.name || '',
                price: selectedBatik.price ? selectedBatik.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '', 
                stock: selectedBatik.stock || '',
                description: selectedBatik.description || '',
                image: '', 
                motif_creator: selectedBatik.motif_creator || '',
                bricklayer_name: selectedBatik.bricklayer_name || '',
                production_year: selectedBatik.production_year || '',
                materials: selectedBatik.materials || '',
                color_materials: selectedBatik.color_materials || '',
                coordinate: selectedBatik.coordinate || '',
                member_id: selectedBatik.member_id || '', 
            });
    
            const selectedMember = members.find((member) => 
                parseInt(member.id) === parseInt(selectedBatik.member_id)
            );
    
            if (selectedMember) {
                setNewBatik((prev) => ({
                    ...prev,
                    store_name: selectedMember.store_name || '',
                    email: selectedMember.email || '',
                    member_address: selectedMember.address || '',
                }));
            } else {
                console.warn('Member not found for the given member_id.');
            }

            if (selectedBatik.image) {
                setImagePreview(`/storage/${selectedBatik.image}`); 
            } else {
                setImagePreview(null);
            }
    
            setImageName(selectedBatik.image ? selectedBatik.image.split('/').pop() : '');
    
            setIsModalOpen(true);
            setIsEditMode(true);
        } else {
            console.warn('Batik not found for the given ID.');
        }
    };
    


    const handleDeleteClick = async (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data batik ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(`/batik/delete/${id}`, {
                        _token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    });
                    setFilteredBatikData((prevData) => prevData.filter((batik) => batik.id !== id));
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: response.data.message,
                    });
                } catch (error) {
                    console.error('Error deleting data:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Terjadi Kesalahan',
                        text: 'Data batik tidak dapat dihapus.',
                    });
                }
            }
        });
    };
    
    const handleCancel = () => {
        setIsModalOpen(false); 
        setNewBatik({
            member_id: "",
            store_name: "",
            member_address: "",
            email: "",
            code_batik: "",
            name: "",
            price: "",
            stock: "",
            motif_creator: "",
            bricklayer_name: "",
            production_year: "",
            materials: "",
            color_materials: "",
            coordinate: "",
            description: "",
            image: null,
        }); 
        setImagePreview(null);
        setIsEditMode(false);

    };
    

    
    const resetForm = () => {
        setNewBatik({
            code_batik: '',
            name: '',
            price: '',
            stock: '',
            description: '',
            image: null,
            motif_createor: '',
            bricklayer_name: '',
            production_year: '',
            materials: '',
            color_materials: '',
            coordinate: '',
            member_id: '',

        });
        setImagePreview(null);
    };

    const handleSelectChange = (selectedOption) => {
        if (selectedOption.value === 'custom') {
            setNewBatik((prev) => ({
                ...prev,
                name: 'custom',
                description: '', 
            }));
        } else {
            const selectedBatik = batikDescription.find(
                (batik) => batik.name === selectedOption.label
            );
            setNewBatik((prev) => ({
                ...prev,
                name: selectedOption.label,
                description: selectedBatik ? selectedBatik.description : '', 
            }));
        }
    };
    
    
    const options = batikDescription.map((desc) => ({
        value: desc.name,
        label: desc.name,
    }));
    
    // Add a custom option to allow user input
    options.push({ value: 'custom', label: 'Custom (Input Manual)' });


    const formatToRupiah  = (value) => {
        value = value.replace(/\D/g, "");
        
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    

    const handlePriceChange = (e) => {
        const formattedPrice = e.target.value.replace(/\D/g, ""); 
        const priceWithRupiah = formatToRupiah(formattedPrice); 
        setNewBatik((prev) => ({
            ...prev,
            price: priceWithRupiah, 
        }));
    };
    
    

    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">{title}</h2>}>
            <Head title={title} />

            <div className="py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-6 rounded-lg shadow-md">
                        <div className="relative w-full sm:w-1/4"> 
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                            <input
                                type="text"
                                placeholder="Cari batik..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-3 pl-10 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black text-lg"
                                >
                                    <FiXCircle />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 sm:mt-0 sm:ml-4 bg-blue-600 text-white py-2 px-5 rounded-lg flex items-center hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                        >
                            <FiPlus className="mr-2 text-lg" />
                            <span className="text-sm font-medium">Tambah Batik</span>
                        </button>
                    </div>
                    {/* Grid untuk Card */}
                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredData.map((batik, index) => (
                                <div
                                    key={batik.id || index}
                                    className="relative p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >

                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{batik.name}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-bold">Deskripsi:</span> 
                                        <span className="block max-w-xs" title={batik.description}>
                                            {batik.description.length > 150 ? `${batik.description.slice(0, 150)}...` : batik.description}
                                        </span>
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                                            Rp {parseInt(batik.price).toLocaleString('id-ID')}
                                        </h3>
                                    </div>


                                    <div className="flex items-center justify-between mb-2 mt-4">
                                        <div className="text-sm font-bold text-gray-800">
                                            {batik.code_batik.split('').map((char, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block w-6 h-6 mr-1 text-center bg-gray-200 rounded-full"
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                        </div>

                                    </div>

                                    <div className="relative">
                                        {batik.image && (
                                            <img
                                                src={`/storage/${batik.image}`} 
                                                alt={batik.name}
                                                className="w-full h-40 object-cover rounded-lg shadow-sm mb-4 mt-2"
                                            />
                                        )}
                                    </div>

                                    <div className="mt-4 flex justify-between items-center gap-2">
                                        {/* Tombol Edit */}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-blue-600 hover:shadow-md transition-all duration-200 ease-in-out"
                                            onClick={() => handleEditClick(batik.id)}
                                            aria-label="Edit Data"
                                        >
                                            <FiEdit className="mr-2 text-base" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>

                                        {/* Tombol Hapus */}
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-red-600 hover:shadow-md transition-all duration-200 ease-in-out"
                                            onClick={() => handleDeleteClick(batik.id)}
                                            aria-label="Hapus Data"
                                        >
                                            <FiTrash className="mr-2 text-base" />
                                            <span className="text-sm font-medium">Hapus</span>
                                        </button>

                                        {batik.qr_code && (
                                        <button
                                            onClick={async () => {
                                            try {
                                                const canvas = document.createElement("canvas");
                                                const ctx = canvas.getContext("2d");

                                                // Set ukuran canvas
                                                canvas.width = 250;
                                                canvas.height = 350;

                                                // Background putih
                                                ctx.fillStyle = "#ffffff";
                                                ctx.fillRect(0, 0, canvas.width, canvas.height);

                                                // Fungsi memuat gambar
                                                const loadImage = (src) => {
                                                return new Promise((resolve, reject) => {
                                                    const img = new Image();
                                                    img.crossOrigin = "anonymous";
                                                    img.src = src;
                                                    img.onload = () => resolve(img);
                                                    img.onerror = () => reject(`Gagal memuat gambar dari ${src}`);
                                                });
                                                };

                                                // Ambil logo dinamis
                                                const memberLogo = batik.member?.image ? `/storage/${batik.member.image}` : defaultLogo;
                                                console.log('Member Logo:', memberLogo);

                                                // Muat semua gambar secara paralel
                                                const [btmcImage, igiImage, memberImage, qrImage] = await Promise.all([
                                                loadImage(btmcLogo),
                                                loadImage(igiLogo),
                                                loadImage(memberLogo),
                                                loadImage(`data:image/svg+xml;base64,${batik.qr_code}`),
                                                ]);

                                                // Gambar logo
                                                const logoSize = 40;
                                                ctx.drawImage(btmcImage, 55, 20, logoSize, logoSize);
                                                ctx.drawImage(igiImage, 105, 20, logoSize, logoSize);
                                                ctx.drawImage(memberImage, 155, 20, logoSize, logoSize);

                                                // Gambar QR Code
                                                const qrSize = 100;
                                                ctx.drawImage(qrImage, (canvas.width - qrSize) / 2, 100, qrSize, qrSize);

                                                // Tambahkan teks informasi
                                                ctx.font = "12px Arial";
                                                ctx.fillStyle = "#333333";
                                                ctx.textAlign = "left";

                                                const textStartY = 240;
                                                const lineSpacing = 18;

                                                ctx.fillText(`Nama Motif: ${batik.name}`, 20, textStartY);
                                                ctx.fillText(`Jenis Produk: ${batik.materials}`, 20, textStartY + lineSpacing);
                                                ctx.fillText(`Harga: Rp ${batik.price.toLocaleString("id-ID")}`, 20, textStartY + lineSpacing * 2);

                                                ctx.textAlign = "center";
                                                ctx.fillText("Kode Sertifikasi IG Merawit", canvas.width / 2, canvas.height - 30);
                                                ctx.font = "10px Arial";
                                                ctx.fillText(batik.code_batik, canvas.width / 2, canvas.height - 15);

                                                // Tambahkan border
                                                ctx.strokeStyle = "#cccccc";
                                                ctx.lineWidth = 2;
                                                ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

                                                // Unduh gambar sebagai PNG
                                                canvas.toBlob(
                                                (blob) => {
                                                    if (blob) {
                                                    const url = URL.createObjectURL(blob);
                                                    const link = document.createElement("a");
                                                    link.href = url;
                                                    link.download = `batik-${batik.code_batik}-qr.png`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.remove();
                                                    URL.revokeObjectURL(url);
                                                    } else {
                                                    throw new Error("Gagal mengonversi canvas ke blob.");
                                                    }
                                                },
                                                "image/png",
                                                1.0
                                                );
                                            } catch (error) {
                                                console.error("Error:", error);
                                                Swal.fire({
                                                icon: "error",
                                                title: "Error",
                                                text: "Gagal mengunduh QR Code. Silakan coba lagi.",
                                                });
                                            }
                                            }}
                                            className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-600 hover:shadow-md transition-all duration-200 ease-in-out group relative"
                                            aria-label="Download QR Code"
                                        >
                                            <FiDownload className="text-base" />
                                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            Download
                                            </span>
                                        </button>
                                        )}


                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <p>Data tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>


            {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto transition-all ease-in-out duration-300 relative">
                        
                            {/* Main Header */}
                            <div className="flex items-center justify-center mb-8 pt-2"> 
                                <h1 className="text-2xl font-black text-gray-700">
                                    FORMULIR DATA IG BATIK TULIS MERAWIT
                                </h1>
                            </div>

                            {/* Close Icon */}
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                            >
                                <FiX className="text-2xl" />
                            </button>

                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div className="flex items-center space-x-2">
                                    <FiUser className="text-2xl text-blue-500" />
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {isEditMode ? 'Edit Data Member' : 'Tambah Data Member'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 transition"
                                    onClick={handleCancel}
                                >
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Nama Member */}
                                <div>
                                    <label htmlFor="member_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Anggota MPIG-BTMC
                                    </label>
                                    <select
                                        name="member_id"
                                        required
                                        value={newBatik.member_id || ""}
                                        onChange={(e) => {
                                            const selectedMember = members.find(
                                                (member) => member.id.toString() === e.target.value
                                            );
                                            handleInputChange(e);
                                            if (selectedMember) {
                                                setNewBatik((prev) => ({
                                                    ...prev,
                                                    store_name: selectedMember.store_name,
                                                    member_address: selectedMember.address,
                                                    email: selectedMember.email,
                                                }));
                                            }
                                        }}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Pilih Anggota</option>
                                        {members.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Nama Merk (Toko) */}
                                <div>
                                    <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Merek (Toko)
                                    </label>
                                    <input
                                        type="text"
                                        id="store_name"
                                        name="store_name"
                                        value={newBatik.store_name || ""}
                                        readOnly
                                        className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                                        required
                                    />
                                </div>

                                {/* Email Member */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={newBatik.email || ""}
                                        readOnly
                                        className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                                        required
                                    />
                                </div>

                                {/* Alamat Member */}
                                <div>
                                    <label htmlFor="member_address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat Anggota
                                    </label>
                                    <textarea
                                        id="member_address" 
                                        name="member_address"
                                        value={newBatik.member_address || ""}
                                        readOnly
                                        className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Header Data Batik */}
                            <div className="flex items-center justify-between border-b pb-3 mb-4 mt-4">
                                <div className="flex items-center space-x-2">
                                    <FiTag className="text-2xl text-blue-500" />
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {isEditMode ? 'Edit Data Batik' : 'Tambah Data Batik'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 transition"
                                    onClick={handleCancel}
                                >
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                               {/* Batik Fields */}
                                <div>
                                    <label htmlFor="code_batik" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kode Batik Merawit
                                    </label>
                                    <input
                                        type="text"
                                        id="code_batik"
                                        name="code_batik"
                                        value={`M${newBatik.code_batik.replace(/^M/, '')}`}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Motif
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            id="name"
                                            name="name"
                                            value={options.find((option) => option.value === newBatik.name)}
                                            onChange={handleSelectChange}
                                            options={[
                                                ...options
                                                    .filter((option) => option.value !== 'custom')
                                                    .sort((a, b) => a.label.localeCompare(b.label)),
                                                options.find((option) => option.value === 'custom'),
                                            ]}
                                            required
                                            className="w-full"
                                        />
                                        {newBatik.name === 'custom' && (
                                            <input
                                                type="text"
                                                id="customName"
                                                name="customName"
                                                value={customName}
                                                onChange={(e) => setCustomName(e.target.value)}
                                                placeholder="Masukkan Nama Batik"
                                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="production_year" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun Produksi
                                    </label>
                                    <input
                                        type="number"
                                        id="production_year"
                                        name="production_year"
                                        value={newBatik.production_year || ""}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                    <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Harga
                                    </label>
                                    <input
                                        type="text"  
                                        id="price"
                                        name="price"
                                        value={newBatik.price || ""}
                                        onChange={handlePriceChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="motif_creator" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Pembuat Motif
                                    </label>
                                    <input
                                        type="text"
                                        id="motif_creator"
                                        name="motif_creator"
                                        value={newBatik.motif_creator || ""}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bricklayer_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tukang Penembok
                                    </label>
                                    <input
                                        type="text"
                                        id="bricklayer_name"
                                        name="bricklayer_name"
                                        value={newBatik.bricklayer_name || ""}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bahan Baku Kain
                                    </label>
                                    <select
                                        id="materials"
                                        name="materials"
                                        value={newBatik.materials || ""}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Bahan Baku Kain</option>
                                        <option value="Kain Katun Primisima">Kain Katun Primisima</option>
                                        <option value="Kain Katun Kereta Kencana Sintetis">Kain Katun Kereta Kencana Sintetis</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="color_materials" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bahan Pewarna
                                    </label>
                                    <select
                                        id="color_materials"
                                        name="color_materials"
                                        value={newBatik.color_materials || ""}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Bahan Pewarna</option>
                                        <option value="Sintetis">Sintetis</option>
                                        <option value="Pewarna Alami">Pewarna Alami</option>
                                    </select>
                                </div>
                                 {/* Gambar */}
                                <div>
                                    <label htmlFor="image" className="block text-sm font-semibold mb-2">
                                        Gambar
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleImageChange}
                                        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
                                        // required
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                <label htmlFor="color_materials" className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi Motif Batik
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newBatik.description || ''}
                                        onChange={handleInputChange}
                                        className={`p-3 border border-gray-300 rounded-lg w-full ${
                                            newBatik.name !== 'custom' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                                        }`}
                                        readOnly={newBatik.name !== 'custom'}
                                        rows="4"
                                        required
                                    />

                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end mt-6 space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-gray-600 transition-colors"
                                    onClick={handleCancel}
                                >
                                    <FiX className="mr-2" /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                                >
                                    <FiSave className="mr-2" /> {isEditMode ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}









        </AuthenticatedLayout>
    );
}
