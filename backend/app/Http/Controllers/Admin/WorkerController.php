<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use App\WorkerDetails;
use Config;
use Session;


class WorkerController extends Controller
{

    /**
     * To fetch worker records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_worker_details(Request $request)
	{
		$worker = WorkerDetails::get();

		return ($worker);
	}

    /**
     * Show the form for creating a new worker.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function create(Request $request)
	{
		return view('admin.worker.create');
	}

    /**
     * To edit the worker.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_worker($id)
	{
		$data['worker'] = WorkerDetails::where('worker_id',$id)->first();	
		return ['worker' => $data['worker']];
		exit();
	}

    /**
     * To change status of worker
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function status_change($id)
	{
		$worker_details = WorkerDetails::find($id);
		$status = $worker_details->status == '1' ? '0' : '1';
		$row_data = WorkerDetails::where('worker_id',$id)->update(['status' => $status]);
	
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * Remove the specified worker from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function delete($id)
	{
		WorkerDetails::where('worker_id',$id)->update(['status' => '2']);	
		$row_data = WorkerDetails::find($id)->delete();
		return response()->json([
			'success' => 'Record has been deleted successfully!',
			'status' => $row_data
		]);
	}

	/**
     * Remove the multiple worker from storage.
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function multiple_delete($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len = count($data);
		for($i=0; $i<$data_len; $i++){
			$row_data=WorkerDetails::find($data[$i]);
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
			$worker_details=WorkerDetails::find($data[$i]);

			$status = $worker_details->status == '1' ? '0' : '1';
			$row_data=WorkerDetails::where('worker_id',$data[$i])->update(['status'=>$status]);
		}
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * To check worker duplicate name 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function worker_name_check(Request $request){
		$worker_name = $request->worker_name;
		$worker_id = $request->worker_id;
		$result=WorkerDetails::select('worker_name')
								->where('worker_name',$worker_name)										
								->when($worker_id != "", function($result) use ($worker_id){
									return $result->where('worker_id','!=',$worker_id);
								})
								->where('status','!=','2')
								->exists();
		echo $result;
	}

    /**
     * To store worker details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function store_worker(Request $request)
	{
		$worker_id =$request['id'];

		$worker_data = [
			'worker_name' => $request->input('worker_name')
		];

		$res = WorkerDetails::updateOrCreate(['worker_id' => $worker_id],$worker_data); 
		$res['status'] = $res['worker_id'] != '' ? 200 : '';
		$res['message'] = 'worker data updated successfully!';
		return $res;	
	}

	/**
     * To update pending metal weight 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function update_pending_metal(Request $request)
	{
		$worker_id = $request['id'];
		$metal_pending = $request['metal_pending'];
		$status = WorkerDetails::where('worker_id',$worker_id)->update(['metal_pending'=>$metal_pending]);

		return response()->json([
			'success' => 'Date Updated Successfully!',
			'status' => $status
		]);
	}
}