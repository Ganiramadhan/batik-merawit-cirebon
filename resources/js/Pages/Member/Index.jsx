import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiUser, FiX, FiSave, FiSearch, FiChevronLeft, FiChevronRight, FiInfo   } from "react-icons/fi";

export default function MemberData({ user, title, members }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        place_of_birth: '',
        gender: '',
        employees: '',
        store_name: '',
        email: '',
        phone_number: '',
        address: ''
    });
    
    const [filteredMemberData, setFilteredMemberData] = useState(members);


    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        for (const key in newMember) {
            formData.append(key, newMember[key]);
        }
    
        try {
            let response;
    
            if (isEditMode) {
                // Mode edit: update member berdasarkan ID
                response = await axios.post(`/member/${newMember.id}`, formData);
    
                // Cek jika respons berhasil (status 200 atau 204)
                if (response.status === 200 || response.status === 204) {
                    setFilteredMemberData((prevData) =>
                        prevData.map((item) =>
                            item.id === newMember.id
                                ? {
                                        ...item,
                                        name: newMember.name,
                                        store_name: newMember.store_name,
                                        place_of_birth: newMember.place_of_birth,
                                        gender: newMember.gender,
                                        employees: newMember.employees,
                                        phone_number: newMember.phone_number,
                                        email: newMember.email,
                                        address: newMember.address,
                                    }
                                : item
                        )
                    );
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Data Member berhasil diperbarui.',
                    });
                } else {
                    throw new Error('Failed to update member');
                }
            } else {
                response = await axios.post('/member', formData);
                const newMemberData = response.data; 
            
                setFilteredMemberData((prevData) => [...prevData, newMemberData]);
            
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data member berhasil ditambahkan.',
                });
            }
            // Tutup modal dan reset form
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Tidak dapat memproses permintaan.',
            });
        }
    };

    const filteredData = filteredMemberData.filter((members) =>
        members.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    


     // Handle edit
    const handleEditClick = (id) => {
        const member = members.find((member) => member.id === id);
        if (member) {
            setNewMember({
                ...member,
                gender: member.gender || '', 
            });
            setIsEditMode(true);
            setIsModalOpen(true);
        }
    };



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
                            text: 'Data batik tidak dapat dihapus.',
                        });
                    }
                }
            });
        };
    
    // Handle cancel modal
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        resetForm();
    };

    const resetForm = () => {
        setNewMember({
            name: '',
            place_of_birth: '',
            gender: '',
            employees: '',
            store_name: '',
            email: '',
            phone_number: '',
            address: ''
        });
    };

    const handleDetailClick = () => {
        console.log('Show Data')
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">{title}</h2>}>
            <Head title={title} />

            <div className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Search and Add Member Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
                    <div className="relative w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Search member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-3 pl-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all hover:shadow-md hover:border-blue-400"
                        />
                        <div className="absolute top-0 left-0 flex items-center h-full pl-3">
                            <FiSearch className="text-gray-400" />
                        </div>
                    </div>
                    <button
                            onClick={() => {
                                setIsEditMode(false);
                                setNewMember({ name: '', email: '', phone_number: '', address: '' });
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" />
                            Tambah Member
                        </button>
                </div>

                {/* Table for Member Data */}
                <div className="overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-left">#</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left">Store</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left">Phone</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-left">Address</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((member, index) => (
                                    <tr key={member.id} className="border-b hover:bg-gray-100 transition-all">
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(3, '0')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{member.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{member.store_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{member.phone_number}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            <div className="relative">
                                                <span className="truncate max-w-xs" title={member.address}>
                                                    {member.address.length > 50 ? `${member.address.slice(0, 50)}...` : member.address}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-3">
                                            <button
                                                type="button"
                                                className="bg-blue-500 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-all shadow-md relative group"
                                                onClick={() => handleEditClick(member.id)}
                                            >
                                                <FiEdit className="text-xl" />
                                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    Edit
                                                </span>
                                            </button>

                                            <button
                                                className="bg-gray-500 text-white p-2 rounded-md flex items-center justify-center hover:bg-gray-600 transition-all shadow-md relative group"
                                                onClick={() => handleDetailClick(member.id)} 
                                            >
                                                <FiInfo  className="text-xl" />
                                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    Detail
                                                </span>
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded-md flex items-center justify-center hover:bg-red-600 transition-all shadow-md relative group"
                                                onClick={() => handleDeleteClick(member.id)}
                                            >
                                                <FiTrash className="text-xl" />
                                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    Hapus
                                                </span>
                                            </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                
                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                        <span className="text-sm text-gray-600">
                            Showing {currentData.length} of {filteredData.length} entries
                        </span>
                        <div className="flex space-x-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                            >
                                <FiChevronLeft />
                            </button>

                            {/* Current Page */}
                            <span className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white">
                                {currentPage}
                            </span>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                            >
                                <FiChevronRight />
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



            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl transition-transform transform scale-95 overflow-y-auto max-h-[90vh]">
                        {/* Header Modal */}
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
                                <FiX className="text-2xl" />
                            </button>
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

                                {/* Tempat Tanggal Lahir */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Tanggal Lahir</label>
                                    <input
                                        type="text"
                                        value={newMember.place_of_birth || ''}
                                        onChange={(e) => setNewMember({ ...newMember, place_of_birth: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
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
                                        type="text"
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
                                        type="text"
                                        value={newMember.employees || ''}
                                        onChange={(e) => setNewMember({ ...newMember, employees: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Alamat */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Toko</label>
                                    <textarea
                                        value={newMember.address || ''}
                                        onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 space-x-3">
                                {/* Tombol Cancel */}
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-gray-600 transition"
                                    onClick={handleCancel}
                                >
                                    <FiX className="mr-2" />
                                    Cancel
                                </button>

                                {/* Tombol Simpan atau Update */}
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition"
                                >
                                    {isEditMode ? (
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
