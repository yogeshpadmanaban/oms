<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\CategoryDetails;

class ProductDetails extends Model
{
    protected $table = 'product_details';
    // protected $primaryKey= 'product_id';
    public $timestamps = false;

    protected $fillable = [
        'creditors',
    	// 'category',
		'name',
		'product_image',
        'product_details',
        'product_type'
	];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    // public function CategoryDetails(){
    //     return $this->belongsTo();
    // }

    public function CategoryDetails()
    {
        return $this->hasOne(CategoryDetails::class);
    }
}
