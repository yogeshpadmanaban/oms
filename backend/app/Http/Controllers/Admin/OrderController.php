<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use Config;
use Session;
use App\Cad;
use App\ProductDetails;
use App\CustomerDetails;
use App\OrderDetails;
use App\OrderImages;

class OrderController extends Controller
{
    /**
     * Display a listing of order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function listing(Request $request)
	{
		$data['menu']="order_list";
		return view('admin.order.list',['menu'=>$data['menu']]);
	}

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
		$data['menu']="view_orders";
		return view('admin.order.view_orders',['menu'=>$data['menu']]);
	}

    /**
     * Show the form for creating a new order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */ 
	public function create(Request $request)
	{
		$data['menu']="order_list";
		$data['products'] = ProductDetails::where('status','=','0')->get();
		$data['customers'] = CustomerDetails::where('status','=','0')->get();
		return ['products' => $data['products'] ,'customers' => $data['customers'],'order_img' => NULL,'menu'=>$data['menu']];
	}

    /**
     * To edit the order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function edit_order(Request $request)
	{
		$data['menu']="order_list";
		$data['orders']=OrderDetails::where('id',base64_decode($request->id))->first();

		$data['orders']['design_by'] = explode(',',$data['orders']['design_by']);
		$data['products'] = ProductDetails::where('status','=','0')->get();
		$data['customers'] = CustomerDetails::where('status','=','0')->get();
		// $data['cads'] = Cad::where('status','=','0')->get();
		$data['order_img'] = OrderImages::where('order_id','=',$data['orders']['order_id'])->get()->toArray();	
		// echo "<pre>";  print_r($data['orders']);exit();
		return ['orders'=>$data['orders'],'products' => $data['products'],'customers' => $data['customers'],'order_img' => $data['order_img'],'menu'=>$data['menu']];
	}

    /**
     * To change status of order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function status_change($id)
	{
		$order_status=OrderDetails::find($id);
		if($order_status->status=='1')
			$status='0';
		else
			$status='1';

		$row_data=OrderDetails::find($id);
		$row_data->status=$status;
		$row_data->save();
		
		return response()->json([
			'success' => 'status changed successfully!',
			'status'=>$row_data->status
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
			'status'=>$row_data
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
			$product_status=OrderDetails::find($data[$i]);
			if($product_status->status=='1')
				$status='0';
			else
				$status='1';

			$row_data=OrderDetails::find($data[$i]);
			$row_data->status=$status;
			$row_data->save();
		}
		return response()->json([
			'success' => 'status changed successfully!',
			'status'=>$status
		]);
	}

}
