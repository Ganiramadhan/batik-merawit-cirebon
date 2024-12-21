import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
    FiEdit, 
    FiTrash, 
    FiPlus, 
    FiSearch, 
    FiChevronLeft, 
    FiChevronRight, 
    FiCreditCard, 
    FiX, 
    FiSave, 
    FiXCircle, 
    FiInfo,           
    FiLoader,
    FiPrinter,
    FiUpload ,
} from "react-icons/fi";



export default function Transaction({ user, title, transactions, batiks }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);  
    const [filteredData, setFilteredData] = useState(transactions);
    const [currentData, setCurrentData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        id: '',
        batik_id: '',
        price:'',
        transaction_date: '',
        notes: ''
    });

    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); 



    const handleExportClick = () => {
        setIsFilterModalOpen(true); 
    };

    const exportTransactionData = () => {
        // Filter transactions by date range
        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            const startDate = new Date(filterStartDate);
            const endDate = new Date(filterEndDate);
    
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
    
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    
        // Check if there are any transactions in the filtered data
        if (filtered.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Kosong',
                text: 'Tidak ada transaksi yang sesuai dengan filter tanggal.',
            });
            return; 
        }
    
        // Format the filtered data for export
        const formattedData = filtered.map(transaction => {
            const batik = batiks.find(batik => batik.id === transaction.batik_id);
            
            return {
                'Kode Batik': batik?.code_batik || '-',
                'Nama Batik': batik?.name || '-',
                'Harga': new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.price || 0),
                'Tanggal Transaksi': new Date(transaction.transaction_date).toLocaleDateString('id-ID'),
                'Catatan': transaction.notes || '-',
            };
        });
    
        // Export formatted data to Excel
        exportToExcel(formattedData);
    
        Swal.fire({
            icon: 'success',
            title: 'Ekspor Berhasil!',
            text: 'Data transaksi telah berhasil diekspor.',
            confirmButtonText: 'OK',
            timer: 3000, 
            timerProgressBar: true,
        });
    
        // Reset filters and close modal
        setIsFilterModalOpen(false);
        resetDateFilters();
    };
    
    
    // Function to reset date filters
    const resetDateFilters = () => {
        setFilterStartDate('');
        setFilterEndDate('');
    };
    
    // Function to export data to Excel
    const exportToExcel = (data) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    
        const today = new Date();
        const fileName = `Transactions-${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    
        // Write the file to Excel
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };
    
    


    // Search Data 
    useEffect(() => {
        const filtered = transactions.filter(transaction => {
            const batik = batiks.find(b => b.id === transaction.batik_id);
            return (
                (batik?.code_batik?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (batik?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (transaction.transaction_date?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (transaction.notes?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchQuery, transactions, batiks]);


    useEffect(() => {
        const indexOfLast = currentPage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        setCurrentData(filteredData.slice(indexOfFirst, indexOfLast));
    }, [currentPage, filteredData, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    

    
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return; 
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);  
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Disable submit button while submitting
        setIsSubmitting(true);
        
        const formData = new FormData();
        Object.keys(newTransaction).forEach((key) => {
            formData.append(key, newTransaction[key]);
        });
        
        try {
            let response;
        
            if (isEditMode) {
                response = await axios.post(`/transaction/${newTransaction.id}`, formData);
        
                if (response.status === 200) {
                    const updatedTransaction = response.data.transaction;
                    const batikDetails = batiks.find(b => parseInt(b.id) === parseInt(updatedTransaction.batik_id));
        
                    setFilteredData((prevData) =>
                        prevData.map((item) =>
                            item.id === updatedTransaction.id
                                ? { ...item, ...updatedTransaction, batik: batikDetails }
                                : item
                        )
                    );
        
                    Swal.fire('Success', response.data.message, 'success');
                }
            } else {
                response = await axios.post('/transaction', formData);
        
                if (response.status === 200) {
                    const newTransactionData = response.data.transaction;
                    const batikDetails = batiks.find(b => parseInt(b.id) === parseInt(newTransactionData.batik_id));
        
                    setFilteredData((prev) => [
                        ...prev,
                        { ...newTransactionData, batik: batikDetails },
                    ]);
        
                    Swal.fire('Success', response.data.message, 'success');
                }
            }
        
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'There was an error processing your request.';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    

    const batikOptions = batiks.map(batik => ({
        value: batik.id,
        label: batik.code_batik,
    }));




    const handleEditClick = (transaction) => {
        try {
            const selectedBatik = batiks.find(
                (batik) => parseInt(batik.id, 10) === parseInt(transaction.batik_id, 10)
            );
        
            // Format tanggal transaksi menjadi YYYY-MM-DD
            const formattedDate = transaction.transaction_date
                ? transaction.transaction_date.split(' ')[0] 
                : '';
    
            if (selectedBatik) {
                setIsEditMode(true);
    
                setNewTransaction({
                    id: transaction.id || '',
                    batik_id: transaction.batik_id || '',
                    transaction_date: formattedDate || '', 
                    notes: transaction.notes || '',
                    code_batik: selectedBatik.code_batik || '',
                    name: selectedBatik.name || '',
                    price: transaction.price || 0,
                });
    
                // Buka modal edit
                setIsModalOpen(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Data batik tidak ditemukan. Silakan muat ulang dan coba lagi.',
                });
            }
        } catch (error) {
            // Tangani error yang tidak terduga
            console.error('Error in handleEditClick:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan. Silakan coba lagi nanti.',
            });
        }
    };
    



    const handleDetailClick = (id) => {
        const transactionData = filteredData.find((transaction) => transaction.id === id);
        
        if (transactionData) {
            const batikInfo = batiks.find((b) => parseInt(b.id) === parseInt(transactionData.batik_id));
    
            if (!batikInfo) {
                console.warn('Batik details not found for transaction:', transactionData);
            }
    
            setSelectedTransaction({
                ...transactionData,
                batik: batikInfo || { code: 'N/A', name: 'Unknown', price: 0 },
            });
    
            setIsDetailModalOpen(true);
        } else {
            console.log('Data tidak ditemukan');
        }
    };

    const handleDeleteClick = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Panggil API untuk menghapus data
                    const response = await axios.delete(`/transaction/${id}`);
    
                    // Hapus data dari state setelah berhasil
                    setFilteredData(filteredData.filter(transaction => transaction.id !== id));
    
                    Swal.fire('Deleted!', response.data.message, 'success');
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        error.response?.data?.message || 'An error occurred while deleting the transaction.',
                        'error'
                    );
                }
            }
        });
    };
    

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        resetForm();
    };

    const resetForm = () => {
        setNewTransaction({
            id: '',
            batik_id: '',
            price: '',
            transaction_date: '',
            notes: ''
        });
    };
    
    function formatRupiahInput(value) {
        if (typeof value !== 'string') {
            value = String(value); 
        }
        return value
            .replace(/\D/g, '') 
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    }
    
    
    function handlePriceChange(input) {
        const numericValue = input.replace(/[^0-9]/g, '');
        setNewTransaction((prev) => ({
            ...prev,
            price: numericValue, 
        }));
    }
    
    


    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">{title}</h2>}>
            <Head title={title} />

            <div className="py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">

                {/* Search Input */}
                <div className="relative w-full sm:w-1/4">
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
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

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-4">
                    {/* Add Transaction Button */}
                    <button
                        onClick={() => {
                        setIsEditMode(false);
                        setNewTransaction({
                            batik_id: '',
                            transaction_date: '',
                            notes: ''
                        });
                        setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105 text-sm"
                    >
                        <FiPlus className="mr-2" />
                        Tambah Transaksi
                    </button>


                    {/* Export Button */}
                    <button
                        onClick={handleExportClick}
                        className="bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105 text-sm"
                    >
                        <FiPrinter className="text-lg" />
                    </button>
                </div>

               {/* Modal for filtering */}
                {isFilterModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-96 max-w-md relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FiXCircle className="w-6 h-6" /> {/* Close Icon */}
                            </button>

                            {/* Modal Content */}
                            <h3 className="text-xl mb-6 font-semibold text-gray-800 text-center">Filter Transaksi</h3>

                            {/* Start Date input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700">Pilih Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                />
                            </div>

                            {/* End Date input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700">Pilih Tanggal Selesai</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                />
                            </div>

                            {/* Export Button */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={exportTransactionData}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                                >
                                    <FiUpload /> {/* Icon Export */}
                                    <span>Export Data</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                    </div>
                    {/* Table for Transaction Data */}
                    <div className="overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">#</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Kode Batik</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Nama Batik</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Harga</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Tanggal Transaksi</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Catatan</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.length > 0 ? (
                                        currentData.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b hover:bg-gray-100 transition-all">
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                    {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {transaction?.batik?.code_batik || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {transaction?.batik?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                                                    transaction.price || 0
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    <div className="relative">
                                                        <span className="truncate max-w-xs" title={transaction.notes}>
                                                            {transaction.notes.length > 50 ? `${transaction.notes.slice(0, 50)}...` : transaction.notes}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center space-x-3">
                                                        {/* Edit Button */}
                                                        <button
                                                            type="button"
                                                            className="bg-blue-500 text-white p-1 rounded-md flex items-center justify-center hover:bg-blue-600 transition-all shadow-sm relative group"
                                                            onClick={() => handleEditClick(transaction)}
                                                        >
                                                            <FiEdit className="text-lg m-1" />
                                                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                Edit
                                                            </span>
                                                        </button>

                                                        {/* Detail Button */}
                                                        <button
                                                            className="bg-gray-500 text-white p-1 rounded-md flex items-center justify-center hover:bg-gray-600 transition-all shadow-sm relative group"
                                                            onClick={() => handleDetailClick(transaction.id)}
                                                        >
                                                            <FiInfo className="text-lg m-1" />
                                                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                Detail
                                                            </span>
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            className="bg-red-500 text-white p-1 rounded-md flex items-center justify-center hover:bg-red-600 transition-all shadow-sm relative group"
                                                            onClick={() => handleDeleteClick(transaction.id)}
                                                        >
                                                            <FiTrash className="text-lg m-1" />
                                                            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 text-xs text-white bg-black p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                Delete
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-gray-500">
                                                Tidak ada data transaksi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                            <span className="text-sm text-gray-600">
                                Showing {currentData.length} of {filteredData.length} entries
                            </span>
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

                                {/* First page button */}
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

                                {/* Page buttons */}
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

                                {/* Last page button */}
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
                </div>
            </div>


            {isDetailModalOpen && selectedTransaction && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all ${
                    isDetailModalOpen ? 'opacity-100 visible z-50' : 'opacity-0 invisible z-0'
                    }`}
                >
                    {/* Modal Kontainer */}
                    <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-lg transition-transform transform scale-100 overflow-y-auto max-h-[90vh]">
                    
                    {/* Header dengan ikon */}
                    <div className="border-b border-gray-200 mb-4 pb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                        <FiInfo className="text-black h-6 w-6" />
                        <h2 className="text-2xl font-semibold text-gray-800">Detail Transaksi</h2>
                        </div>
                    </div>

                    {/* Detail Transaksi sebagai tabel */}
                    <div className="overflow-auto max-h-[60vh]">
                        <table className="min-w-full bg-white border border-gray-200 table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                            <th className="py-2 px-4 border border-gray-200 text-left w-1/3">Detail</th>
                            <th className="py-2 px-4 border border-gray-200 text-left w-2/3">Informasi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {/* Tanggal */}
                            <tr>
                            <td className="py-2 px-4 border border-gray-200 w-1/3">
                                <strong>Tanggal</strong>
                            </td>
                            <td className="py-2 px-4 border border-gray-200 w-2/3">
                                {new Date(selectedTransaction.transaction_date).toLocaleDateString('id-ID')}
                            </td>
                            </tr>

                            {/* Kode Batik */}
                            <tr>
                            <td className="py-2 px-4 border border-gray-200 w-1/3">
                                <strong>Kode Batik</strong>
                            </td>
                            <td className="py-2 px-4 border border-gray-200 w-2/3">
                                {selectedTransaction.batik?.code_batik || '-'}
                            </td>
                            </tr>

                            {/* Nama Motif Batik */}
                            <tr>
                            <td className="py-2 px-4 border border-gray-200 w-1/3">
                                <strong>Nama Motif</strong>
                            </td>
                            <td className="py-2 px-4 border border-gray-200 w-2/3">
                                {selectedTransaction.batik?.name || '-'}
                            </td>
                            </tr>

                            {/* Harga Satuan */}
                            <tr>
                            <td className="py-2 px-4 border border-gray-200 w-1/3">
                                <strong>Harga</strong>
                            </td>
                            <td className="py-2 px-4 border border-gray-200 w-2/3">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                                selectedTransaction.price || 0
                                )}
                            </td>
                            </tr>


                           {/* Catatan */}
                            <tr>
                            <td className="py-2 px-4 border border-gray-200 w-1/3">
                                <strong>Catatan</strong>
                            </td>
                            <td className="py-2 px-4 border border-gray-200 w-2/3">
                                {selectedTransaction.notes || '-'}
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    {/* Tombol Tutup */}
                    <div className="mt-4 flex justify-end space-x-3">
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
            )}


            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl transition-transform transform scale-95 overflow-y-auto max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <div className="flex items-center space-x-2">
                                <FiCreditCard className="text-2xl text-blue-500" />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {isEditMode ? 'Edit Data Transaksi' : 'Tambah Data Transaksi'}
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
                            <div className="grid grid-cols-1 gap-4">
                                {/* Kode Batik */}
                                <div>
                                    <label htmlFor="batik_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Kode Batik
                                    </label>
                                    <Select
                                        value={batikOptions.find(option => option.value === newTransaction.batik_id) || null}
                                        onChange={(selectedOption) => {
                                            const selectedBatik = batiks.find(batik => batik.id === selectedOption.value);
                                            setNewTransaction({
                                                ...newTransaction,
                                                batik_id: selectedOption.value,
                                                name: selectedBatik ? selectedBatik.name : '',
                                            });
                                        }}
                                        options={batikOptions}
                                        className="w-full"
                                        classNamePrefix="react-select"
                                        isRequired
                                    />
                                </div>  
                                {/* Nama Batik */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Motif Batik</label>
                                    <input
                                        type="text"
                                        value={newTransaction.name || ''}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        readOnly
                                    />
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                                    <input
                                        type="text"
                                        value={formatRupiahInput(newTransaction.price) || ''}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Tanggal Transaksi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
                                    <input
                                        type="date"
                                        value={newTransaction.transaction_date || ''}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />

                                </div>

                                {/* Catatan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                                    <textarea
                                        value={newTransaction.notes || ''}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 space-x-3">
                                {/* Tombol Cancel */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}  // Disable button while submitting
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
