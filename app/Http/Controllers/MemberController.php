<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;






class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();
        $members = Member::all();
        return Inertia::render('Member/Index', [
            'title' => 'Daftar Perajin Batik Tulis Merawit Cirebon',
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
    public function store(Request $request)
    {
        try {
            // Ambil nomor anggota terakhir dan buat nomor baru
            $lastMember = Member::latest('id')->first(); 
            $lastNumber = $lastMember ? (int) Str::afterLast($lastMember->member_number, '-') : 0; 
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT); 
            $generatedNumber = 'KMPIG-BTMC-' . $newNumber;
    
            // Validasi input
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'store_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone_number' => 'nullable|string|max:20',
                'address' => 'required|string|max:500',
                'place_of_birth' => 'required|string|max:100',
                'gender' => 'required|string', 
                'employees' => 'required|integer|min:0', 
                'image' => 'nullable|image|max:2048',
            ]);
    
            // Tambahkan nomor anggota yang dihasilkan secara otomatis
            $validatedData['member_number'] = $generatedNumber;
    
            // Generate QR Code dalam format SVG
            $url = url("/scan-member/{$validatedData['member_number']}");
            $qrCodeSvg = QrCode::format('svg')->size(200)->generate($url);
    
            // Encode QR Code SVG ke Base64
            $validatedData['qr_code'] = base64_encode($qrCodeSvg);
    
            // Upload gambar jika ada
            if ($request->hasFile('image')) {
                $validatedData['image'] = $request->file('image')->store('images', 'public');
            }
    
            // Simpan data anggota
            $member = Member::create($validatedData);
    
            // Kembalikan respons JSON
            return response()->json([
                'message' => 'Data Member berhasil ditambahkan.',
                'member' => $member,
            ], 201);
    
        } catch (\Exception $e) {
            // Tangani kesalahan dan berikan pesan error
            return response()->json([
                'message' => 'Terjadi kesalahan saat menambahkan data Member.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
                'member_number' => 'required|string|max:255',
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

        public function updateMemberNumbers()
        {
            $members = Member::orderBy('id')->get();
        
            foreach ($members as $index => $member) {
                $newNumber = 'KMPIG-BTMC-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
                
                $member->update(['member_number' => $newNumber]);
            }
        }
        

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        if ($member->image && Storage::disk('public')->exists($member->image)) {
            Storage::disk('public')->delete($member->image);
        }
        $member->delete();

        // $this->updateMemberNumbers();

        return response()->json([
            'success' => true,
            'message' => 'Anggota berhasil dihapus!',
        ]);
    }

}
