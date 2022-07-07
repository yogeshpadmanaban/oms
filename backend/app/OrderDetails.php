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

            ->select('od.*','cat.category_name', 'pd.name','pd.category','pd.product_type','pd.product_image','cd.name as customer_name','cad.cad_name','cad.status as cad_user_status')
            ->leftJoin('product_details AS pd', 'pd.product_id', '=', 'od.product_id')
            ->leftJoin('customer_details AS cd', 'cd.customer_id', '=', 'od.customer_id')
            ->leftJoin('category_details AS cat', 'cat.category_id', '=', 'pd.category')
            ->leftJoin('cads AS cad', 'cad.id', '=', 'od.cad_id')
            
            ->when($search != "" , function($result_two) use ($search){
                return $result_two->where('pd.name','LIKE','%'.$search.'%');
            })
            ->when($user_id != "" && $user_role == 'cad', function($result_two) use ($user_id){
                return $result_two->where('od.cad_id',$user_id);
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
            ->limit($limit)->offset($offset)
            ->orderBy('od.id',$sort)    
            ->get();

            // $queries = DB::getQueryLog();

            // dd($queries);

            $order_images =OrderImages::get()->toArray();

            $data['records']=$result_two;
            $data['num_rows'] = $result_two->count();

            foreach ($data['records'] as $key => $value)
            {

                $o_id = $data['records'][$key]->order_id;
                if($data['records'][$key]->order_id!='')
                {
                    $data['records'][$key]->order_id="<button type='button' style='cursor: default'; class='btn btn-primary'>".$data['records'][$key]->order_id."</button>";
                }

                if(!empty($order_images)){

                    $oimg_array = [];

                    foreach ($order_images as $oimg) {
                        if($o_id == $oimg['order_id']){ 

                            array_push($oimg_array, $data['records'][$key]->order_image="<a href = '".url($oimg['order_image'])."' download> <img class='img_enlarge' src='".url($oimg['order_image'])."'style='width:50px;height:50px'></a>");

                        }
                    }
                    $data['records'][$key]->order_image = implode('',$oimg_array);    

                }
                else{
                    $data['records'][$key]->order_image='-';    
                }


                // if($data['records'][$key]->order_image!='')
                // {
                //  $order_image = $data['records'][$key]->order_image;
                //  $data['records'][$key]->order_image="<a href = '".url($order_image)."' download> <img class='img_enlarge' src='".url($order_image)."'style='width:50px;height:50px'></a>";  
                // }

                if($user_role == 'admin' || $user_role == 'mould')
                {    

                    if($data['records'][$key]->mould_image!='')
                    {
                        $mould_image = $data['records'][$key]->mould_image;
                        $data['records'][$key]->mould_image="<a href = '".url($mould_image)."' download> <img class='img_enlarge' src='".url($mould_image)."'style='width:50px;height:50px'></a>";  
                    }
                    else{
                        $data['records'][$key]->mould_image='-';    
                    }

                }

                if($user_role == 'admin' || $user_role == 'cad')
                {  

                    if($data['records'][$key]->cad_image!='')
                    {
                        $cad_image = $data['records'][$key]->cad_image;
                        $data['records'][$key]->cad_image="<a href = '".url($cad_image)."' download> <img class='img_enlarge' src='".url($cad_image)."'style='width:50px;height:50px'></a>";    
                    }
                    else{
                        $data['records'][$key]->cad_image='-';  
                    }

                    if($data['records'][$key]->cad_status=='0')
                    {
                        $data['records'][$key]->cad_status="<button type='button' data-toggle='tooltip' data-placement='top' style='cursor:default' title='Contact cad to change status' class='btn btn-danger'>Pending</button>";

                    }
                    else{
                        $data['records'][$key]->cad_status="<button type='button' data-toggle='tooltip' data-placement='top' style='cursor:default' title='Contact cad to change status' class='btn btn-success'>Finished</button>";    

                    }

                }
                 
                if($data['records'][$key]->order_details!='')
                {
                    $order_details = substr($data['records'][$key]->order_details,0,20);
                    $data['records'][$key]->order_details = '<div data-title="'.$data['records'][$key]->order_details.'">'.$order_details.'...</span>  </div>';
                    #$data['records'][$key]->order_details = substr($data['records'][$key]->order_details,0,10);
                }
                else
                {
                    $data['records'][$key]->order_details='-';  
                } 
                
                if($data['records'][$key]->delivery_date=='')
                {   
                    $data['records'][$key]->delivery_date= '-';
                } 
                

                if($user_role == 'mould')
                { 

                    if($data['records'][$key]->mould_status=='0')
                    {
                        $data['records'][$key]->mould_status="<button class='btn btn-danger change_status'    data-url='/mould/status_change/' data-id='".base64_encode($data['records'][$key]->id)."'>Pending</button>";

                    }
                    else{
                        $data['records'][$key]->mould_status="<button class='btn btn-success change_status'   data-url='/mould/status_change/' data-id='".base64_encode($data['records'][$key]->id)."'>Finished</button>";

                    }

                }
                if($user_role == 'mould' || $user_role == 'cad')
                { 

                    $data['records'][$key]->action="<button type='button' class='btn btn-primary' onclick='ajx_get_order_details(this.id)'  id='".base64_encode($data['records'][$key]->id)."'>Add/Edit</button>";

                }

                if($user_role == 'admin')
                { 

                    if($data['records'][$key]->product_image!='')
                    {
                        $product_image = $data['records'][$key]->product_image;
                        $data['records'][$key]->product_image="<a href = '".url($product_image)."' download> <img class='img_enlarge' src='".url($product_image)."'style='width:70px;height:70px'></a>";    
                    }
                    else{
                        $data['records'][$key]->product_image='-';  
                    }

                    if($data['records'][$key]->mould_status=='0')
                    {
                        $data['records'][$key]->mould_status="<button type='button' data-toggle='tooltip' data-placement='top' style='cursor:default' title='Contact mould to change status' class='btn btn-danger'>Pending</button>";

                    }
                    else{
                        $data['records'][$key]->mould_status="<button type='button' data-toggle='tooltip' data-placement='top' style='cursor:default' title='Contact mould to change status' class='btn btn-success'>Finished</button>";    

                    }

                    if($data['records'][$key]->status=='1')
                    {
                        $data['records'][$key]->status="<i class='fa fa-close change_status' style='font-size:20px;color:red;cursor:pointer' data-url='/admin/order_change_status/' data-id='".base64_encode($data['records'][$key]->id)."' name='status".$data['records'][$key]->id."' data-status='status".$data['records'][$key]->id."' style=color:red></i>";

                    }
                    else{
                        $data['records'][$key]->status="<i class='fa fa-check change_status' style='font-size:20px;color:green;cursor:pointer' data-url='/admin/order_change_status/'aria-hidden='true' data-id='".base64_encode($data['records'][$key]->id)."' name='status".$data['records'][$key]->id."' data-status='status".$data['records'][$key]->id."' class='btn'  style=color:green></i>";    

                    }

                    if($data['records'][$key]->user_status=='1' && $data['records'][$key]->cad_user_status=='0')
                    {
                        $data['records'][$key]->user_status="<button type='button' data-toggle='tooltip' data-placement='top' style='cursor:default' title='Cad and Mould are Assigned' class='btn btn-success'> Assigned</button>";

                    }
                    else{

                        $data['records'][$key]->user_status="<button type='button' data-toggle='tooltip' data-placement='top' style='cursor:default' title='Assign Cad and Mould to change status' class='btn btn-danger'>Not Assigned</button>";

                    }

                    $data['records'][$key]->check_box="<input type='checkbox' class='checkbox' onclick='multi_select()'  value='".$data['records'][$key]->id."' name='data' style='width:20px;height:20px'>";   
                    
                    $data['records'][$key]->action="

                    <a href=".url('/execPDF/'.base64_encode($data['records'][$key]->id)).">
                    <i class='fa fa-download' style='font-size:18px;cursor:pointer' data-toggle='tooltip' data-placement='top' title='Download'></i>
                    </a>

                    <a href='/admin/edit_order/".base64_encode($data['records'][$key]->id)."'>  

                    <i class='fa fa-edit' style='font-size:18px;' data-toggle='tooltip' data-placement='top' title='Edit' id='".$data['records'][$key]->id."'></i></a>&nbsp;

                    <i class='fa fa-trash record_delete'  data-id='".base64_encode($data['records'][$key]->id)."' style='font-size:20px;cursor:pointer' data-url='/admin/order_delete/' data-toggle='tooltip' data-placement='top' title='Delete'  data-id='".base64_encode($data['records'][$key]->id)."' ></i>";
                    $data['records'][$key]->check="<input type=checkbox class='btn checkbox' id='".$data['records'][$key]->id."' value='' >";

                } 
            }
        $data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu']="order_list";
		return ($data['table_data']);
    }
}
