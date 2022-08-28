<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use App\DealerDetails;
use Config;

class DealerController extends Controller
{
    /**
     * Display a listing of category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function listing(Request $request)
	{
		$data['menu'] = "dealer_list";
		return view('admin.category.list',['menu' => $data['menu']]);
	}

    /**
     * To fetch category records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_dealer_details(Request $request)
	{
		$result = DealerDetails::where('deleted_at',NULL)->get(); // to get except soft-deleted data
		$data['totalRecords'] = $result->count();

		$result_two= DealerDetails::where('deleted_at',NULL)->get();
		$data['records'] = $result_two;
		$data['num_rows'] = $result_two->count();

		$data['table_data'] ='{"total":'.intval( $data['totalRecords'] ).',"recordsFiltered":'.intval( $data['num_rows'] ).',"rows":'.json_encode($data['records']).'}';

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
		$data['menu'] = "dealer_list";
		return view('admin.category.create',['menu' => $data['menu']]);
	}

    /**
     * To edit the category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_dealer($id)
	{
		$data['dealer'] =  DealerDetails::where('dealer_id',$id)->first();	
		$data['menu'] = "dealer_list";
		return ['dealer' => $data['dealer'],'menu'=>$data['menu']];
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
		$dealer_details =  DealerDetails::find($id);
		$status = $dealer_details->status == '1' ? '0' : '1';
		$row_data =  DealerDetails::where('dealer_id',$id)->update(['status' => $status]);
	
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
		 DealerDetails::where('dealer_id',$id)->update(['status' => '2']);	
		 DealerDetails::find($id)->delete();
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
			$row_data= DealerDetails::find($data[$i]);
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
			$dealer_details= DealerDetails::find($data[$i]);

			$status = $dealer_details->status == '1' ? '0' : '1';
			$row_data= DealerDetails::where('dealer_id',$data[$i])->update(['status'=>$status]);
		}
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * To store category details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function store_dealer(Request $request)
	{
		$dealer_id =$request['id'];

		$dealer_data = [
			'dealer_name' => $request->input('dealer_name')
		];

		$res =  DealerDetails::updateOrCreate(['dealer_id' => $dealer_id],$dealer_data); 
		$res['message'] = 'Dealer data updated successfully!';
		return $res;	
	}
}