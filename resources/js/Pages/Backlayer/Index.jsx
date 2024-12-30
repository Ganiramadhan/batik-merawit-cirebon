import {  useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';


import { 
    FiEdit, FiTrash, FiPlus, FiUser, FiX, FiSave, FiSearch, FiChevronLeft, FiChevronRight, FiXCircle, FiLoader
} from 'react-icons/fi';


export default function BackLayerData({ user, title, backlayers }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newBacklayer, setNewBacklayer] = useState({
        name: '',
    });
    
    
    const [filteredBacklayerData, setFilteredBacklayerData] = useState(backlayers);

    
    const filteredData = filteredBacklayerData.filter((backlayers) => {
        const searchQueryLower = searchQuery.toLowerCase();
        return Object.values(backlayers)
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



    // Handle cancel modal
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        resetForm();
    };

    const resetForm = () => {
        setNewBacklayer({
            name: '',
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();
        for (const key in newBacklayer) {
            formData.append(key, newBacklayer[key]);
        }

        setIsSubmitting(true); 

        try {
            let response;

            // Edit mode (update)
            if (isEditMode) {
                response = await axios.post(`/backlayer/${newBacklayer.id}`, formData);

                if (response.status === 200 || response.status === 204) {
                    const updatedImage = response?.data?.member?.image;
                    setFilteredBacklayerData((prevData) => {
                        return prevData.map((item) =>
                            item.id === newBacklayer.id
                                ? {
                                    ...item,
                                    ...newBacklayer,
                                    name: response.data.backlayer.name || '',
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
                    throw new Error('Failed to update member');
                }
            } else {
                // Add new member
                response = await axios.post('/backlayer', formData);
                setFilteredBacklayerData((prevData) => [
                    ...prevData,
                    {
                        ...response.data.backlayer,
                        name: response.data.backlayer.name || '',
                    },
                ]);

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data.message,
                });
            }

            setIsModalOpen(false); 
            resetForm(); 
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Tidak dapat memproses permintaan.',
            });
        } finally {
            setIsSubmitting(false); 
        }
    };


    const handleEditClick = (id) => {
        const backlayer = filteredBacklayerData.find((backlayer) => backlayer.id === id);
    
        if (backlayer) {
            setNewBacklayer({
                ...backlayer,  
                name: backlayer.name || '', 
            });
            setIsEditMode(true);  
            setIsModalOpen(true); 
        }
    };
    



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
                    const response = await axios.delete(`/backlayer/delete/${id}`, {
                        headers: {
                            'X-CSRF-TOKEN': document
                                .querySelector('meta[name="csrf-token"]')
                                .getAttribute('content'),
                        },
                    });
    
                    if (response.data.success) {
                        setFilteredBacklayerData((prevData) =>
                            prevData.filter((backlayer) => backlayer.id !== id)
                        );
    
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: response.data.message,
                        });
                    }
                } catch (error) {
                    console.error('Error deleting data:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Terjadi Kesalahan',
                        text: 'Data penembok tidak dapat dihapus.',
                    });
                }
            }
        });
    };
    


    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">{title}</h2>}>
            <Head title={title} />

            <div className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            {/* Search and Add backlayer Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari tukang penembok..."
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
                        {/* Add Backlayer Button */}
                        <button
                            onClick={() => {
                                setIsEditMode(false);
                                setNewBacklayer({ backlayer_number: '', name: ''});
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105 text-sm"
                        >
                            <FiPlus className="mr-2" />
                            Tambah Penembok
                        </button>

                    </div>
                </div>



                {/* Table for Backlayer Data */}
                <div className="overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200">
                    <div className="overflow-x-auto">
                        
                    <table className="table-auto border-collapse w-full text-sm border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <tr>
                                <th className="px-3 py-3 font-semibold text-center border border-gray-300 rounded-tl-lg w-1/6">
                                    Nomor Penembok
                                </th>
                                <th className="px-5 py-3 font-semibold text-left border border-gray-300">
                                    Nama
                                </th>
                                <th className="px-5 py-3 font-semibold text-center border border-gray-300 rounded-tr-lg">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((backlayer, index) => (
                                    <tr
                                        key={backlayer.id}
                                        className={`border-b ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        } hover:bg-blue-100 transition-all`}
                                    >
                                        <td className="text-center text-gray-700 border border-gray-300 py-3">
                                            {backlayer.backlayer_number}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 border border-gray-300">
                                            {backlayer.name}
                                        </td>
                                        <td className="px-4 py-3 text-center border border-gray-300">
                                            <div className="flex justify-center gap-4">
                                                {/* Tombol Edit */}
                                                <button
                                                    type="button"
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all shadow-sm group relative"
                                                    onClick={() => handleEditClick(backlayer.id)}
                                                >
                                                    <FiEdit className="text-lg" />
                                                    <span className="text-sm">Edit</span>
                                                </button>

                                                {/* Tombol Hapus */}
                                                <button
                                                    type="button"
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all shadow-sm group relative"
                                                    onClick={() => handleDeleteClick(backlayer.id)}
                                                >
                                                    <FiTrash className="text-lg" />
                                                    <span className="text-sm">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-5 py-3 text-center text-gray-500 font-medium"
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


            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
                    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md transition-transform transform scale-95 overflow-y-auto max-h-[80vh]">
                        
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
                                    {isEditMode ? 'Edit Data Penembok' : 'Tambah Data Penembok'}
                                </h3>
                            </div>
                        </div>

                      {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penembok</label>
                                    <input
                                        type="text"
                                        value={newBacklayer.name || ''}
                                        onChange={(e) => setNewBacklayer({ ...newBacklayer, name: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
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
