<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;




class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $members = Member::all();
        return Inertia::render('Member/Index', [
            'title' => 'Daftar Perjain Batik',
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
            'image' => 'nullable|image|max:2048',
        ]);

        // Upload image if present
        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('images', 'public');
        }
    
        $member = Member::create($validatedData);
    
        return response()->json([
            'message' => 'Data Member berhasil ditambahkan.',
            'member' => $member,
        ]);
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
                // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            ]);
            $member = Member::findOrFail($id);
            if ($request->hasFile('image')) {
                if ($member->image && Storage::disk('public')->exists($member->image)) {
                    Storage::disk('public')->delete($member->image);
                }
                // Simpan gambar baru
                $validated['image'] = $request->file('image')->store('images', 'public');
            } else {
                $validated['image'] = $member->image;
            }
        
        
            $member->update($validated);
        
            return response()->json([
                'message' => 'Data Member berhasil diperbarui.',
                'member' => $member,
                'image_url' => $validated['image'] ? asset('storage/' . $validated['image']) . '?t=' . time() : null,
            ]);
        }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member) {
        if ($member->image) {
            Storage::disk('public')->delete($member->image);
        }

        $member->delete();
    
        return response()->json([
            'success' => true,
            'message' => 'Anggota berhasil dihapus!',
        ]);
    }
}
