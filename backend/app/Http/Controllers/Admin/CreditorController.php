<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use App\Creditors;
use Config;

class CreditorController extends Controller
{

    /**
     * To fetch category records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_dealer_details(Request $request)
	{
		$creditors = Creditors::get();

		return ($creditors);
	}

    /**
     * To edit the category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_dealer($id)
	{
		$data['dealer'] =  Creditors::where('creditor_id',$id)->first();	
		return ['dealer' => $data['dealer']];
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
		$dealer_details =  Creditors::find($id);
		$status = $dealer_details->status == '1' ? '0' : '1';
		$row_data =  Creditors::where('creditor_id',$id)->update(['status' => $status]);
	
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
		Creditors::where('creditor_id',$id)->update(['status' => '2']);	
		$row_data = Creditors::find($id)->delete();
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
			$row_data= Creditors::find($data[$i]);
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
			$dealer_details= Creditors::find($data[$i]);

			$status = $dealer_details->status == '1' ? '0' : '1';
			$row_data= Creditors::where('creditor_id',$data[$i])->update(['status'=>$status]);
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
		$creditor_id =$request['id'];

		$dealer_data = [
			'dealer_name' => $request->input('dealer_name'),
			'due_days' => $request->input('due_days')
		];

		$res =  Creditors::updateOrCreate(['creditor_id' => $creditor_id],$dealer_data); 
		$res['message'] = 'Dealer data updated successfully!';
		return $res;	
	}
}