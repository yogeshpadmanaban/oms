<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerDetails extends Model
{
    protected $table = 'customer_details';
    protected $primaryKey= 'customer_id';
    public $timestamps = false;

    protected $fillable = [
		'profile_picture',
		'name',
		'address',
		'city',
		'state',
		'gst_no',
		'pan_no',
		'other_upload',
    ];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }	
}
