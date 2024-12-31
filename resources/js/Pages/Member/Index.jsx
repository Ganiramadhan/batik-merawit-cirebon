import {  useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as XLSX from "xlsx"; 
import btmcLogo from '../../../images/BTMC.png';
import igiLogo from '../../../images/IGI.png';
import defaultLogo from '../../../images/newBTMC.png';
import qrBackgroundMember from '../../../images/backgroundMember.png';
import { 
    FiEdit, FiTrash, FiPlus, FiUser, FiX, FiSave, FiSearch, FiChevronLeft, FiChevronRight, FiInfo, 
    FiUsers, FiXCircle, FiLoader, FiPrinter} from 'react-icons/fi';

import { CiBarcode, CiUser ,CiLocationOn, CiMail, CiPhone, CiHome  } from "react-icons/ci";
import { PiStorefrontThin } from "react-icons/pi";


export default function MemberData({ user, title, members }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [imageName, setImageName] = useState('');
    const [newMember, setNewMember] = useState({
        member_number: '',
        name: '',
        place_of_birth: '',
        gender: '',
        employees: '',
        store_name: '',
        email: '',
        phone_number: '',
        address: '',
        image:null,
    });
    
    
    const [filteredMemberData, setFilteredMemberData] = useState(members);

    const exportMemberData = () => {
        setIsSubmitting(true);
    
        // Check if members data is empty
        if (members.length === 0) {
            setIsSubmitting(false);
            Swal.fire({
                icon: "warning",
                title: "Data Kosong",
                text: "Tidak ada data yang dapat diekspor.",
            });
            return;
        }
    
        setTimeout(() => {
            const dataToExport = members.map(({ created_at, updated_at, image, ...rest }) => ({
                "Nomor Anggota": rest.member_number,
                "Nama": rest.name,
                "Tempat Tanggal Lahir": rest.place_of_birth,
                "Jenis Kelamin": rest.gender,
                "Jumlah Karyawan": rest.employees,
                "Nama Toko": rest.store_name,
                "Email": rest.email,
                "Nomor Telepon": rest.phone_number,
                "Alamat": rest.address,
            }));
    
            // Create worksheet from the data
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data Member");
    
            // Export the Excel file
            XLSX.writeFile(workbook, "data_member.xlsx");
    
            setIsSubmitting(false);
            Swal.fire({
                icon: "success",
                title: "Berhasil Ekspor",
                text: "Data telah berhasil diekspor.",
            });
        }, 1000);
    };
    
    

    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageName(file.name); 
            setNewMember((prevState) => {
                const updatedState = {
                    ...prevState,
                    image: file,       
                };
                return updatedState;
            });
        }
    };
    
    
    const handleEditClick = (id) => {
        const member = filteredMemberData.find((member) => member.id === id);
        if (member) {
            const [place, date] = member.place_of_birth ? member.place_of_birth.split(',') : ['', ''];
            
            setNewMember({
                ...member,
                place_of_birth_temp: place?.trim() || '', 
                place_of_birth_date: date?.trim() || '', 
                gender: member.gender || '',
                imagePreview: member.image ? `/storage/${member.image}` : '',  
            });
            setImagePreview(member.image ? `/storage/${member.image}` : ''); 
            setIsEditMode(true);
            setIsModalOpen(true);
        } else {
            console.error('Member not found');
        }
    };
    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation for image when not in edit mode
        if (!isEditMode && !newMember.image) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation',
                text: 'Image cannot be empty.',
            });
            return;
        }
    
        // Validate image size (max 2 MB)
        if (newMember.image && newMember.image.size > 2 * 1024 * 1024) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation',
                text: 'Ukuran gambar tidak boleh lebih dari 2 MB.',
            });
            return;
        }
    
        // Prepare form data
        const formData = new FormData();
        for (const key in newMember) {
            formData.append(key, newMember[key]);
        }
    
        setIsSubmitting(true);
        try {
            let response;
    
            // Edit mode (update)
            if (isEditMode) {
                response = await axios.post(`/member/${newMember.id}`, formData);
    
                if (response.status === 200 || response.status === 204) {
                    const updatedImage = response?.data?.member?.image;
                    setFilteredMemberData((prevData) => {
                        return prevData.map((item) =>
                            item.id === newMember.id
                                ? {
                                    ...item,
                                    ...newMember,
                                    image: updatedImage || item.image,
                                    qr_code: response.data.member.qr_code || {},
                                }
                                : item
                        );
                    });
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                    });
                } else {
                    throw new Error('Failed to update member');
                }
            } else {
                // Add new member
                response = await axios.post('/member', formData);
                setFilteredMemberData((prevData) => [
                    ...prevData,
                    {
                        ...response.data.member,
                        image: response.data.member.image || '',
                        qr_code: response.data.member.qr_code || {},
    
                    },
                ]);
    
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });
            }
    
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Failed to submit data to the server.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    


    
    const filteredData = filteredMemberData.filter((member) => {
        const searchQueryLower = searchQuery.toLowerCase();
        return Object.values(member)
            .map(value => String(value).toLowerCase())
            .some(value => value.includes(searchQueryLower));
    });
    

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value)); 
        setCurrentPage(1);  
    };

    const handlePageChange = (page) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages; 
        setCurrentPage(page);
    };
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);





    // Handle delete
    const handleDeleteClick = async (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data member ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(`/member/delete/${id}`, {
                        _token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    });
                    setFilteredMemberData((prevData) => prevData.filter((members) => members.id !== id));

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
                        text: 'Data perajin tidak dapat dihapus.',
                    });
                }
            }
        });
    };
        

    const handleDetailClick = (id) => {
        const memberData = filteredData.find((member) => member.id === id);
        if (memberData) {
            setSelectedMember(memberData);
            setIsDetailModalOpen(true);
        } else {
            console.log('Data tidak ditemukan');
        }
    };


    // Function to format the date to DD-MM-YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };





    // Handle cancel modal
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setImagePreview(null);
        resetForm();
    };

    const resetForm = () => {
        setNewMember({
            member_number: '',
            name: '',
            place_of_birth: '',
            gender: '',
            employees: '',
            store_name: '',
            email: '',
            phone_number: '',
            address: ''
        });
        setImagePreview(null);
    };



    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">{title}</h2>}>
            <Head title={title} />

            <div className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            {/* Search and Add Member Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari anggota..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-3 pl-10 pr-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all hover:shadow-md hover:border-blue-400"
                        />
                        <div className="absolute top-0 left-0 flex items-center h-full pl-3">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute top-0 right-0 flex items-center h-full pr-3 text-gray-400 hover:text-black text-lg"
                            >
                                <FiXCircle className="text-lg" />
                            </button>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        {/* Add Member Button */}
                        <button
                            onClick={() => {
                                setIsEditMode(false);
                                setNewMember({ name: '', email: '', phone_number: '', address: '', image: '' });
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105 text-sm"
                        >
                            <FiPlus className="mr-2" />
                            Tambah Member
                        </button>

                        {/* Export Data Button */}
                        <button
                            onClick={exportMemberData}
                            className={`bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <FiLoader className="animate-spin text-lg" />
                            ) : (
                                <FiPrinter className="text-lg" />
                            )}
                    </button>
                    </div>
                </div>


                {/* Table for Member Data */}
                <div className="overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full text-sm border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <tr>
                                    {/* <th className="px-6 py-4 text-sm font-semibold text-left border border-gray-300">#</th> */}
                                    <th className="px-6 py-4 text-sm font-semibold text-left border border-gray-300">Nomor MPIG-BTMC</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left border border-gray-300">Anggota MPIG-BTMC</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left border border-gray-300">Nama Toko</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left border border-gray-300">Nomor Telepon</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left border border-gray-300">Alamat</th>
                                    {/* <th className="px-6 py-4 text-sm font-semibold text-left">Logo</th> */}
                                    <th className="px-6 py-4 text-sm font-semibold text-center border border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length > 0 ? (
                                    currentData.map((member, index) => (
                                    <tr
                                            key={member.id}
                                            className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100 transition-all`}
                                            >                             
                                        {/* <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </td> */}
                                        <td className="px-6 py-4 text-sm text-gray-800 border border-gray-300">{member.member_number}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border border-gray-300">{member.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border border-gray-300">{member.store_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border border-gray-300">{member.phone_number}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 border border-gray-300">
                                            <div className="relative">
                                                <span className="truncate max-w-xs" title={member.address}>
                                                    {member.address.length > 50 ? `${member.address.slice(0, 50)}...` : member.address}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                        <div className="flex justify-center space-x-2">
                                            {/* Tombol Edit */}
                                            <button
                                            type="button"
                                            className="bg-blue-500 text-white p-1 rounded-md flex items-center justify-center hover:bg-blue-600 transition-all shadow-sm relative group"
                                            onClick={() => handleEditClick(member.id)}
                                            >
                                            <FiEdit className="text-lg m-1" />
                                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Edit
                                            </span>
                                            </button>

                                            {/* Tombol Detail */}
                                            <button
                                                className="bg-gray-500 text-white p-1 rounded-md flex items-center justify-center hover:bg-gray-600 transition-all shadow-sm relative group"
                                                onClick={() => handleDetailClick(member.id)}
                                                >
                                                <FiInfo className="text-lg m-1" />
                                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    Detail
                                                </span>
                                            </button>

                                            {/* Tombol Hapus */}
                                            <button
                                            className="bg-red-500 text-white p-1 rounded-md flex items-center justify-center hover:bg-red-600 transition-all shadow-sm relative group"
                                            onClick={() => handleDeleteClick(member.id)}
                                            >
                                            <FiTrash className="text-lg m-1" />
                                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Hapus
                                            </span>
                                            </button>
                                            
                                            {member.qr_code && (
                                                <button
                                                    onClick={async (e) => {
                                                        const button = e.target.closest("button");
                                                        if (button.disabled) return;

                                                        button.disabled = true;

                                                        const scale = 10;
                                                        const width = 450;
                                                        const height = 300;
                                                        const logoSize = 55;
                                                        const qrSize = 50; // Ukuran QR Code diperkecil

                                                        try {
                                                            const canvas = document.createElement("canvas");
                                                            const ctx = canvas.getContext("2d");

                                                            canvas.width = width * scale;
                                                            canvas.height = height * scale;
                                                            ctx.scale(scale, scale);
                                                            ctx.imageSmoothingEnabled = false;

                                                            const loadImage = (src) => {
                                                                return new Promise((resolve, reject) => {
                                                                    const img = new Image();
                                                                    img.crossOrigin = "anonymous";
                                                                    img.src = src;
                                                                    img.onload = () => resolve(img);
                                                                    img.onerror = () => reject(`Gagal memuat gambar: ${src}`);
                                                                });
                                                            };

                                                            const memberLogo = member?.image
                                                                ? `/storage/${member.image}`
                                                                : defaultLogo;

                                                            const [btmcImage, igiImage, memberImage, qrImage, background] =
                                                                await Promise.all([
                                                                    loadImage(btmcLogo),
                                                                    loadImage(igiLogo),
                                                                    loadImage(memberLogo),
                                                                    loadImage(`data:image/svg+xml;base64,${member.qr_code}`),
                                                                    loadImage(qrBackgroundMember),
                                                                ]);

                                                            // Gambar background
                                                            ctx.drawImage(background, 0, 0, width, height);

                                                            // Gambar logo IGI dan BTMC
                                                            const logoOffset = (width - logoSize * 3 - 10) / 2;
                                                            ctx.drawImage(btmcImage, logoOffset, 20, logoSize, logoSize);
                                                            ctx.drawImage(igiImage, logoOffset + logoSize + 5, 20, logoSize, logoSize);

                                                            // Penyesuaian gambar member
                                                            let memberImageWidth, memberImageHeight;

                                                            const aspectRatio = memberImage.width / memberImage.height;

                                                            if (aspectRatio > 1) {
                                                                memberImageWidth = logoSize * 1.8;
                                                                memberImageHeight = (memberImage.height / memberImage.width) * memberImageWidth;
                                                                if (memberImageHeight < logoSize) {
                                                                    memberImageHeight = logoSize;
                                                                    memberImageWidth = memberImageHeight * aspectRatio;
                                                                }

                                                                if (memberImageWidth > logoSize * 2) {
                                                                    memberImageWidth = logoSize * 1.9;
                                                                    memberImageHeight = (memberImage.height / memberImage.width) * memberImageWidth;
                                                                }

                                                                ctx.drawImage(
                                                                    memberImage,
                                                                    logoOffset + (logoSize + 5) * 2,
                                                                    20 + (logoSize - memberImageHeight) / 2,
                                                                    memberImageWidth,
                                                                    memberImageHeight
                                                                );
                                                            } else {
                                                                memberImageHeight = logoSize * 1.1;
                                                                memberImageWidth = (memberImage.width / memberImage.height) * memberImageHeight;
                                                                if (memberImageWidth < logoSize * 0.7) {
                                                                    memberImageWidth = logoSize * 0.7;
                                                                    memberImageHeight = memberImageWidth / aspectRatio;
                                                                }

                                                                if (memberImageHeight > logoSize * 1.2) {
                                                                    memberImageHeight = logoSize * 1.15;
                                                                    memberImageWidth = (memberImage.width / memberImage.height) * memberImageHeight;
                                                                }

                                                                ctx.drawImage(
                                                                    memberImage,
                                                                    logoOffset + (logoSize + 5) * 2 + (logoSize - memberImageWidth) / 2,
                                                                    20,
                                                                    memberImageWidth,
                                                                    memberImageHeight
                                                                );
                                                            }

                                                            // Tambahkan teks informasi utama
                                                            const textYOffset = 100;
                                                            ctx.fillStyle = "#333333";
                                                            ctx.textAlign = "center";
                                                            ctx.font = `${4 * scale}px font-playfair`;
                                                            ctx.fillText(member.store_name || "-", width / 2, textYOffset + 30);
                                                            ctx.font = `${1.5 * scale}px sans-serif`;
                                                            ctx.fillText("Menyediakan Batik Tulis Merawit Cirebon", width / 2, textYOffset + 50);
                                                            ctx.font = `${1.2 * scale}px arial`;
                                                            ctx.fillText("KUALITAS INDIKASI GEOGRAFIS (IG)", width / 2, textYOffset + 70);

                                                            // Tambahkan nomor anggota dan alamat
                                                            const footerYOffset = height - 20;
                                                            ctx.font = `${1.3 * scale}px sans-serif`;
                                                            ctx.textAlign = "center";
                                                            ctx.fillText(`No. Anggota MPIG: ${member.member_number || "-"}`, width / 2, footerYOffset - 55);
                                                            ctx.font = `${0.9 * scale}px Arial`;

                                                            const address = member.address || "-";
                                                            const wrapText = (text, maxWidth) => {
                                                                const words = text.split(" ");
                                                                const lines = [];
                                                                let currentLine = "";

                                                                words.forEach((word) => {
                                                                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                                                                    if (testLine.length > maxWidth) {
                                                                        lines.push(currentLine);
                                                                        currentLine = word;
                                                                    } else {
                                                                        currentLine = testLine;
                                                                    }
                                                                });

                                                                if (currentLine) lines.push(currentLine);

                                                                return lines;
                                                            };

                                                            const addressLines = wrapText(address, 40);
                                                            addressLines.forEach((line, index) => {
                                                                ctx.fillText(line, width / 2, footerYOffset - 40 + index * 15);
                                                            });

                                                            // Gambar QR Code di kanan bawah
                                                            const qrXOffset = width - qrSize - 30;
                                                            const qrYOffset = height - qrSize - 45;
                                                            ctx.drawImage(qrImage, qrXOffset, qrYOffset, qrSize, qrSize);

                                                            // Tambahkan border di sekitar QR Code
                                                            ctx.strokeStyle = "#FFA500";
                                                            ctx.lineWidth = 2;
                                                            ctx.strokeRect(qrXOffset - 5, qrYOffset - 5, qrSize + 10, qrSize + 10);

                                                            // Tambahkan border luar
                                                            ctx.strokeStyle = "#cccccc";
                                                            ctx.lineWidth = 1;
                                                            ctx.strokeRect(10, 10, width - 20, height - 20);

                                                            // Unduh gambar
                                                            canvas.toBlob((blob) => {
                                                                if (blob) {
                                                                    const url = URL.createObjectURL(blob);
                                                                    const link = document.createElement("a");
                                                                    link.href = url;
                                                                    link.download = `Member-${member.member_number || "qr"}.png`;
                                                                    link.click();
                                                                    URL.revokeObjectURL(url);

                                                                    Swal.fire({
                                                                        icon: "success",
                                                                        title: "Berhasil",
                                                                        text: "QR Code berhasil dicetak!",
                                                                    }).then(() => {
                                                                        button.disabled = false;
                                                                    });
                                                                }
                                                            }, "image/png");
                                                        } catch (error) {
                                                            console.error("Error:", error);
                                                            Swal.fire({
                                                                icon: "error",
                                                                title: "Error",
                                                                text: "Gagal mengunduh gambar. Silakan coba lagi.",
                                                            }).then(() => {
                                                                button.disabled = false;
                                                            });
                                                        }
                                                    }}
                                                    className="bg-gray-500 text-white py-2 px-2 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-600 hover:shadow-md transition-all duration-200 ease-in-out group relative"
                                                    aria-label="Print Qr Code"
                                                >
                                                    <FiPrinter className="text-base" />
                                                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        Print
                                                    </span>
                                                </button>
                                            )}


                                        </div>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-4 text-center text-gray-500 text-sm font-medium"
                                    >
                                        Tidak ada data yang tersedia.
                                    </td>
                                    </tr>
                                )}
                                </tbody>

                        </table>
                    </div>
                

                  {/* Pagination Controls */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                        <span className="text-sm text-gray-600">
                            Showing {currentData.length} of {filteredData.length} entries
                        </span>
                        {/* Dropdown for selecting the number of entries per page */}
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="px-2 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 ml-2"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <div className="flex items-center space-x-2 ml-auto"> 

                            {/* First Page Button */}
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-lg transition duration-200 ${
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                First
                            </button>

                            {/* Previous Page Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-lg transition duration-200 ${
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FiChevronLeft /> 
                            </button>

                            {/* Page Number Buttons */}
                            {Array.from({ length: totalPages }, (_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-lg transition duration-200 ${
                                            currentPage === page
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            {/* Next Page Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-lg transition duration-200 ${
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FiChevronRight />
                            </button>

                            {/* Last Page Button */}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-lg transition duration-200 ${
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                
                </div>
                    {/* No Data Message */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-12 text-gray-600 text-lg font-semibold">
                            No data found
                        </div>
                    )}
                </div>
            </div>


            <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all ${
                isDetailModalOpen ? 'opacity-100 visible z-50' : 'opacity-0 invisible z-0'
            }`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-lg transition-transform transform scale-100 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="border-b border-gray-200 mb-4 pb-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-700 text-center flex-grow">Detail Anggota</h2>
                </div>

                {/* Member Detail */}
                {selectedMember ? (
                    <div className="space-y-3 text-gray-700 text-sm">
                        {/* Gambar Logo Anggota */}
                        {selectedMember.image && (
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`/storage/${selectedMember.image}`}
                                    alt="Logo Anggota"
                                    className="w-24 h-auto "
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-3">
                            <CiBarcode className="text-blue-500 text-lg" />
                            <p>
                                <strong>Nomor Anggota MPIG-BTMC:</strong>{' '}
                                <span className="text-gray-900">{selectedMember.member_number}</span>
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <CiUser className="text-blue-500 text-lg" />
                            <p>
                                <strong>Nama Anggota MPIG-BTMC:</strong>{' '}
                                <span className="text-gray-900">{selectedMember.name}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <PiStorefrontThin className="text-blue-500 text-lg" />
                            <p>
                                <strong>Nama Merek (Toko):</strong>{' '}
                                <span className="text-gray-900">{selectedMember.store_name}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CiMail className="text-blue-500 text-lg" />
                            <p>
                                <strong>Email:</strong>{' '}
                                <span className="text-gray-900">{selectedMember.email}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CiPhone className="text-blue-500 text-lg" />
                            <p>
                                <strong>Nomor HP:</strong>{' '}
                                <span className="text-gray-900">{selectedMember.phone_number}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CiHome className="text-blue-500 text-lg" />
                            <p>
                                <strong>Tempat Tanggal Lahir:</strong>{' '}
                                <span className="text-gray-900">
                                    {selectedMember.place_of_birth
                                        ? `${selectedMember.place_of_birth.split(',')[0]}, ${formatDate(selectedMember.place_of_birth.split(',')[1].trim())}`
                                        : ''}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FiUsers className="text-blue-500 text-lg" />
                            <p>
                                <strong>Jumlah Pekerja:</strong>{' '}
                                <span className="text-gray-900">{selectedMember.employees}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CiLocationOn  className="text-blue-500 text-lg" />
                            <p>
                                <strong>Alamat:</strong>{' '}
                                <span className="text-gray-900">{selectedMember.address}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm text-center">Data tidak ditemukan</p>
                )}

                {/* Footer dengan Tombol Tutup */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-shadow shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex items-center space-x-2"
                    >
                        <FiXCircle className="text-sm" />
                        <span>Close</span>
                    </button>
                </div>
            </div>
        </div>



        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl transition-transform transform scale-95 overflow-y-auto max-h-[90vh]">
                    
                    {/* Main Header */}
                    <div className="flex items-center justify-center mb-8 pt-2"> 
                        <h1 className="text-2xl font-black text-gray-700">
                            FORMULIR DATA ANGGOTA BATIK TULIS MERAWIT
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

                    {/* Header Modal */}
                    <div className="flex items-center justify-between border-b pb-3 mb-4">
                        <div className="flex items-center space-x-2">
                            <FiUser className="text-2xl text-blue-500" />
                            <h3 className="text-xl font-semibold text-gray-800">
                                {isEditMode ? 'Edit Data Anggota' : 'Tambah Data Anggota'}
                            </h3>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Nama Member */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota MPIG-BTMC</label>
                                <input
                                    type="text"
                                    value={newMember.name || ''}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                         {/* Tempat dan Tanggal Lahir */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tempat dan Tanggal Lahir</label>
                                <div className="flex gap-4">
                                    {/* Input untuk Tempat Lahir */}
                                    <input
                                        type="text"
                                        placeholder="Tempat Lahir"
                                        value={newMember.place_of_birth_temp || ''}
                                        onChange={(e) => {
                                            const tempPlace = e.target.value;
                                            setNewMember((prev) => ({
                                                ...prev,
                                                place_of_birth_temp: tempPlace,
                                                place_of_birth: `${tempPlace}, ${prev.place_of_birth_date || ''}`.trim(),
                                            }));
                                        }}
                                        className="p-3 border border-gray-300 rounded-lg w-1/2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {/* Input untuk Tanggal Lahir */}
                                    <input
                                        type="date"
                                        value={newMember.place_of_birth_date || ''}
                                        onChange={(e) => {
                                            const birthDate = e.target.value;
                                            setNewMember((prev) => ({
                                                ...prev,
                                                place_of_birth_date: birthDate,
                                                place_of_birth: `${prev.place_of_birth_temp || ''}, ${birthDate}`.trim(),
                                            }));
                                        }}
                                        className="p-3 border border-gray-300 rounded-lg w-1/2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>


                            {/* Jenis Kelamin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select
                                    value={newMember.gender || ''}
                                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            {/* Nama Merk (Toko) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Merk (Toko)</label>
                                <input
                                    type="text"
                                    value={newMember.store_name || ''}
                                    onChange={(e) => setNewMember({ ...newMember, store_name: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newMember.email || ''}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Nomor Hp */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={newMember.phone_number || ''}
                                    onChange={(e) => setNewMember({ ...newMember, phone_number: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Jumlah Pekerja */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pekerja</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={newMember.employees || ''}
                                    onChange={(e) => setNewMember({ ...newMember, employees: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Alamat */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Toko</label>
                                <textarea
                                    value={newMember.address || ''}
                                    onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            {/* Image Toko */}
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                                />
                                {imagePreview || newMember.imagePreview ? ( 
                                    <div className="flex justify-center">
                                        <img
                                            src={imagePreview || newMember.imagePreview} 
                                            alt="Preview"
                                            className="w-48 h-auto"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-3">
                            {/* Cancel Button */}
                            <button
                                type="button"
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-gray-600 transition"
                                onClick={() => {
                                    resetForm();  
                                    setIsModalOpen(false); 
                                }}
                            >
                                <FiXCircle className="mr-2" />
                                Cancel
                            </button>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition disabled:bg-gray-300"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FiLoader className="mr-2 animate-spin" />
                                        {isEditMode ? 'Updating...' : 'Submitting...'}
                                    </>
                                ) : isEditMode ? (
                                    <>
                                        <FiEdit className="mr-2" />
                                        Update
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="mr-2" />
                                        Simpan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}




        </AuthenticatedLayout>
    );
}
