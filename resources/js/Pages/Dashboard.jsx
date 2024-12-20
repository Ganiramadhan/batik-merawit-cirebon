import { Link } from '@inertiajs/react';
import { useEffect } from 'react'; // Import useEffect
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { FaStore, FaShoppingCart, FaUsers, FaChartLine, FaListUl } from 'react-icons/fa';

export default function Dashboard({ auth, totalBatik, totalMembers, totalTransactions, transactions, batikData }) {
    const isAdmin = auth.user.role === 'admin';
    const Layout = isAdmin ? AuthenticatedLayout : UserLayout;
    const headerText = isAdmin ? 'Dashboard' : 'Dashboard';

    // useEffect to log the data
    // useEffect(() => {
    //     console.log('Total Batik:', totalBatik);
    //     console.log('Total Members:', totalMembers);
    //     console.log('Total Transactions:', totalTransactions);
    //     console.log('Transactions:', transactions);
    //     console.log('Batik Data:', batikData);
    // }, [totalBatik, totalMembers, totalTransactions, transactions, batikData]);

    // Function to find batik code by batik_id
    const getBatikCode = (batikId) => {
        const batik = batikData.find(batik => batik.id === batikId);
        return batik ? batik.batik_code : '-';
    };


    return (
        <Layout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-600 leading-tight">{headerText}</h2>}
        >
            <Head title={headerText} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        {/* Display total counts for Admin */}
                        {isAdmin && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {/* Total Products */}
                                <Link
                                    href="/batik" // Ganti dengan route yang sesuai untuk Total Batik
                                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs py-1 px-3 rounded-full font-semibold">
                                        {totalBatik}
                                    </span>
                                    <FaStore className="text-3xl text-blue-600 mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Batik</h3>
                                        <p className="text-gray-500">Manage and view all batik products.</p>
                                    </div>
                                </Link>

                                {/* Total Members */}
                                <Link
                                    href="/member" // Ganti dengan route yang sesuai untuk Total Members
                                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs py-1 px-3 rounded-full font-semibold">
                                        {totalMembers}
                                    </span>
                                    <FaUsers className="text-3xl text-green-600 mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Members</h3>
                                        <p className="text-gray-500">Manage and view all members of the platform.</p>
                                    </div>
                                </Link>

                                {/* Total Transactions */}
                                <Link
                                    href="/transaction" // Ganti dengan route yang sesuai untuk Total Transactions
                                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-3 rounded-full font-semibold">
                                        {totalTransactions}
                                    </span>
                                    <FaShoppingCart className="text-3xl text-red-600 mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Transactions</h3>
                                        <p className="text-gray-500">View and manage all completed transactions.</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Admin Dashboard Overview */}
                        {isAdmin && (
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Sales Chart */}
                                    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center mb-4">
                                            <FaChartLine className="text-2xl text-gray-500 mr-4" />
                                            <h4 className="text-xl font-semibold">Sales Overview</h4>
                                        </div>
                                        <div className="h-40 bg-gray-200 rounded-lg"></div>
                                    </div>

                                    {/* User Statistics */}
                                    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center mb-4">
                                            <FaUsers className="text-2xl text-gray-500 mr-4" />
                                            <h4 className="text-xl font-semibold">User Statistics</h4>
                                        </div>
                                        <div className="h-40 bg-gray-200 rounded-lg"></div>
                                    </div>

                                   {/* Recent Orders */}
                                    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center mb-4">
                                            <FaListUl className="text-2xl text-gray-500 mr-4" />
                                            <h4 className="text-xl font-semibold">Recent Orders</h4>
                                        </div>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {transactions.slice(0, 5).map((transaction) => {
                                                // Format tanggal with numeric day/month/year format
                                                const formattedDate = new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                });

                                                // Get the batik code using the function
                                                const batikCode = getBatikCode(transaction.batik_id);

                                                return (
                                                    <li key={transaction.id} className="text-gray-600">
                                                        {formattedDate} - Rp {transaction.price.toLocaleString()}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
