import { useEffect, useState, useMemo} from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiUser, FiX, FiSave  } from "react-icons/fi";

export default function Transaction({ user, title, transactions, batiks }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [filteredData, setFilteredData] = useState(transactions);
    const [currentData, setCurrentData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newTransaction, setNewTransaction] = useState({  
        id: '',
        batik_id: '',
        quantity: '',
        total_price: '',
        transaction_date: '',
        notes: ''
    });

    const batikCodes = useMemo(() => {
        const codeMap = {};
        const nameMap = {};
        batiks.forEach(batik => {
            codeMap[batik.id] = batik.code_batik.toLowerCase();
            nameMap[batik.id] = batik.name.toLowerCase();
        });
        return { codeMap, nameMap };
    }, [batiks]);
    
    useEffect(() => {
        const filtered = transactions.filter(transaction => {
            const batikCode = batikCodes.codeMap[transaction.batik_id];
            const batikName = batikCodes.nameMap[transaction.batik_id];
    
            return (
                (batikCode && batikCode.includes(searchQuery.toLowerCase())) ||
                (batikName && batikName.includes(searchQuery.toLowerCase())) ||
                (transaction.transaction_date && transaction.transaction_date.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (transaction.notes && transaction.notes.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchQuery, transactions, batikCodes]);
    

    useEffect(() => {
        const indexOfLast = currentPage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        setCurrentData(filteredData.slice(indexOfFirst, indexOfLast));
    }, [currentPage, filteredData]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };




    const handleDeleteClick = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/transaction/${id}`);
                    setFilteredData(filteredData.filter(transaction => transaction.id !== id));
                    Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error!', 'There was an error deleting the transaction.', 'error');
                }
            }
        });
    };


    const handleEditClick = (transaction) => {
        setIsEditMode(true);
        setNewTransaction(transaction);
        setIsModalOpen(true);
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
            quantity: '',
            total_price: '',
            transaction_date: '',
            notes: ''
        });
    };
    


    return (
        <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800">{title}</h2>}>
            <Head title={title} />

            <div className="py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
                        <div className="relative w-full sm:w-1/3">
                            <input
                                type="text"
                                placeholder="Search transactions..."
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
                                setNewTransaction({
                                    batik_id: '',
                                    quantity: '',
                                    total_price: '',
                                    transaction_date: '',
                                    notes: ''
                                });
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center hover:bg-blue-700 transition-all shadow-lg transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" />
                            Add Transaction
                        </button>
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
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Jumlah</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Total</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Tanggal Transaksi</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left">Catatan</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((transaction, index) => (
                                        <tr key={transaction.id} className="border-b hover:bg-gray-100 transition-all">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {transaction.batik.code_batik || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {transaction.batik.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{transaction.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(transaction.total_price)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{transaction.transaction_date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{transaction.notes}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-3">
                                                    <button
                                                        type="button"
                                                        className="bg-blue-500 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-all shadow-md"
                                                        onClick={() => handleEditClick(transaction)}
                                                    >
                                                        <FiEdit className="text-xl" />
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white p-2 rounded-md flex items-center justify-center hover:bg-red-600 transition-all shadow-md"
                                                        onClick={() => handleDeleteClick(transaction.id)}
                                                    >
                                                        <FiTrash className="text-xl" />
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
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    <FiChevronLeft />
                                </button>

                                <span className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white">
                                    {currentPage}
                                </span>

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
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl transition-transform transform scale-95 overflow-y-auto max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <div className="flex items-center space-x-2">
                                <FiUser className="text-2xl text-blue-500" />
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
                                {/* Kode Batik (Select from available batik options) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode Batik</label>
                                    <select
                                        value={newTransaction.batik_id || ''}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, batik_id: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Pilih Kode Batik</option>
                                        {/* Render batik options */}
                                        {batiks.map((batik) => (
                                            <option key={batik.id} value={batik.id}>
                                                {batik.code_batik}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Jumlah */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                                    <input
                                        type="number"
                                        value={newTransaction.quantity || ''}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Total Harga */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Harga</label>
                                    <input
                                        type="number"
                                        value={newTransaction.total_price || ''}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, total_price: e.target.value })}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                                        required
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
