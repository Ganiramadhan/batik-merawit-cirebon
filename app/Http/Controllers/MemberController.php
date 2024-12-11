<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $members = Member::all();
        // print_r($members);die();

        return Inertia::render('Member/Index', [
            'title' => 'Daftar Member',
            'user' => $user,
            'members' => $members,
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
    public function store(Request $request) {
        // Validate input data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'store_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'required|string|max:500', 
            'place_of_birth' => 'required|string|max:100', 
            'gender' => 'required|string|max:100', 
            'employees' => 'required|string|max:100', 
        ]);
    
        $member = Member::create($validatedData);
    
        return response()->json($member);

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
    public function update(Request $request, $id)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'store_name' => 'required|string|max:255',  
                'email' => 'required|email|max:255',  
                'phone_number' => 'nullable|string', 
                'address' => 'required|string',  
                'place_of_birth' => 'required|string|max:100', 
                'gender' => 'required|string|max:100', 
                'employees' => 'required|string|max:100', 
            ]);
            $member = Member::findOrFail($id);
        
            $member->update($validated);
        
            return response()->json([
                'message' => 'Data batik berhasil diperbarui.',
                'member' => $member,
            ]);
        }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member) {
        $member->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Member berhasil dihapus!',
        ]);
    }
}
