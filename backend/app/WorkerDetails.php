<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkerDetails extends Model
{
    protected $table = 'worker_details';
    protected $primaryKey= 'worker_id';
    public $timestamps = false;

    protected $fillable = [
    	'worker_name',
	];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

}
