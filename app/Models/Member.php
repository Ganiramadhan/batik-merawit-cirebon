<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $table = 'members';
    protected $fillable = ['id', 'name','place_of_birth','gender', 'employees', 'address', 'store_name', 'email', 'phone_number','image'];
}
