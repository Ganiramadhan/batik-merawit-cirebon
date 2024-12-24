<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotifCreator extends Model
{
    use HasFactory;

    protected $table = 'motif_creator';
    protected $fillable = ['id', 'motif_creator_number', 'name'];
}
