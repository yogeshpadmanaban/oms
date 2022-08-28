<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealerDetails extends Model
{
    protected $table = 'dealer_details';
    protected $primaryKey= 'dealer_id';
    public $timestamps = false;

    protected $fillable = [
    	'dealer_name',
	];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
