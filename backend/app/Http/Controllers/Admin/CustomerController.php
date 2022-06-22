<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use App\CustomerDetails;
use Session;

class CustomerController extends Controller
{
	//to view customer listing
	public function listing(Request $request)
	{
		$data['menu']="customer_list";
		return $data['menu'];
	}

	//to fetch customer data
	public function fetch_customer_details(Request $request)
	{
		// $sort=$_REQUEST['order'];
		// $search=(isset($_REQUEST['search']))?$_REQUEST['search']:'';
		// $limit=(int)$_REQUEST['limit'];
		// $offset=(int)$_REQUEST['offset'];

		$result =CustomerDetails::where('status','!=','2')->get(); // to get except soft-deleted data
		$data['totalRecords']=$result->count();
		$result_two=CustomerDetails::
		
		
		// limit($limit)->offset($offset)
					// ->where('name','LIKE','%'.$search.'%')
					where('status','!=','2') // to get except soft-deleted data
					// ->orderBy('customer_id',$sort)
					->get();

		$data['records']=$result_two;
		$data['num_rows'] = $result_two->count();

		foreach ($data['records'] as $key => $value)
		{
			$profile_picture = "assets/images/dummy-profile-image.png";
			$file_name = "";

			if($data['records'][$key]->profile_picture!='')
			{
				$profile_picture = $data['records'][$key]->profile_picture;
			}

			if($data['records'][$key]->other_upload!=''){

				$file_name_arr = explode('/',$data['records'][$key]->other_upload);
				$file_name = end($file_name_arr);

				$finfo = pathinfo($data['records'][$key]->other_upload);

				$other_upload = '';

				if($finfo['extension'] == 'pdf')
				{
					$other_upload = 'assets/images/pdf-file.svg';
				}
				if($finfo['extension'] == 'docx')	
				{
					$other_upload = 'assets/images/doc-file.svg';
				}

				$data['records'][$key]->other_upload="<a href='javascript:void(0)' data-file='".$file_name."' data-folder='other_upload' data-toggle='lightbox2' data-title='Attachments' data-footer='' class='other_upload-lightBox download_file'><img src=".url($other_upload)." class='img-fluid' style='width:50px;height:50px'></a>";	

			}
			else{
				$data['records'][$key]->other_upload="-";	

			}	

			$data['records'][$key]->profile_picture="<img class='img_enlarge' src='".url($profile_picture)."'style='width:50px;height:50px'>";	

			if($data['records'][$key]->status=='1')
			{
				$data['records'][$key]->status="<i class='fa fa-close change_status' style='font-size:20px;color:red;cursor:pointer' data-url='/admin/customer_change_status/' data-id='".base64_encode($data['records'][$key]->customer_id)."' name='status".$data['records'][$key]->customer_id."' data-status='status".$data['records'][$key]->customer_id."'></i>";

			}
			else{
				$data['records'][$key]->status="<i class='fa fa-check change_status' style='font-size:20px;color:green;cursor:pointer' aria-hidden='true' data-url='/admin/customer_change_status/' data-id='".base64_encode($data['records'][$key]->customer_id)."' name='status".$data['records'][$key]->customer_id."' data-status='status".$data['records'][$key]->customer_id."' value='Active'></i>";	
		
			}
			$data['records'][$key]->check_box="<input type='checkbox'  class='checkbox' onclick='multi_select()' value='".$data['records'][$key]->customer_id."' name='data' style='width:20px;height:20px'>";	
			
			$data['records'][$key]->action="<a href='/admin/edit_customer/".base64_encode($data['records'][$key]->customer_id)."'>
			<i class='fa fa-edit' style='font-size:18px;' data-toggle='tooltip' data-placement='top' title='Edit' id='".$data['records'][$key]->customer_id."'></i></a>&nbsp;

			<i class='fa fa-trash record_delete' style='font-size:20px;cursor:pointer' data-url='/admin/customer_delete/' data-toggle='tooltip' data-placement='top' title='Delete'  data-id='".base64_encode($data['records'][$key]->customer_id)."'></i>";
			$data['records'][$key]->check="<input type=checkbox class='btn' id='".$data['records'][$key]->customer_id."' value='' >";
		}
		$data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu']="product_list";
		
		echo $data['table_data'];
		exit();
	}

