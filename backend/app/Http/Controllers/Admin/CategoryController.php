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
	//to view category listing
	public function listing(Request $request)
	{
		$data['menu']="category_list";
		return view('admin.category.list',['menu'=>$data['menu']]);
	}

	//to fetch cad data
	public function fetch_category_details(Request $request)
	{
		// $sort=$_REQUEST['order'];
		// $search=(isset($_REQUEST['search']))?$_REQUEST['search']:'';
		// $limit=(int)$_REQUEST['limit'];
		// $offset=(int)$_REQUEST['offset'];

		$result =CategoryDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
		$data['totalRecords']=$result->count();

		$result_two=CategoryDetails::
		
		// limit($limit)->offset($offset)
					// where('category_name','LIKE','%'.$search.'%')
					where('deleted_at',NULL) // to get except soft-deleted data
					// ->orderBy('category_id',$sort)
					->get();
		$data['records']=$result_two;
		$data['num_rows'] = $result_two->count();

		foreach ($data['records'] as $key => $value)
		{
			// if($data['records'][$key]->status=='1')
			// {
			// 	$data['records'][$key]->status="<i class='fa fa-close change_status' style='font-size:20px;color:red;cursor:pointer' data-url='/admin/category_change_status/' data-id='".base64_encode($data['records'][$key]->category_id)."' name='status".$data['records'][$key]->category_id."' data-status='status".$data['records'][$key]->category_id."' style=color:red></i>";
			// }
			// else{
			// 	$data['records'][$key]->status="<i class='fa fa-check change_status' style='font-size:20px;color:green;cursor:pointer' aria-hidden='true' data-url='/admin/category_change_status/' data-id='".base64_encode($data['records'][$key]->category_id)."' name='status".$data['records'][$key]->category_id."' data-status='status".$data['records'][$key]->category_id."' class='btn' style=color:green></i>";	
		
			// }
			$data['records'][$key]->check_box="<input type='checkbox' class='checkbox' onclick='multi_select()' value='".$data['records'][$key]->category_id."' name='data' style='width:20px;height:20px'>";	
			
			$data['records'][$key]->action=" <i class='fa fa-edit'  onclick='ajx_category_edit(this.id)' style='font-size:18px;cursor:pointer' data-toggle='tooltip' data-placement='top' title='Edit'  id='".base64_encode($data['records'][$key]->category_id)."'></i></a>&nbsp;

			<i class='fa fa-trash record_delete' style='font-size:20px;cursor:pointer' data-toggle='tooltip' data-placement='top' title='Delete' data-url='/admin/category_delete/' data-id='".base64_encode($data['records'][$key]->category_id)."'></i>";
			$data['records'][$key]->check="<input type=checkbox class='btn'id='".$data['records'][$key]->category_id."' value='' >";
		}
		$data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu']="cad_list";
		echo $data['table_data'];
		exit();
	}

	//to create category 
	public function create(Request $request)
	{
		$data['menu']="category_list";
		return view('admin.category.create',['menu'=>$data['menu']]);
	}

	//to get data of particular id for update
	public function edit_category($id)
	{
		$data['category']=CategoryDetails::where('category_id',$id)->first();	
		$data['menu']="category_list";
		return ['category' => $data['category'],'menu'=>$data['menu']];
		exit();
	}

	//to change status of particular id
	public function status_change($id)
	{
		$category_status=CategoryDetails::find(base64_decode($id));
		if($category_status->status=='1')
			$status='0';
		else
			$status='1';

		$row_data=CategoryDetails::find(base64_decode($id));
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
		CategoryDetails::where('category_id',$id)->update(['status' => '2']);	
		CategoryDetails::find($id)->delete();
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
			$row_data=CategoryDetails::find($data[$i]);
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
			$category_status=CategoryDetails::find($data[$i]);
			if($category_status->status=='1')
				$status='0';
			else
				$status='1';

			$row_data=CategoryDetails::find($data[$i]);
			$row_data->status=$status;
			$row_data->save();
		}
		return response()->json([
			'success' => 'status changed successfully!',
			'status'=>$status
		]);
	}

	public function category_name_check(Request $request){
		$category_name = $request->category_name;
		$category_id = $request->category_id;
		$result=CategoryDetails::select('category_name')->where('category_name',$category_name)										->when($category_id != "", function($result) use ($category_id){
									return $result->where('category_id','!=',$category_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}

	//to store category details 
	public function store_category(Request $request)
	{
		$category_id=$request['hdn_id'];

		$category_data = [
			'category_name'=>$request->input('category_name')
		];

		$res = CategoryDetails::updateOrCreate(['category_id'=>$category_id],$category_data); 
		// Session::flash('session_msg','Category data updated successfully!');
		return $res;	
	}
}