<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use App\ProductDetails;
use App\CategoryDetails;
use Config;
use Session;


class ProductController extends Controller
{
	//to view product listing
	public function listing(Request $request)
	{
		$data['menu']="product_list";
		return view('admin.product.list',['menu'=>$data['menu']]);
	}

	//to fetch cad data
	public function fetch_product_details(Request $request)
	{
		$sort=$_REQUEST['order'];
		$search=(isset($_REQUEST['search']))?$_REQUEST['search']:'';
		$limit=(int)$_REQUEST['limit'];
		$offset=(int)$_REQUEST['offset'];

		$result =ProductDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
		$data['totalRecords']=$result->count();

		$result_two= DB::table('product_details',  'pd')
			->select('pd.*','cd.category_name')
			->leftJoin('category_details AS cd', 'cd.category_id', '=', 'pd.category')
			->where('pd.name','LIKE','%'.$search.'%')
			->where('pd.deleted_at',NULL) // to get except soft-deleted data
			->where('pd.status','!=','2')
			->limit($limit)->offset($offset)
			->orderBy('pd.product_id',$sort)
			->get();

		$data['records']=$result_two;
		$data['num_rows'] = $result_two->count();

		foreach ($data['records'] as $key => $value)
		{
			if($data['records'][$key]->product_image!='')
			{
				$product_image = $data['records'][$key]->product_image;

				$data['records'][$key]->product_image="<a href = '".url($product_image)."' download> <img src='".url($product_image)."' style='width:50px;height:50px' class='img_enlarge'></a>";	
			}
			else{
				$data['records'][$key]->product_image="-";	
			}

			if($data['records'][$key]->product_details!='')
			{
				
				$product_details = substr($data['records'][$key]->product_details,0,20);
				$data['records'][$key]->product_details = '<div data-title="'.$data['records'][$key]->product_details.'">'.$product_details.'...</span>  </div>';
				#$data['records'][$key]->product_details = substr($data['records'][$key]->product_details,0,10);

			}
			else
			{
				$data['records'][$key]->product_details='-';	
			} 

			if($data['records'][$key]->status=='1')
			{
				$data['records'][$key]->status="<i class='fa fa-close change_status' style='font-size:20px;color:red;cursor:pointer' data-url='/admin/product_change_status/' data-id='".base64_encode($data['records'][$key]->product_id)."' name='status".$data['records'][$key]->product_id."' data-status='status".$data['records'][$key]->product_id."' style=color:red></i>";
			}
			else{
				$data['records'][$key]->status="<i class='fa fa-check change_status' style='font-size:20px;color:green;cursor:pointer' aria-hidden='true' data-url='/admin/product_change_status/' data-id='".base64_encode($data['records'][$key]->product_id)."' name='status".$data['records'][$key]->product_id."' data-status='status".$data['records'][$key]->product_id."' class='btn' style=color:green></i>";	
		
			}
			$data['records'][$key]->check_box="<input type='checkbox'  class='checkbox' onclick='multi_select()'  value='".$data['records'][$key]->product_id."' name='data' style='width:20px;height:20px'>";	
			
			$data['records'][$key]->action="<a href='/admin/edit_product/".base64_encode($data['records'][$key]->product_id)."'>
			<i class='fa fa-edit' style='font-size:18px;' data-toggle='tooltip' data-placement='top' title='Edit' id='".$data['records'][$key]->product_id."'></i></a>&nbsp;

			<i class='fa fa-trash record_delete' style='font-size:20px;cursor:pointer' data-toggle='tooltip' data-placement='top' title='Delete' data-url='/admin/product_delete/' data-id='".base64_encode($data['records'][$key]->product_id)."'></i>";
			$data['records'][$key]->check="<input type=checkbox class='btn checkbox'id='".$data['records'][$key]->product_id."' value='' >";
		}
		$data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu']="cad_list";
		echo $data['table_data'];
		exit();
	}

	//to create product 
	public function create(Request $request)
	{
		$data['menu']="product_list";
		$data['category']=CategoryDetails::where('status','=','0')->get();
		return view('admin.product.create',['menu'=>$data['menu'],'category'=>$data['category']]);
	}

	//to get data of particular id for update
	public function edit_product(Request $request)
	{
		$data['product']=ProductDetails::where('product_id',base64_decode($request->id))->first();	
		$data['category']=CategoryDetails::where('status','=','0')->get();
		$data['menu']="product_list";
		return view('admin.product.create', ['products'=>$data['product'],'menu'=>$data['menu'],'category'=>$data['category']]);
	}

	//to change status of particular id
	public function status_change($id)
	{
		$product_status=ProductDetails::find(base64_decode($id));
		if($product_status->status=='1')
			$status='0';
		else
			$status='1';

		$row_data=ProductDetails::find(base64_decode($id));
		$row_data->status=$status;
		$row_data->save();
		
		return response()->json([
		'success' => 'status changed successfully!',
		'status'=>$status
		]);
	}

	//to delete data of particular id
	public function delete($id)
	{
		ProductDetails::where('product_id',base64_decode($id))->update(['status' => '2']);	
		ProductDetails::find(base64_decode($id))->delete();
		return response()->json([
		'success' => 'Record has been deleted successfully!'
		]);
	}

	public function multiple_delete($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len=count($data);
		for($i=0; $i<$data_len; $i++)
		{
			$row_data=ProductDetails::find($data[$i]);
			$row_data->status='2';
			$row_data->save();

			$row_data->delete();
		}
		return response()->json([
		'success' => 'status changed successfully!',
		'status'=>$row_data
		]);
	}

	public function bulk_status_change($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len=count($data);
		for($i=0; $i<$data_len; $i++)
		{
			$product_status=ProductDetails::find($data[$i]);
			if($product_status->status=='1')
				$status='0';
			else
				$status='1';

			$row_data=ProductDetails::find($data[$i]);
			$row_data->status=$status;
			$row_data->save();
		}
		return response()->json([
		'success' => 'status changed successfully!',
		'status'=>$status
		]);
	}

	public function product_name_check(Request $request){
		$product_name = $request->pdt_name;
		$product_id = $request->product_id;
		$result=ProductDetails::select('name')->where('name',$product_name)	
							->when($product_id != "", function($result) use ($product_id){
								return $result->where('product_id','!=',$product_id);
							})
							->where('status','!=','2')
							->exists();
		echo $result;
	}

	//to store product details 
	public function store(Request $request)
	{
		$product_id=$request['hdn_id'];

		$image='';

		if($request->file('pdt_img'))
		{
			$destinationPath = 'uploads/product/'; // upload path
			$files = $request->file('pdt_img');
			$profile_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move($destinationPath, $profile_path);
			$image=$destinationPath.$profile_path;
		}

		if($product_id!='')	
		{
			if(($request['temp_pdt_img']!='')&&($image==''))
			{	
				$image=$request['temp_pdt_img'];
			}
		}

		$product_data = [
			'category'=>$request->input('pdt_category'),
			'product_image'=>$image,
			'name'=>$request->input('pdt_name'),
			'product_details'=>$request->input('pdt_details'),
			'product_type'=>$request->input('product_type'),
		];

		#echo "<pre>"; 
		#print_r($product_data);exit();

		ProductDetails::updateOrCreate(['product_id'=>$product_id],$product_data); 
		Session::flash('session_msg','Product data updated successfully!');
		return redirect()->to('admin/product_listing');	
	
	}
}
