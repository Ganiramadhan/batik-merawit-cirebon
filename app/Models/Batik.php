<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batik extends Model
{
    use HasFactory;
    
    protected $table = 'batiks';
    protected $fillable = ['id', 'code_batik', 'name', 'price', 'stock', 'qr_code', 'image', 'description', 'motif_creator', 'bricklayer_name', 'production_year', 'materials', 'member_id'];

    /**
     * Relasi ke tabel members
     * Satu Batik dimiliki oleh satu Member
     */
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }


}
