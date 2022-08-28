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

class ProductController extends Controller
{
    /**
     * Display a listing of product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function listing(Request $request)
	{
		$data['menu']="product_list";
		return view('admin.product.list',['menu'=>$data['menu']]);
	}

    /**
     * To fetch product records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_product_details(Request $request)
	{
		$result =ProductDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
		$data['totalRecords']=$result->count();

		$result_two = DB::table('product_details',  'pd')
						->select('pd.*','cd.category_name')
						->leftJoin('category_details AS cd', 'cd.category_id', '=', 'pd.category')
						->where('pd.deleted_at',NULL) // to get except soft-deleted data
						->where('pd.status','!=','2')
						->get();

		$data['records'] = $result_two;
		$data['num_rows'] = $result_two->count();

		$data['table_data'] ='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu'] = "cad_list";
		return ($data['table_data']);
	}

    /**
     * Show the form for creating a new product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function create(Request $request)
	{
		$data['menu'] = "product_list";
		$data['category'] = CategoryDetails::where('status','=','0')->get();

		return ['menu' => $data['menu'],'category' => $data['category']];
	}

    /**
     * To edit the product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_product(Request $request)
	{
		$data['product'] = ProductDetails::where('product_id',base64_decode($request->id))->first();	
		$data['category'] = CategoryDetails::where('status','=','0')->get();
		$data['menu'] = "product_list";
		return ['products' => $data['product'],'menu' => $data['menu'],'category' => $data['category']];
	}

    /**
     * To change status of product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function status_change($id)
	{
		$product_details = ProductDetails::find($id);
		$status = $product_details->status == '1' ? '0' : '1';
		$row_data = ProductDetails::where('product_id',$id)->update(['status' => $status]);
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * Remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function delete($id)
	{
		$row_data = ProductDetails::where('product_id',$id)->update(['status' => '2']);	
		ProductDetails::find($id)->delete();
		return response()->json([
			'success' => 'Record has been deleted successfully!',
			'status' => $row_data
		]);
	}

	/**
     * Remove the multiple product from storage.
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function multiple_delete($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len = count($data);

		for($i=0; $i<$data_len; $i++){
			$row_data = ProductDetails::find($data[$i]);
			$row_data->status='2';
			$row_data->save();

			$row_data->delete();
		}

		return response()->json([
			'success' => 'status changed successfully!',
			'status' =>  $row_data
		]);
	}

	/**
     * To change multiple status 
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function bulk_status_change($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len=count($data);

		for($i=0; $i<$data_len; $i++){
			$product_details = ProductDetails::find($data[$i]);
			$status = $product_details->status == '1' ? '0' : '1';
			$row_data = ProductDetails::where('product_id',$data[$i])->update(['status' => $status]);
		}

		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

	/**
     * To check product number 
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
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

    /**
     * To store product details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */ 
	public function store(Request $request)
	{
		$product_id=$request['product_id'];

		$image='';

		if($request->file('product_image')){
			$destinationPath = 'uploads/product/'; // upload path
			$files = $request->file('product_image');
			$profile_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move($destinationPath, $profile_path);
			$image = $destinationPath.$profile_path;
		}

		if($product_id!='')	{
			if(($request['temp_pdt_img']!='')&&($image=='')){	
				$image=$request['temp_pdt_img'];
			}
		}

		$product_data = [
			'category' => $request->input('category'),
			'product_image' => $image,
			'name' => $request->input('name'),
			'product_details' => $request->input('product_details'),
			'product_type' => $request->input('product_type'),
		];

		$res = ProductDetails::updateOrCreate(['product_id' => $product_id],$product_data); 
		$res['message'] = 'Product data updated successfully!';
		return $res;
	
	}
}