	//to create customer 
	public function create(Request $request)
	{
		$data['menu']="customer_list";
		return view('admin.customer.create',['menu'=>$data['menu']]);
	}

	 //to get data of particular id for update
	public function edit_customer(Request $request)
	{
		$data['customer']=CustomerDetails::where('customer_id',base64_decode($request->id))->first();	
		$data['menu']="customer_list";
		return ['customer'=>$data['customer'],'menu'=>$data['menu']];
	}

	//to change status of particular id
	public function status_change($id)
	{
		$customer_id = CustomerDetails::find($id);
		// dd($customer_id);
		if($customer_id->status=='1')
			$status='0';
		else
			$status='1';

		$row_data=CustomerDetails::find($id);
		$row_data->status=$status;
		$row_data->save();
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status'=>$row_data
		]);
	}

	//to delete data of particular id
	public function delete($id)
	{
		$row_data = CustomerDetails::where('customer_id',$id)->update(['status' => '2']);	
		// CustomerDetails::find($id)->delete();
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
			$row_data=CustomerDetails::find($data[$i]);
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
			$customer_id = CustomerDetails::find($data[$i]);
			if($customer_id->status=='1')
				$status='0';
			else
				$status='1';

			$row_data=CustomerDetails::find($data[$i]);
			$row_data->status=$status;
			$row_data->save();
		}
		return response()->json([
			'success' => 'status changed successfully!',
			'status'=>$row_data
		]);
	}

	public function gst_no_check(Request $request){
		$gst_no = $request->gst_no;
		$customer_id = $request->customer_id;
		$result=CustomerDetails::select('gst_no')->where('gst_no',$gst_no)
								->when($customer_id != "", function($result) use ($customer_id){
									return $result->where('customer_id','!=',$customer_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}	

	public function pan_no_check(Request $request){
		$pan_no = $request->pan_no;
		$customer_id = $request->customer_id;
		$result=CustomerDetails::select('pan_no')->where('pan_no',$pan_no)								
								->when($customer_id != "", function($result) use ($customer_id){
									return $result->where('customer_id','!=',$customer_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}

	//to store customer details 
	public function store_customer(Request $request)
	{
		$customer_id=$request['customer_id'];

		$image=$other_upl=null;

		// dd($request['profile_picture.name']);	

		if($request->file('profile_picture'))
		{
			$destinationPath = 'uploads/customer/profile_picture/'; // upload path
			$files = $request->file('profile_picture');
			$profile_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move($destinationPath, $profile_path);
			$image=$destinationPath.$profile_path;
		}

		if($request->file('other_upload'))
		{
			$destinationPath = 'uploads/customer/other_upload/'; // upload path
			$files = $request->file('other_upload');
			$other_upload_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move($destinationPath, $other_upload_path);
			$other_upl=$destinationPath.$other_upload_path;
		}

		if($customer_id!='')	
		{
			if(($request['temp_profile_picture']!='')&&($image==''))
			{	
				$image=$request['temp_profile_picture'];
			}
			if(($request['temp_other_upload']!='')&&($other_upl==''))
			{
				$other_upl=$request['temp_other_upload'];
			}
		}

		$customer_data = [
			'profile_picture'=>$image,
			'name'=>$request->input('name'),
			'address'=>$request->input('address'),
			'city'=>$request->input('city'),
			'state'=>$request->input('state'),
			'gst_no'=>$request->input('gst_no'),
			'pan_no'=>$request->input('pan_no'),
			'other_upload'=>$other_upl
		];

		$res = CustomerDetails::updateOrCreate(['customer_id'=>$customer_id],$customer_data); 
		// Session::flash('session_msg','Customer data updated successfully!');
		return $res;	
	
	}
}
