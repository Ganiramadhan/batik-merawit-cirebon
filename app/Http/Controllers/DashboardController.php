<?php

namespace App\Http\Controllers;

use App\Models\Batik;
use App\Models\BatikDescription;
use App\Models\Member;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
    
        // Retrieve all batik data with related members
        $batikData = Batik::with('member')->get();
    
        // Retrieve all members
        $members = Member::all();
    
        // Retrieve all transactions, ordered by transaction_date in descending order
        $transactions = Transaction::orderBy('transaction_date', 'desc')->get();
    
        // Get the latest transaction
        $latestTransaction = $transactions->first();
    
        // Count the total number of batiks, members, and transactions
        $totalBatik = $batikData->count();
        $totalMembers = $members->count();
        $totalTransactions = $transactions->count();
    
        // Return the Inertia page with the data
        return Inertia::render('Dashboard', [
            'title' => 'Daftar Produk Batik',
            'user' => $user,
            'batikData' => $batikData,
            'members' => $members,
            'transactions' => $transactions,
            'latestTransaction' => $latestTransaction, 
            'totalBatik' => $totalBatik,
            'totalMembers' => $totalMembers,
            'totalTransactions' => $totalTransactions,
        ]);
    }
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
