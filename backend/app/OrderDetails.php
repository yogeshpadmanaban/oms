<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class OrderDetails extends Model
{
    protected $table = 'order_details';
    protected $primaryKey= 'id';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
		'product_id',
		'customer_id',
        'mould_id',
        'cad_id',
        'purity',
        'jc_number',
        'quantity',
		'weight',
		'design_by',
        'product_type',
		'delivery_date',
        'metal_provided',
        'metal_provided_date',
        'order_due_date',
        'order_image',
        'order_details',
        'cad_image',
        'mould_image',
        'cad_charge',
        'cad_status',
        'mould_status',
        'user_status',
		'status',
        'order_creator_role',
        'order_creator_id',
    ];

    use SoftDeletes;

    protected $dates = ['deleted_at'];

  	public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }	

    public static function fetchdata($req_arr = '')
    {
        $user_role = $req_arr['user_role'];

        $user_id = $req_arr['user_id'];
        $sort = $req_arr['sort'];
        $search = $req_arr['search'];
        $limit = $req_arr['limit'];
        $offset = $req_arr['offset'];
        $from_date = $req_arr['from_date'];
        $to_date = $req_arr['to_date'];

        if($user_role == 'vigat_user')
        {
            $result =OrderDetails::where('deleted_at',NULL)
                                    ->where('order_creator_role','=','vigat_user')
                                    ->where('order_creator_id','=',$vc_user_id)
                                    ->get(); // to get except soft-deleted data
        }
        else
        {
            $result =OrderDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
        }    
        
        $data['totalRecords']=$result->count();

        // DB::connection()->enableQueryLog();

        $result_two= DB::table('order_details',  'od')

            ->select('od.*','cat.category_name', 'pd.name','pd.category','pd.product_type','pd.product_image','cd.name as customer_name')
            ->leftJoin('product_details AS pd', 'pd.product_id', '=', 'od.product_id')
            ->leftJoin('customer_details AS cd', 'cd.customer_id', '=', 'od.customer_id')
            ->leftJoin('category_details AS cat', 'cat.category_id', '=', 'pd.category')
            
            ->when($search != "" , function($result_two) use ($search){
                return $result_two->where('pd.name','LIKE','%'.$search.'%');
            })

            ->when($user_id != "" && $user_role == 'vigat_user', function($result_two) use ($user_id, $user_role){
                return $result_two->where('od.order_creator_role',$user_role)
                                  ->where('od.order_creator_id',$user_id);    
            })
            ->where('od.deleted_at',NULL) // to get except soft-deleted data
            ->where('od.status','!=','2')
            ->when($from_date != "" && $to_date != "", function($result_two) use ($from_date, $to_date){
                return $result_two->whereBetween('od.delivery_date', [$from_date, $to_date]);
            })
            // ->limit($limit)->offset($offset)
            ->orderBy('od.id',$sort)    
            ->get();

            // $queries = DB::getQueryLog();

            $order_images =OrderImages::get()->toArray();

            $data['records']=$result_two;
            $data['num_rows'] = $result_two->count();

            // foreach ($data['records'] as $key => $value){
            //     $o_id = $data['records'][$key]->order_id;

            //     if(!empty($order_images)){

            //         $oimg_array = [];

            //         foreach ($order_images as $oimg) {
            //             if($o_id == $oimg['order_id']){ 
            //                 array_push($oimg_array, $data['records'][$key]->order_image=$oimg['order_image']);
            //             }
            //         }
            //         $data['records'][$key]->order_image = implode('',$oimg_array);    

            //     }
            //     else{
            //         $data['records'][$key]->order_image=' ';    
            //     }

            // }
        $data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';

        $data['menu']="order_list";
		return ($data['table_data']);
    }
}
