<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\Transaction;
use App\Models\Batik;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



class WelcomeController extends Controller
{
    //

    public function index()
    {    
        $user = Auth::user();

        // Retrieve all batik data with related members
        $batikData = Batik::with('member')->get();
    
        // Retrieve all members
        $members = Member::all();

        // Count the total number of batiks, members, and transactions
        $totalBatik = $batikData->count();
        $totalMember = $members->count();
    
        // Return the Inertia page with the data
        return Inertia::render('Welcome', [
            'user' => $user,
            'title' => 'Welcome Page',
            'batikData' => $batikData,
            'members' => $members,
            'totalBatik' => $totalBatik,
            'totalMember' => $totalMember,
        ]);
    }

    
    public function product()
    {    
        $user = Auth::user();

        // Retrieve all batik data with related members
        $batikData = Batik::with('member')->get();
    
        // Retrieve all members
        $members = Member::all();

        // Count the total number of batiks, members, and transactions
        $totalBatik = $batikData->count();
        $totalMember = $members->count();
    
        // Return the Inertia page with the data
        return Inertia::render('Product', [
            'title' => 'All Product',
            'batikData' => $batikData,
            'members' => $members,
            'totalBatik' => $totalBatik,
            'totalMember' => $totalMember,
            'user' => $user
        ]);
    }

    public function about () {
        $user = Auth::user();

        return Inertia::render('About', [
            'title' => 'About',
            'user' => $user
        ]);
    }
}



