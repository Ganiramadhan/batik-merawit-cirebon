<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatikDescription extends Model
{
    use HasFactory;

    protected $table = 'batik_description';
    protected $fillable = ['id', 'name', 'description'];

}
