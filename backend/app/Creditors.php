<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Creditors extends Model
{
    protected $table = 'creditors';
    protected $primaryKey= 'creditor_id';
    public $timestamps = false;

    protected $fillable = [
    	'creditor_name',
        'due_days'
	];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
