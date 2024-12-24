<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackLayer extends Model
{
    use HasFactory;

    protected $table = 'backlayer';
    protected $fillable = ['id', 'backlayer_number', 'name'];
}
