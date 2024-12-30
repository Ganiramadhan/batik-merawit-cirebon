<?php

namespace App\Http\Controllers;

use App\Models\MotifCreator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class MotifCreatorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $motif_creators = MotifCreator::all();

        // dd($backlayer);
        return Inertia::render('MotifCreator/Index', [
            'title' => 'Daftar Pembuat Motif Batik Tulis Merawit Cirebon',
            'user' => $user,
            'motifCreators' => $motif_creators,
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
        // Validasi input
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Generate next motif_creator_number
        $lastMotifCreator = MotifCreator::orderBy('motif_creator_number', 'desc')->first();
        $lastNumber = $lastMotifCreator ? (int) ltrim($lastMotifCreator->motif_creator_number, '0') : 0; // Ambil angka terakhir
        $nextNumber = $lastNumber + 1; // Tambah 1
        $motifCreatorNumber = str_pad($nextNumber, 2, '0', STR_PAD_LEFT); // Format menjadi dua digit, misalnya '01', '02', dst.

        // Create the Motif Creator record
        $motifCreator = MotifCreator::create([
            'name' => $validatedData['name'],
            'motif_creator_number' => $motifCreatorNumber,
        ]);

        // Kembalikan respons JSON
        return response()->json([
            'message' => 'Data Pembuat Motif berhasil ditambahkan.',
            'motif_creator' => $motifCreator,
        ], 201);
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
        ]);
        
        $motif_creator = MotifCreator::findOrFail($id);

        $motif_creator->update($validated);
    
        return response()->json([
            'message' => 'Data Pembuat Motif berhasil diperbarui.',
            'motif_creator' => $motif_creator,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(MotifCreator $motif_creator)
    {
        try {
            $motif_creator->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Data Pembuat Motif berhasil dihapus!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data!',
            ], 500);
        }
    }


}
