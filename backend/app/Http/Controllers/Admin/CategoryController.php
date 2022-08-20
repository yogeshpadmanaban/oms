<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use App\CategoryDetails;
use Config;
use Session;


class CategoryController extends Controller
{
    /**
     * Display a listing of category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function listing(Request $request)
	{
		$data['menu'] = "category_list";
		return view('admin.category.list',['menu' => $data['menu']]);
	}

    /**
     * To fetch category records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_category_details(Request $request)
	{
		$result =CategoryDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
		$data['totalRecords'] = $result->count();

		$result_two=CategoryDetails::where('deleted_at',NULL)->get();
		$data['records'] = $result_two;
		$data['num_rows'] = $result_two->count();

		$data['table_data'] ='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu'] = "cad_list";
		return ($data['table_data']);
	}

    /**
     * Show the form for creating a new category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function create(Request $request)
	{
		$data['menu'] = "category_list";
		return view('admin.category.create',['menu' => $data['menu']]);
	}

    /**
     * To edit the category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_category($id)
	{
		$data['category'] = CategoryDetails::where('category_id',$id)->first();	
		$data['menu'] = "category_list";
		return ['category' => $data['category'],'menu'=>$data['menu']];
		exit();
	}

    /**
     * To change status of category
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function status_change($id)
	{
		$category_details = CategoryDetails::find($id);
		$status = $category_details->status == '1' ? '0' : '1';
		$row_data = CategoryDetails::where('category_id',$id)->update(['status' => $status]);
	
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * Remove the specified category from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function delete($id)
	{
		CategoryDetails::where('category_id',$id)->update(['status' => '2']);	
		CategoryDetails::find($id)->delete();
		return response()->json([
			'success' => 'Record has been deleted successfully!',
			'status' => $row_data
		]);
	}

	/**
     * Remove the multiple category from storage.
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function multiple_delete($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len = count($data);
		for($i=0; $i<$data_len; $i++){
			$row_data=CategoryDetails::find($data[$i]);
			$row_data->status='2';
			$row_data->save();

			$row_data->delete();
		}
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $row_data
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
			$category_details=CategoryDetails::find($data[$i]);

			$status = $category_details->status == '1' ? '0' : '1';
			$row_data=CategoryDetails::where('category_id',$data[$i])->update(['status'=>$status]);
		}
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * To check category duplicate name 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function category_name_check(Request $request){
		$category_name = $request->category_name;
		$category_id = $request->category_id;
		$result=CategoryDetails::select('category_name')
								->where('category_name',$category_name)										
								->when($category_id != "", function($result) use ($category_id){
									return $result->where('category_id','!=',$category_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}

    /**
     * To store category details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function store_category(Request $request)
	{
		$category_id =$request['id'];

		$category_data = [
			'category_name' => $request->input('category_name')
		];

		$res = CategoryDetails::updateOrCreate(['category_id' => $category_id],$category_data); 
		$res['message'] = 'Category data updated successfully!';
		return $res;	
	}
}