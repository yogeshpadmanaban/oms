<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryDetails extends Model
{
    protected $table = 'category_details';
    protected $primaryKey= 'category_id';
    public $timestamps = false;

    protected $fillable = [
    	'category_name',
	];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function ProductDetails()    
    {
        return $this->belongsTo('App\ProductDetails');
    }
}
