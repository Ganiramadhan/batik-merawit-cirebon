import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import { FiEdit, FiTrash, FiPrinter , FiPlus, FiX, FiSave , FiUser, FiTag,FiSearch, FiXCircle,FiLoader} from "react-icons/fi";
import btmcLogo from '../../../images/BTMC.png';
import igiLogo from '../../../images/IGI.png';
import defaultLogo from '../../../images/newBTMC.png';
import qrBackground from '../../../images/background.jpg';





export default function BatikIndex({ user, batikData, title, members, batikDescription, backLayers, motifCreators}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [imageName, setImageName] = useState('');
    const [customName, setCustomName] = useState('');
    const [customMaterial, setCustomMaterial] = useState("");
    const [customColorMaterial, setCustomColorMaterial] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newBatik, setNewBatik] = useState({
        code_batik: '',
        name: '',
        quality: '',
        description: '',
        image: null,
        motif_creator: '',
        bricklayer_name: '',
        production_year: '',
        materials: '',
        color_materials: '',
        member_id: '',
    });

    
    const exportBatikData = () => {
        setIsSubmitting(true); 
    
        // Check if batikData is empty
        if (batikData.length === 0) {
            setIsSubmitting(false);
            Swal.fire({
                icon: 'warning',
                title: 'Data Kosong',
                text: 'Tidak ada data batik yang dapat diekspor.',
            });
            return; 
        }
    
        setTimeout(() => {
            const dataToExport = batikData.map(({ created_at, updated_at, image, member, ...rest }) => rest);
    
            // Prepare the data with headers
            const dataWithHeaders = dataToExport.map(item => ({
                "Kode Batik": item.code_batik || '-',
                "Nama Batik": item.name || '-',
                "Kualitas": item.quality || '-',
                "Deskripsi": item.description || '-',
                "Pembuat Motif": item.motif_creator || '-',
                "Tukang Penembok": item.bricklayer_name || '-',
                "Tahun Produksi": item.production_year || '-',
                "Bahan Baku Kain": item.materials || '-',
                "Bahan Pewarna": item.color_materials || '-',
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(dataWithHeaders);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data Batik");
    
            // Export to Excel file
            XLSX.writeFile(workbook, "data_batik.xlsx");
    
            setIsSubmitting(false); 
            Swal.fire({
                icon: "success",
                title: "Berhasil Ekspor",
                text: "Data batik berhasil diekspor!",
            });
        }, 1000); 
    };
    
    


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

    const memberOptions = members.map((member) => ({
        value: member.id.toString(),
        label: member.name,
    }));
    

    const materialOptions = [
        { value: "Kain Katun Primisima", label: "Kain Katun Primisima" },
        { value: "Kain Katun Kereta Kencana", label: "Kain Katun Kereta Kencana" },
        { value: "custom", label: "Custom" },
    ];


    const colorMaterialsOption = [
        { value: "Sintetis", label: "Sintetis" },
        { value: "Pewarna Alami", label: "Pewarna Alami" },
        { value: "custom", label: "Custom" },
    ];


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
    


    const generateCodeBatik = () => {
        // Cari kode motif dari batikDescription
        const selectedMotif = batikDescription.find(
            (description) => description.name === newBatik.name
        );
        const motif = selectedMotif
        ? selectedMotif.code_batik.padStart(2, "0")
        : String(Math.floor(Math.random() * 99)).padStart(2, "0");
    
    
        const kualitas = newBatik.quality || "SB";
    
        // Cari member_number berdasarkan member_id
        const selectedMember = members.find(
            (member) => member.id === Number(newBatik.member_id)
        );
        

        const pemilik = selectedMember
            ? selectedMember.member_number.slice(-2).padStart(2, "0")
            : "00"; 
    
        // Cari motif_creator_number berdasarkan motif_creator
        const selectedMotifCreator = motifCreators.find(
            (creator) => creator.name === newBatik.motif_creator
        );
        const pembuat = selectedMotifCreator
            ? selectedMotifCreator.motif_creator_number.padStart(2, "0")
            : "00";
    
        // Cari backlayer_number berdasarkan bricklayer_name
        const selectedBackLayer = backLayers.find(
            (layer) => layer.name === newBatik.bricklayer_name
        );
        const penembok = selectedBackLayer
            ? selectedBackLayer.backlayer_number.padStart(2, "0")
            : "00";
    
        const tahun = newBatik.production_year
            ? newBatik.production_year.slice(-2)
            : new Date().getFullYear().toString().slice(-2);
    
        return `M${motif}${kualitas}${pemilik}${pembuat}${penembok}${tahun}`;
    };
    
    
    
    
    const setCustomField = (fieldName, customField, defaultFieldValue) => {
        if (customField) {
            return customField;
        } else if (newBatik[fieldName] && newBatik[fieldName] !== 'custom') {
            return newBatik[fieldName];
        }
        return defaultFieldValue;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isSubmitting) return;
    
        setIsSubmitting(true); 
    
        // Validasi Nama
        if (!newBatik.name || newBatik.name.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Validasi',
                text: 'Nama batik tidak boleh kosong.',
            });
            setIsSubmitting(false);
            return;
        }
    
        // Validasi Gambar pada saat tambah atau jika diubah
        if (!isEditMode && (!newBatik.image || newBatik.image === '')) {
            Swal.fire({
                icon: 'warning',
                title: 'Validasi',
                text: 'Gambar batik tidak boleh kosong.',
            });
            setIsSubmitting(false);
            return;
        }
        
        const generatedCode = generateCodeBatik();
        const formData = new FormData();
    
        formData.append("code_batik", generatedCode);
    
        // Handle custom fields
        formData.set("color_materials", setCustomField("color_materials", customColorMaterial, newBatik.color_materials));
        formData.set("name", setCustomField("name", customName, newBatik.name));
        formData.set(
            "materials",
            newBatik.materials === 'custom' ? customMaterial : newBatik.materials
        );
    
       // Kirim gambar jika ada
        if (newBatik.image) {
            formData.append('image', newBatik.image);
        }
    
        // Append other fields
        Object.keys(newBatik).forEach((key) => {
            if (newBatik[key] && !['name', 'materials', 'color_materials', 'image'].includes(key)) {
                formData.append(key, newBatik[key]);
            }
        });
        
        try {
            let response;
            if (isEditMode && newBatik.id) {
                response = await axios.post(`/batik/${newBatik.id}`, formData);
                const updatedImage = response.data.batik.image;
                setFilteredBatikData((prevData) =>
                    prevData.map((item) =>
                        item.id === newBatik.id
                            ? {
                                ...item,
                                ...newBatik,    
                                code_batik: generatedCode,
                                qr_code: response.data.batik.qr_code || {},
                                image: updatedImage || item.image,
                                name: newBatik.name === 'custom' ? customName : newBatik.name,
                                materials: newBatik.materials === 'custom' ? customMaterial : newBatik.materials,
                                color_materials: newBatik.color_materials === 'custom' ? customColorMaterial : newBatik.color_materials,
                                member: response.data.member || null,
                            }
                            : item
                    )
                );
            } else {
                response = await axios.post('/batik', formData);
                setFilteredBatikData((prevData) => [
                    ...prevData,
                    {
                        ...response.data.batik,
                        code_batik: generatedCode,
                        image: response.data.batik.image || '',
                        qr_code: response.data.batik.qr_code || {},
                        name: response.data.batik.name === 'custom' ? customName : newBatik.name,
                        materials: newBatik.materials === 'custom' ? customMaterial : newBatik.materials,
                        color_materials: newBatik.color_materials === 'custom' ? customColorMaterial : newBatik.color_materials,
                        member: response.data.member || null,
                    }
                ]);
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message,
            });
    
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
        } finally {
            setIsSubmitting(false); 
        }
    };
    
    
    
    
    const handleMaterialChange = (selectedOption) => {
        const isCustomMaterial = selectedOption.value === 'custom';
        setNewBatik((prev) => ({
            ...prev,
            materials: isCustomMaterial ? 'custom' : selectedOption.value,
        }));
    
        if (isCustomMaterial) {
            setCustomMaterial(newBatik.materials === 'custom' ? customMaterial : '');
        } else {
            setCustomMaterial('');
        }
    };


    
    const handleColorMaterialsChange = (selectedOption) => {
        const isCustomColorMaterials = selectedOption.value === 'custom';
    
        setNewBatik((prev) => ({
            ...prev,
            color_materials: selectedOption.value, 
        }));
    
        setCustomColorMaterial(isCustomColorMaterials ? '' : '');
    };
    
    
    
  // Convert motifCreators to options for React Select
    const motifCreatorOptions = motifCreators.map((motifCreator) => ({
        value: motifCreator.name,
        label: motifCreator.name,
    }));

    const handleMotifCreatorChange = (selectedOption) => {
        setNewBatik((prevState) => ({
            ...prevState,
            motif_creator: selectedOption ? selectedOption.value : '',
        }));
    };

    // Convert backLayers to options for React Select
    const backLayerOptions = backLayers.map((backLayer) => ({
        value: backLayer.name,
        label: backLayer.name,
    }));

    const handleBricklayerChange = (selectedOption) => {
        setNewBatik((prevState) => ({
            ...prevState,
            bricklayer_name: selectedOption ? selectedOption.value : '',
        }));
    };
        
    
    const handleSelectChange = (selectedOption) => {
        if (selectedOption.value === 'custom') {
            setNewBatik((prev) => ({
                ...prev,
                name: 'custom', 
                description: '',
            }));
            setCustomName('');
        } else {
            const selectedBatik = batikDescription.find(
                (batik) => batik.name === selectedOption.label
            );
            if (selectedBatik) {
                setNewBatik((prev) => ({
                    ...prev,
                    name: selectedOption.label,
                    description: selectedBatik.description,
                }));
            } else {
                // Jika nama motif tidak ada di batikDescription, set sebagai 'custom'
                setNewBatik((prev) => ({
                    ...prev,
                    name: 'custom', 
                    description: '',
                }));
                setCustomName('');
            }
        }
    };


    const handleEditClick = (id) => {
        const selectedBatik = filteredBatikData.find((item) => item.id === id);
        if (selectedBatik) {
            // console.log("Selected Batik:", selectedBatik);
    
            const selectedBatikDescription = batikDescription.find(
                (batik) => batik.name === selectedBatik.name
            );
    
            // Daftar predefined materials
            const predefinedMaterials = [
                "Kain Katun Primisima",
                "Kain Katun Kereta Kencana",
            ];
    
            // Daftar predefined color materials
            const predefinedColorMaterials = [
                "Sintetis",
                "Pewarna Alami",
            ];
    
            // Tentukan apakah materials adalah custom
            const isCustomMaterial = !predefinedMaterials.includes(selectedBatik.materials);
            const isCustomColorMaterial = !predefinedColorMaterials.includes(
                selectedBatik.color_materials
            );
    
            // Set newBatik state
            setNewBatik({
                id: selectedBatik.id,
                name: selectedBatik.name || "",
                description:
                    selectedBatik.name === "custom"
                        ? selectedBatik.description || ""
                        : selectedBatikDescription
                        ? selectedBatikDescription.description
                        : "",
                image: "",
                motif_creator: selectedBatik.motif_creator || "",
                bricklayer_name: selectedBatik.bricklayer_name || "",
                production_year: selectedBatik.production_year || "",
                materials: isCustomMaterial ? "custom" : selectedBatik.materials,
                color_materials: isCustomColorMaterial
                    ? "custom"
                    : selectedBatik.color_materials, 
                member_id: selectedBatik.member_id || "",
                quality: selectedBatik.quality || "",
            });
    
            // Handle custom material input
            if (isCustomMaterial) {
                setCustomMaterial(selectedBatik.materials || "");
            } else {
                setCustomMaterial("");
            }
    
            // Handle custom color material input
            if (isCustomColorMaterial) {
                setCustomColorMaterial(selectedBatik.color_materials || ""); 
            } else {
                setCustomColorMaterial("");
            }
    
            // Jika tidak ada di batikDescription, set name menjadi 'custom' dan description kosong
            if (!selectedBatikDescription) {
                setNewBatik((prev) => ({
                    ...prev,
                    name: "custom",
                    description: selectedBatik.description || "",
                }));
                setCustomName(selectedBatik.name || "");
            } else {
                setCustomName("");
            }
    
            // Handle member data
            const selectedMember = members.find(
                (member) => parseInt(member.id) === parseInt(selectedBatik.member_id)
            );
            if (selectedMember) {
                setNewBatik((prev) => ({
                    ...prev,
                    store_name: selectedMember.store_name || "",
                    email: selectedMember.email || "",
                    member_address: selectedMember.address || "",
                }));
            }
    
            // Set image preview
            if (selectedBatik.image) {
                setImagePreview(`/storage/${selectedBatik.image}`);
            } else {
                setImagePreview(null);
            }
    
            setImageName(
                selectedBatik.image ? selectedBatik.image.split("/").pop() : ""
            );
            setIsModalOpen(true);
            setIsEditMode(true);
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
            quality: "",
            motif_creator: "",
            bricklayer_name: "",
            production_year: "",
            materials: "",
            color_materials: "",
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
            quality: '',
            description: '',
            image: null,
            motif_createor: '',
            bricklayer_name: '',
            production_year: '',
            materials: '',
            color_materials: '',
            member_id: '',

        });
        setImagePreview(null);
    };



    const batikOptions = batikDescription.map((desc) => ({
        value: desc.name,
        label: desc.name,
    }));
    
    // Add a custom option to allow user input
    batikOptions.push({ value: 'custom', label: 'Custom' });



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
                    <div className="flex gap-4 mt-4 sm:mt-0 sm:ml-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white py-2 px-5 rounded-lg flex items-center hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                        >
                            <FiPlus className="mr-2 text-lg" />
                            <span className="text-sm font-medium">Tambah Batik</span>
                        </button>
                        <button
                            onClick={exportBatikData}
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

                 {/* Grid untuk Card */}
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredData.map((batik, index) => (
                            <div
                                key={batik.id || index}
                                className="relative flex flex-col justify-between p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Quality Badge */}
                                {batik.quality && (
                                    <span
                                        className={`absolute top-2 right-2 text-xs font-semibold text-white px-3 py-1 rounded-full ${
                                            batik.quality === "SB"
                                                ? "bg-green-500"
                                                : batik.quality === "BR"
                                                ? "bg-yellow-500"
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {batik.quality}
                                    </span>
                                )}

                                <div className="flex flex-col flex-grow">
                                    {/* Nama Batik */}
                                    <div className="flex items-center justify-center w-full">
                                        <h3
                                            className="text-lg font-semibold text-gray-800 truncate text-center"
                                            title={batik.name === "custom" ? customName : batik.name}
                                        >
                                            {batik.name === "custom"
                                                ? customName
                                                : batik.name.length > 17
                                                ? `${batik.name.slice(0, 17)}...`
                                                : batik.name}
                                        </h3>
                                    </div>

                                    {/* Nama Member */}
                                    <p className="text-gray-600 text-sm mt-2">
                                        <span className="block max-w-xs font-bold" title={batik.member?.name}>
                                        {batik.member?.name ? (
                                            <span className="flex items-center space-x-2" title={batik.member.name}>
                                                <span>{batik.member.name}</span>
                                                <FiUser className="text-blue-500" size={16} />
                                            </span>
                                        ) : null}

                                        </span>
                                    </p>

                                    {/* Deskripsi */}
                                    <p className="text-gray-600 text-sm mt-2 flex-grow">
                                        <span className="font-bold">Deskripsi:</span>
                                        <span className="block max-w-xs" title={batik.description}>
                                            {batik.description.length > 150
                                                ? `${batik.description.slice(0, 150)}...`
                                                : batik.description}
                                        </span>
                                    </p>
                                </div>

                                {/* Kode Batik */}
                                <div className="flex items-center justify-between mb-2">
                                        <div className="text-lg font-bold text-gray-800">
                                            M-{batik.code_batik.slice(1).match(/.{1,2}/g).join("-")}
                                        </div>
                                    </div>

                                {/* Gambar, Kode Batik, dan Tombol */}
                                <div>
                                    {/* Gambar */}
                                    <div className="relative">
                                        {batik.image && (
                                            <img
                                                src={`/storage/${batik.image}`}
                                                alt={batik.name}
                                                className="w-full h-40 object-cover rounded-lg shadow-sm mb-4"
                                            />
                                        )}
                                    </div>

                                    {/* Tombol Aksi */}
                                    <div className="flex justify-between items-center gap-2 mt-2">
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-blue-600 hover:shadow-md transition-all duration-200 ease-in-out"
                                            onClick={() => handleEditClick(batik.id)}
                                            aria-label="Edit Data"
                                        >
                                            <FiEdit className="mr-2 text-base" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>

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
                                                const scale = 10; // Resolusi tinggi
                                                const width = 250; // Lebar canvas
                                                const height = 350; // Tinggi canvas
                                                const logoSize = 45; // Ukuran logo
                                                const qrSize = 100; // Ukuran QR Code
                                                const lineSpacing = 16; // Jarak antar baris teks
                                                const boxSpacing = 5; // Jarak antar kotak kode

                                                try {
                                                    const canvas = document.createElement("canvas");
                                                    const ctx = canvas.getContext("2d");

                                                    // Setup resolusi canvas
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

                                                    // Sumber gambar
                                                    const memberLogo = batik.member?.image
                                                    ? `/storage/${batik.member.image}`
                                                    : defaultLogo;

                                                    // Muat gambar
                                                    const [btmcImage, igiImage, memberImage, qrImage, background] =
                                                    await Promise.all([
                                                        loadImage(btmcLogo),
                                                        loadImage(igiLogo),
                                                        loadImage(memberLogo),
                                                        loadImage(`data:image/svg+xml;base64,${batik.qr_code}`),
                                                        loadImage(qrBackground),
                                                    ]);

                                                    // Gambar background
                                                    ctx.drawImage(background, 0, 0, width, height);

                                                    // Gambar logo
                                                    ctx.drawImage(btmcImage, 55, 20, logoSize, logoSize);
                                                    ctx.drawImage(igiImage, 105, 20, logoSize, logoSize);
                                                    ctx.drawImage(memberImage, 155, 20, logoSize, logoSize);

                                                    // Geser elemen ke atas dengan menyesuaikan posisi Y
                                                    const qrYOffset = 80; // Offset posisi QR Code
                                                    const textYOffset = 210; // Offset posisi teks informasi

                                                    // Gambar QR Code
                                                    ctx.drawImage(qrImage, (width - qrSize) / 2, qrYOffset, qrSize, qrSize);

                                                    // Tambahkan teks informasi (rata kiri)
                                                    ctx.font = `${1.1 * scale}px Arial`;
                                                    ctx.fillStyle = "#333333";
                                                    ctx.textAlign = "left"; // Rata kiri

                                                    const textStartX = 20;

                                                    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
                                                    const words = text.split(" ");
                                                    let line = "";
                                                    for (let n = 0; n < words.length; n++) {
                                                        const testLine = line + words[n] + " ";
                                                        const metrics = context.measureText(testLine);
                                                        const testWidth = metrics.width;
                                                        if (testWidth > maxWidth && n > 0) {
                                                        context.fillText(line, x, y);
                                                        line = words[n] + " ";
                                                        y += lineHeight;
                                                        } else {
                                                        line = testLine;
                                                        }
                                                    }
                                                    context.fillText(line, x, y);
                                                    return y + lineHeight; // Return the next Y position
                                                    };

                                                    const maxTextWidth = width - 40; // Batas lebar teks
                                                    let currentY = wrapText(
                                                    ctx,
                                                    `Nama Motif: ${batik.name || "-"}`,
                                                    textStartX,
                                                    textYOffset,
                                                    maxTextWidth,
                                                    lineSpacing
                                                    );

                                                    // Tambahkan teks lainnya
                                                    ctx.fillText(
                                                    `Jenis Produk: ${batik.materials || "-"}`,
                                                    textStartX,
                                                    currentY
                                                    );
                                                    currentY += lineSpacing;

                                                    ctx.fillText(
                                                    `Harga: Rp. ${batik.price || "-"}`,
                                                    textStartX,
                                                    currentY
                                                    );

                                                    // Tambahkan Kode Produk IG Batik Tulis Merawit (tetap konsisten di bawah)
                                                    const certificationText = "Kode Produk IG Batik Tulis Merawit";
                                                    let codeText = batik.code_batik || "-";

                                                    // Ubah format kode menjadi "M" + pasangan huruf/angka
                                                    codeText = `${codeText.replace(/[^a-zA-Z0-9]/g, "")}`;
                                                    const formattedCode = [
                                                    codeText.charAt(0),
                                                    ...codeText.slice(1).match(/.{1,2}/g),
                                                    ];

                                                    // Posisi tetap konsisten
                                                    const codeStartY = 280; // Posisi tetap di bawah
                                                    ctx.textAlign = "center";
                                                    ctx.fillText(certificationText, width / 2, codeStartY);

                                                    // Gambar kode sertifikasi dalam kotak
                                                    const boxSize = 20; // Ukuran kotak
                                                    const totalWidth =
                                                    formattedCode.length * boxSize + (formattedCode.length - 1) * boxSpacing;
                                                    const startX = (width - totalWidth) / 2;
                                                    const startY = codeStartY + lineSpacing;

                                                    formattedCode.forEach((char, i) => {
                                                    const x = startX + i * (boxSize + boxSpacing);

                                                    // Gambar kotak
                                                    ctx.strokeStyle = "#000";
                                                    ctx.lineWidth = 1;
                                                    ctx.strokeRect(x, startY, boxSize, boxSize);

                                                    // Gambar huruf di dalam kotak
                                                    ctx.fillStyle = "#000";
                                                    ctx.textAlign = "center";
                                                    ctx.textBaseline = "middle";
                                                    ctx.fillText(char, x + boxSize / 2, startY + boxSize / 2);
                                                    });

                                                    // Tambahkan border
                                                    ctx.strokeStyle = "#cccccc";
                                                    ctx.lineWidth = 2;
                                                    ctx.strokeRect(10, 10, width - 20, height - 20);

                                                    // Unduh gambar
                                                    canvas.toBlob((blob) => {
                                                    if (blob) {
                                                        const url = URL.createObjectURL(blob);
                                                        const link = document.createElement("a");
                                                        link.href = url;
                                                        link.download = `batik-${batik.code_batik || "qr"}.png`;
                                                        link.click();
                                                        URL.revokeObjectURL(url);
                                                    }
                                                    }, "image/png");
                                                } catch (error) {
                                                    console.error("Error:", error);
                                                    Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Gagal mengunduh gambar. Silakan coba lagi.",
                                                    });
                                                }
                                                }}
                                                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-600 hover:shadow-md transition-all duration-200 ease-in-out group relative"
                                                aria-label="Print Qr COde"
                                            >
                                                <FiPrinter className="text-base" />
                                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Print
                                                </span>
                                            </button>
                                            )}

                                    </div>
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
                                        <Select
                                            id="member_id"
                                            name="member_id"
                                            value={memberOptions.find((option) => option.value === newBatik.member_id?.toString()) || null}  
                                            onChange={(selectedOption) => {
                                                const selectedMember = members.find(
                                                    (member) => member.id.toString() === selectedOption.value
                                                );
                                                setNewBatik((prev) => ({
                                                    ...prev,
                                                    member_id: selectedOption.value,
                                                    store_name: selectedMember ? selectedMember.store_name : '',
                                                    member_address: selectedMember ? selectedMember.address : '',
                                                    email: selectedMember ? selectedMember.email : '',
                                                }));
                                            }}
                                            options={memberOptions}
                                            className="w-full"
                                            placeholder="Pilih Anggota"
                                            required
                                        />
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
                                {/* <div>
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
                                </div> */}
                                <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Motif
                                </label>
                                <div className="flex items-center gap-2">
                                    <Select
                                        id="name"
                                        name="name"
                                        value={batikOptions.find((option) => option.value === newBatik.name)}
                                        onChange={handleSelectChange}
                                        options={[
                                            ...batikOptions
                                                .filter((option) => option.value !== 'custom')
                                                .sort((a, b) => a.label.localeCompare(b.label)),
                                            batikOptions.find((option) => option.value === 'custom'),
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


                                 {/* Kualitas Batik */}
                                <div>
                                    <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kualitas Batik
                                    </label>
                                    <select
                                        id="quality"
                                        name="quality"
                                        value={newBatik.quality || ""}
                                        onChange={(e) =>
                                            setNewBatik((prev) => ({
                                                ...prev,
                                                quality: e.target.value,
                                            }))
                                        }
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih Kualitas Batik
                                        </option>
                                        <option value="SB">Sangat Bagus (SB) - A</option>
                                        <option value="BR">Bagus Rapih (BR) - B</option>
                                        <option value="CR">Cukup Rapih (SR) - C</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="production_year" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun Produksi
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        id="production_year"
                                        name="production_year"
                                        value={newBatik.production_year || ""}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                    {/* <div>
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
                                </div> */}

                                <div>
                                    <label htmlFor="motif_creator" className="block text-sm font-medium text-gray-700 mb-2">
                                        Pembuat Motif
                                    </label>
                                    <Select
                                        id="motif_creator"
                                        name="motif_creator"
                                        options={motifCreatorOptions}
                                        value={
                                            motifCreatorOptions.find(option => option.value === newBatik.motif_creator) || null
                                        }
                                        onChange={handleMotifCreatorChange}
                                        placeholder="Select a motif creator"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bricklayer_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tukang Penembok
                                    </label>
                                    <Select
                                        id="bricklayer_name"
                                        name="bricklayer_name"
                                        options={backLayerOptions}
                                        value={
                                            backLayerOptions.find(option => option.value === newBatik.bricklayer_name) || null
                                        }
                                        onChange={handleBricklayerChange}
                                        placeholder="Select a bricklayer"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bahan Baku Kain
                                    </label>
                                    <div className="flex items-center gap-2">
                                    <Select
                                        id="materials"
                                        name="materials"
                                        value={materialOptions.find((option) => option.value === newBatik.materials)}
                                        onChange={handleMaterialChange}
                                        options={[
                                            ...materialOptions
                                                .filter((option) => option.value !== 'custom')
                                                .sort((a, b) => a.label.localeCompare(b.label)),
                                            materialOptions.find((option) => option.value === 'custom'),
                                        ]}
                                        required
                                        className="w-full"
                                    />
                                    {newBatik.materials === 'custom' && (
                                        <input
                                            type="text"
                                            id="customMaterial"
                                            name="customMaterial"
                                            value={customMaterial}
                                            onChange={(e) => setCustomMaterial(e.target.value)}
                                            placeholder="Bahan Baku Kain"
                                            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    )}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="color_materials"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Bahan Pewarna
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            id="color_materials"
                                            name="color_materials"
                                            value={colorMaterialsOption.find(
                                                (option) => option.value === newBatik.color_materials
                                            )}
                                            onChange={handleColorMaterialsChange}
                                            options={[
                                                ...colorMaterialsOption
                                                    .filter((option) => option.value !== 'custom')
                                                    .sort((a, b) => a.label.localeCompare(b.label)),
                                                colorMaterialsOption.find((option) => option.value === 'custom'),
                                            ]}
                                            required
                                            className="w-full"
                                        />
                                        {newBatik.color_materials === 'custom' && (
                                            <input
                                                type="text"
                                                id="customColorMaterial"
                                                name="customColorMaterial"
                                                value={customColorMaterial}
                                                onChange={(e) => setCustomColorMaterial(e.target.value)}
                                                placeholder="Masukkan bahan pewarna khusus"
                                                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        )}
                                    </div>
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
                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-gray-600 transition-colors"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    <FiX className="mr-2" /> {/* Cancel Icon */}
                                    Cancel
                                </button>

                                {/* Save/Update Button */}
                                <button
                                    type="submit"
                                    className={`py-2 px-4 rounded-lg flex items-center transition-colors ${
                                        isSubmitting ? 'bg-blue-300 text-gray-100' : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiLoader className="mr-2 animate-spin" /> {/* Loading Spinner */}
                                            {isEditMode ? "Updating..." : "Submitting..."}
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="mr-2" /> {/* Save/Update Icon */}
                                            {isEditMode ? "Update" : "Simpan"}
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
