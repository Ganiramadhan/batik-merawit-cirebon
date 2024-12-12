import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { FaStore, FaShoppingCart, FaUsers, FaChartLine, FaListUl } from 'react-icons/fa';

export default function Dashboard({ auth, totalBatik, totalMembers, totalTransactions, transactions }) {
    const isAdmin = auth.user.role === 'admin';
    
    const Layout = isAdmin ? AuthenticatedLayout : UserLayout;
    const headerText = isAdmin ? 'Admin Dashboard' : 'User Dashboard';

    return (
        <Layout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-600 leading-tight">{headerText}</h2>}
        >
            <Head title={headerText} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {isAdmin ? 'Welcome Admin! You\'re logged in!' : 'Welcome User! You\'re logged in!'}
                        </div>

                        {/* Display total counts for Admin */}
                        {isAdmin && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {/* Total Products */}
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl">
                                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs py-1 px-3 rounded-full font-semibold">
                                        {totalBatik}
                                    </span>
                                    <FaStore className="text-3xl text-blue-600 mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Batik</h3>
                                        <p className="text-gray-500">Manage and view all batik products.</p>
                                    </div>
                                </div>

                                {/* Total Members */}
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl">
                                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs py-1 px-3 rounded-full font-semibold">
                                        {totalMembers}
                                    </span>
                                    <FaUsers className="text-3xl text-green-600 mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Members</h3>
                                        <p className="text-gray-500">Manage and view all members of the platform.</p>
                                    </div>
                                </div>

                                {/* Total Transactions */}
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl">
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-3 rounded-full font-semibold">
                                        {totalTransactions}
                                    </span>
                                    <FaShoppingCart className="text-3xl text-red-600 mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Transactions</h3>
                                        <p className="text-gray-500">View and manage all completed transactions.</p>
                                    </div>
                                </div>
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
                                            {transactions.slice(0, 5).map((transaction) => (
                                                <li key={transaction.id} className="text-gray-600">
                                                    Order #{transaction.id} - {transaction.total_price} - {transaction.transaction_date}
                                                </li>
                                            ))}
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
