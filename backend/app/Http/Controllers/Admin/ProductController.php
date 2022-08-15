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
		// $sort=$_REQUEST['order'];
		// $search=(isset($_REQUEST['search']))?$_REQUEST['search']:'';
		// $limit=(int)$_REQUEST['limit'];
		// $offset=(int)$_REQUEST['offset'];

		$result =ProductDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
		$data['totalRecords']=$result->count();

		$result_two= DB::table('product_details',  'pd')
			->select('pd.*','cd.category_name')
			->leftJoin('category_details AS cd', 'cd.category_id', '=', 'pd.category')
			// ->where('pd.name','LIKE','%'.$search.'%')
			->where('pd.deleted_at',NULL) // to get except soft-deleted data
			->where('pd.status','!=','2')
			// ->limit($limit)->offset($offset)
			// ->orderBy('pd.product_id',$sort)
			->get();

		$data['records']=$result_two;
		$data['num_rows'] = $result_two->count();

		$data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu']="cad_list";
		return ($data['table_data']);
	}

	//to create product 
	public function create(Request $request)
	{
		$data['menu']="product_list";
		$data['category']=CategoryDetails::where('status','=','0')->get();

		return ['menu'=>$data['menu'],'category'=>$data['category']];
	}

	//to get data of particular id for update
	public function edit_product(Request $request)
	{
		$data['product']=ProductDetails::where('product_id',base64_decode($request->id))->first();	
		$data['category']=CategoryDetails::where('status','=','0')->get();
		$data['menu']="product_list";
		return ['products'=>$data['product'],'menu'=>$data['menu'],'category'=>$data['category']];
	}

	//to change status of particular id
	public function status_change($id)
	{
		$product_status=ProductDetails::find($id);
		if($product_status->status=='1')
			$status='0';
		else
			$status='1';

		$row_data=ProductDetails::find($id);
		$row_data->status=$status;
		$row_data->save();
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status'=>$row_data->status
		]);
	}

	//to delete data of particular id
	public function delete($id)
	{
		$row_data = ProductDetails::where('product_id',$id)->update(['status' => '2']);	
		ProductDetails::find($id)->delete();
		return response()->json([
			'success' => 'Record has been deleted successfully!',
			'status' => $row_data
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
			'status'=>$row_data
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
		$product_id=$request['product_id'];

		$image='';

		if($request->file('product_image')){
			$destinationPath = 'uploads/product/'; // upload path
			$files = $request->file('product_image');
			$profile_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move($destinationPath, $profile_path);
			$image=$destinationPath.$profile_path;
		}

		if($product_id!='')	{
			if(($request['temp_pdt_img']!='')&&($image=='')){	
				$image=$request['temp_pdt_img'];
			}
		}

		$product_data = [
			'category'=>$request->input('category'),
			'product_image'=>$image,
			'name'=>$request->input('name'),
			'product_details'=>$request->input('product_details'),
			'product_type'=>$request->input('product_type'),
		];

		$res = ProductDetails::updateOrCreate(['product_id'=>$product_id],$product_data); 
		$res['message'] = 'Product data updated successfully!';
		return $res;
	
	}
}
