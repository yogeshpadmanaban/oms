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
    /**
     * Display a listing of customer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function listing(Request $request)
	{
		$data['menu'] = "customer_list";
		return $data['menu'];
	}

    /**
     * To fetch customer records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_customer_details(Request $request)
	{
		$result =CustomerDetails::where('status','!=','2')->get(); // to get except soft-deleted data
		$data['totalRecords'] = $result->count();
		$result_two=CustomerDetails::where('status','!=','2')->get();

		$data['records'] = $result_two;
		$data['num_rows'] = $result_two->count();

		$data['table_data']='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';
        $data['menu'] = "product_list";

		return ($data['table_data']);
	}

    /**
     * Show the form for creating a new customer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function create(Request $request)
	{
		$data['menu'] = "customer_list";
		return view('admin.customer.create',['menu' => $data['menu']]);
	}

    /**
     * To edit the customer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_customer(Request $request)
	{
		$data['customer'] = CustomerDetails::where('customer_id',base64_decode($request->id))->first();	
		$data['menu'] = "customer_list";
		return ['customer' => $data['customer'],'menu' => $data['menu']];
	}

    /**
     * To change status of category.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function status_change($id)
	{
		$customer_details = CustomerDetails::find($id);
		$status = $customer_details->status == '1' ? '0' : '1';
		$row_data = CustomerDetails::where('customer_id',$id)->update(['status' => $status]);
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * Remove the specified customer from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function delete($id)
	{
		$row_data = CustomerDetails::where('customer_id',$id)->update(['status' => '2']);	
		CustomerDetails::find($id)->delete();
		return response()->json([
			'success' => 'Record has been deleted successfully!',
			'status' => $row_data
		]);
	}

	/**
     * Remove the multiple customer from storage.
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function multiple_delete($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len = count($data);
		for($i=0; $i<$data_len; $i++){
			$row_data = CustomerDetails::find($data[$i]);
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
		$data_len = count($data);

		for($i=0; $i<$data_len; $i++){
			$customer_details = CustomerDetails::find($data[$i]);
			$status = $customer_details->status == '1' ? '0' : '1';
			$row_data = CustomerDetails::where('customer_id',$data[$i])->update(['status' => $status]);
		}
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

	/**
     * To check GST number 
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function gst_no_check(Request $request){
		$gst_no = $request->gst_no;
		$customer_id = $request->customer_id;
		$result = CustomerDetails::select('gst_no')->where('gst_no',$gst_no)
								->when($customer_id != "", function($result) use ($customer_id){
									return $result->where('customer_id','!=',$customer_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}	

	/**
     * To check PAN number 
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function pan_no_check(Request $request){
		$pan_no = $request->pan_no;
		$customer_id = $request->customer_id;
		$result = CustomerDetails::select('pan_no')->where('pan_no',$pan_no)								
								->when($customer_id != "", function($result) use ($customer_id){
									return $result->where('customer_id','!=',$customer_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}

    /**
     * To store customer details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function store_customer(Request $request)
	{
		$customer_id = $request['customer_id'];

		$image=$other_upl = null;

		if($request->file('profile_picture')){
			$destinationPath = 'uploads/customer/profile_picture/'; // upload path
			$files = $request->file('profile_picture');
			$profile_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move(public_path($destinationPath),$profile_path);
			$image = $destinationPath.$profile_path;
		}
	
		if($request->file('other_upload')){
			$destinationPath = 'uploads/customer/other_upload/'; // upload path
			$files = $request->file('other_upload');
			$other_upload_path = date('YmdHis') . "." . $files->getClientOriginalExtension();
			$files->move($destinationPath, $other_upload_path);
			$other_upl = $destinationPath.$other_upload_path;
		}

		if($customer_id!=''){
			if(($request['temp_profile_picture']!='')&&($image=='')){	
				$image=$request['temp_profile_picture'];
			}
			if(($request['temp_other_upload']!='')&&($other_upl=='')){
				$other_upl=$request['temp_other_upload'];
			}
		}

		$customer_data = [
			'profile_picture' => $image,
			'name' => $request->input('name'),
			'address' => $request->input('address'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'gst_no' => $request->input('gst_no'),
			'pan_no' => $request->input('pan_no'),
			'other_upload' => $other_upl
		];

		$res = CustomerDetails::updateOrCreate(['customer_id'=>$customer_id],$customer_data); 
		$res['message'] = 'Customer data updated successfully!';
		return $res;	
	}
}
