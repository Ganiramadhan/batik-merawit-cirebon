<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transaction';
    protected $fillable = ['id', 'batik_id', 'transaction_date', 'notes'];

    public function batik()
    {
        return $this->belongsTo(Batik::class, 'batik_id', 'id');
    }
}
