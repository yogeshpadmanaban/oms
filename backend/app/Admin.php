<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $guard = 'admin';
    protected $table = 'admin';
    protected $primaryKey= 'id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'password',
        'status'
    ];

    protected $dates = [
        'created_date',
        'modified_date'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

}
