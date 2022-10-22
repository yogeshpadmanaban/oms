<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use Config;
use App\Cad;
use App\ProductDetails;
use App\CustomerDetails;
use App\WorkerDetails;
use App\OrderDetails;
use App\OrderImages;

class OrderController extends Controller
{

    /**
     * To fetch order records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function fetch_order_details(Request $request)
	{
		$arr_data = [
						'from_date' => $request->query('from_date'),
						'to_date' => $request->query('to_date'),
						'user_id' => $request->query('user_id'),
						'user_role' => $request->query('user_role'),
						'sort' => 'desc',
						'search' => '',
						'limit' => '',
						'offset' => '',
					];

		$fetch_data = OrderDetails::fetchdata($arr_data);
		return $fetch_data;
	}

    /**
     * To view orders
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function view_orders(Request $request)
	{
		return view('admin.order.view_orders');
	}

    /**
     * Show the form for creating a new order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */ 
	public function create(Request $request)
	{

		$data['products'] = DB::table('product_details',  'pd')
								->select('pd.*')
								->leftJoin('category_details AS cd', 'cd.category_id', '=', 'pd.category')
								->leftJoin('creditors AS cdt', 'cdt.creditor_id', '=', 'pd.creditors')
								->where('pd.status','!=','2')
								->where('cd.status','0')
								->where('cdt.status','0')
								->get();

		$data['customers'] = CustomerDetails::where('status','=','0')->get();
		$data['workers'] = WorkerDetails::where('status','=','0')->get();
		return ['products' => $data['products'] ,'customers' => $data['customers'],'workers' => $data['workers'],'order_img' => NULL];
	}

    /**
     * To edit the order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_order(Request $request)
	{
		$data['orders']=OrderDetails::where('id',base64_decode($request->id))->first();

		$data['orders']['design_by'] = explode(',',$data['orders']['design_by']);
		$data['products'] = ProductDetails::where('status','=','0')->get();
		$data['customers'] = CustomerDetails::where('status','=','0')->get();
		$data['order_img'] = OrderImages::where('order_id','=',$data['orders']['order_id'])->get()->toArray();	
		return ['orders'=>$data['orders'],'products' => $data['products'],'customers' => $data['customers'],'order_img' => $data['order_img']];
	}

	/**
     * To change status of metal.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function metal_status_change($id)
	{
		$order_status = OrderDetails::find($id);
		$worker_id = $order_status->worker_id;

		$status = $order_status->metal_provided == '1' ? '0' : '1';
		$row_data = OrderDetails::where('id',$id)->update(['metal_provided' => $status]);

		// To update worker pending metal
		$pending_weight = OrderDetails::update_weight($worker_id );	

		return response()->json([
			'success' => 'metal status changed successfully!',
			'status' => $status
		]);
	}

	/**
     * To change multiple metal status 
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function bulk_metal_status_change($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len = count($data);

		for($i=0; $i<$data_len; $i++){
			$order_status = OrderDetails::find($data[$i]);
			$worker_id = $order_status->worker_id;

			$status = $order_status->metal_provided == '1' ? '0' : '1';
			$row_data = OrderDetails::where('id',$data[$i])->update(['metal_provided' => $status]);

			// To update worker pending metal
			$pending_weight = OrderDetails::update_weight($worker_id );	
		}

		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

	/**
     * To change status of metal.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	// public function order_received_status($id)
	// {
	// 	$order_status = OrderDetails::find($id);
	// 	$status = $order_status->order_received == '1' ? '0' : '1';
	// 	$row_data = OrderDetails::where('id',$id)->update(['order_received' => $status]);
		
	// 	return response()->json([
	// 		'success' => 'order received status changed successfully!',
	// 		'status' => $status
	// 	]);
	// }

	/**
     * To change multiple metal status 
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	// public function order_bulk_received_change($data)
	// {
	// 	$data = json_decode(stripslashes($data));
	// 	$data_len = count($data);

	// 	for($i=0; $i<$data_len; $i++){
	// 		$order_status = OrderDetails::find($data[$i]);

	// 		$status = $order_status->order_received == '1' ? '0' : '1';
	// 		$row_data = OrderDetails::where('id',$data[$i])->update(['order_received' => $status]);
	// 	}

	// 	return response()->json([
	// 		'success' => 'status changed successfully!',
	// 		'status' => $status
	// 	]);
	// }

    /**
     * To change status of order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function status_change($id)
	{
		$order_details=OrderDetails::find($id);
		$status = $order_details->status == '1' ? '0' : '1';
		$row_data = OrderDetails::where('id',$id)->update(['status' => $status]);
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}

    /**
     * Remove the specified order from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function delete($id)
	{
		$row_data = OrderDetails::where('id',$id)->update(['status' => '2']);	
		OrderDetails::find($id)->delete();
		return response()->json([
			'success' => 'Record has been deleted successfully!',
			'status' => $row_data
		]);
	}

	/**
     * Remove the multiple order from storage.
     *
     * @param  int  $data
     * @return \Illuminate\Http\Response
     */
	public function multiple_delete($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len=count($data);

		for($i=0; $i<$data_len; $i++){
			$row_data=OrderDetails::find($data[$i]);
			$row_data->status='2';
			$row_data->save();

			$row_data->delete();
		}

		return response()->json([
			'success' => 'Records has been deleted successfully!',
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
			$order_details=OrderDetails::find($data[$i]);

			$status = $order_details->status == '1' ? '0' : '1';
			$row_data = OrderDetails::where('id',$data[$i])->update(['status'=>$status]);
		}

		return response()->json([
			'success' => 'status changed successfully!',
			'status' => $status
		]);
	}


	/**
     * To update metal provided date 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function update_metal_date(Request $request)
	{
		$order_id = $request['id'];
		$date = $request['date'];
		$status = OrderDetails::where('id',$order_id)->update(['metal_provided_date'=>$date]);

		return response()->json([
			'success' => 'Date Updated Successfully!',
			'status' => $status
		]);
	}
}
