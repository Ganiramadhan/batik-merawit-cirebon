import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { FaStore, FaShoppingCart, FaUsers, FaChartLine, FaListUl } from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2'; // Import grafik dari react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Define color constants
const COLORS = {
    batik: {
        background: 'rgba(54, 162, 235, 0.6)',
        border: 'rgba(54, 162, 235, 1)',
    },
    members: {
        background: 'rgba(75, 192, 192, 0.6)',
        border: 'rgba(75, 192, 192, 1)',
    },
    transactions: {
        background: 'rgba(255, 99, 132, 0.6)',
        border: 'rgba(255, 99, 132, 1)',
    },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard({ auth, totalBatik, totalMembers, totalTransactions, transactions, batikData }) {
    const isAdmin = auth.user.role === 'admin';
    const Layout = isAdmin ? AuthenticatedLayout : UserLayout;
    const headerText = isAdmin ? 'Dashboard' : 'Dashboard';


    // useEffect(() => {
    //     console.log('Auth:', auth);
    //     console.log('Total Batik:', totalBatik);
    //     console.log('Total Members:', totalMembers);
    //     console.log('Total Transactions:', totalTransactions);
    //     console.log('Transactions:', transactions);
    //     console.log('Batik Data:', batikData);
    // }, [auth, totalBatik, totalMembers, totalTransactions, transactions, batikData]);
    
      // Group and count batik data by member
    const memberBatikData = batikData.reduce((acc, data) => {
        const memberName = data.member?.name || 'Unknown Member';
        if (!acc[memberName]) {
            acc[memberName] = 0;
        }
        acc[memberName] += 1;
        return acc;
    }, {});


        // Prepare labels and data
        const labels = Object.keys(memberBatikData);
        const data = Object.values(memberBatikData);

        const userStatisticsData = {
            labels: labels, 
            datasets: [
                {
                    label: 'Jumlah Batik Dimiliki',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        };


        

    const [salesTotalPerMonth, setSalesTotalPerMonth] = useState(new Array(12).fill(0)); 
    const [salesOverviewData, setSalesOverviewData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Jumlah Transaksi',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.4,
            },
        ],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const monthIndex = context.dataIndex; // Bulan keberapa
                        const totalPrice = salesTotalPerMonth[monthIndex]; // Total harga bulan tersebut
    
                        // Periksa apakah totalPrice lebih dari atau sama dengan 1 juta
                        if (totalPrice >= 1) {
                            return `Rp ${totalPrice.toLocaleString('id-ID')} juta`; // Menampilkan dalam juta
                        } else {
                            // Jika kurang dari 1 juta, tampilkan dalam format desimal biasa
                            return `Rp ${Math.round(totalPrice * 1_000_000).toLocaleString('id-ID')}`;
                        }
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return `${value.toLocaleString('id-ID')} `; // Tampilkan jumlah transaksi
                    },
                },
                title: {
                    display: true,
                    text: 'Jumlah Transaksi', // Label untuk sumbu Y
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Bulan', // Label untuk sumbu X
                },
            },
        },
    };
    
    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const transactionsPerMonth = new Array(12).fill(0); // Jumlah transaksi per bulan
            const totalPricePerMonth = new Array(12).fill(0); // Total harga per bulan
            const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];

            transactions.forEach((transaction) => {
                const transactionDate = new Date(transaction.transaction_date);
                const month = transactionDate.getMonth();
                transactionsPerMonth[month] += 1; // Hitung jumlah transaksi
                totalPricePerMonth[month] += transaction.price / 1_000_000; // Total harga dalam juta rupiah
            });

            // Perbarui data grafik
            setSalesOverviewData((prevState) => ({
                ...prevState,
                labels: monthNames,
                datasets: [
                    {
                        ...prevState.datasets[0],
                        data: transactionsPerMonth, // Gunakan jumlah transaksi untuk grafik
                    },
                ],
            }));

            // Perbarui total harga untuk tooltip
            setSalesTotalPerMonth(totalPricePerMonth);
        }
    }, [transactions]);



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
                              {/* Total Batik */}
                                <Link
                                    href="/batik"
                                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    <span
                                        className="absolute top-2 right-2 text-white text-xs py-1 px-3 rounded-full font-semibold"
                                        style={{ backgroundColor: COLORS.batik.border }}
                                    >
                                        {totalBatik}
                                    </span>
                                    <FaStore className="text-3xl mr-4" style={{ color: COLORS.batik.border }} />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Data Batik Merawit</h3>
                                        <p className="text-gray-500">Kelola dan lihat semua produk batik yang tersedia.</p>
                                    </div>
                                </Link>

                              {/* Total Members */}
                                <Link
                                    href="/member"
                                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    <span
                                        className="absolute top-2 right-2 text-white text-xs py-1 px-3 rounded-full font-semibold"
                                        style={{ backgroundColor: COLORS.members.border }}
                                    >
                                        {totalMembers}
                                    </span>
                                    <FaUsers className="text-3xl mr-4" style={{ color: COLORS.members.border }} />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Data Perajin Batik</h3>
                                        <p className="text-gray-500">Kelola dan lihat semua perajin batik.</p>
                                    </div>
                                </Link>

                                {/* Total Transactions */}
                                {/* <Link
                                    href="/transaction"
                                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    <span
                                        className="absolute top-2 right-2 text-white text-xs py-1 px-3 rounded-full font-semibold"
                                        style={{ backgroundColor: COLORS.transactions.border }}
                                    >
                                        {totalTransactions}
                                    </span>
                                    <FaShoppingCart className="text-3xl mr-4" style={{ color: COLORS.transactions.border }} />
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800">Total Transactions</h3>
                                        <p className="text-gray-500">View and manage all completed transactions.</p>
                                    </div>
                                </Link> */}
                            </div>
                        )}

                        {/* Admin Dashboard Overview */}
                        {isAdmin && (
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Dashboard Overview</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {/* Sales Chart */}
                                    {/* <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center mb-4">
                                            <FaChartLine className="text-2xl text-gray-500 mr-4" />
                                            <h4 className="text-xl font-semibold">Sales Overview</h4>
                                        </div>
                                        <Line data={salesOverviewData} options={options} />
                                        </div> */}

                                    {/* User Statistics */}
                                    <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center mb-4">
                                            <FaUsers className="text-2xl text-gray-500 mr-4" />
                                            <h4 className="text-xl font-semibold">Batik Ownership Statistics</h4>
                                            </div>
                                        <Bar data={userStatisticsData} />
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
