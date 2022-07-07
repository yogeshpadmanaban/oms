<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrderImages extends Model
{
    protected $table = 'order_images';
    protected $primaryKey= 'id';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'order_image',
        'order_creator_role',
        'order_creator_id',
    ];
}
