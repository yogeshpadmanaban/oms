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
	//to view order listing
	public function listing(Request $request)
	{
		$data['menu']="order_list";
		return view('admin.order.list',['menu'=>$data['menu']]);
	}

	//to fetch order data
	public function fetch_order_details(Request $request)
	{
		$arr_data = [
						// 'user_id' => session()->get('sess_arr')['user_id'],
						// 'user_role' => session()->get('sess_arr')['user_role'],
						// 'sort' => $_REQUEST['order'],
						// 'search' => (isset($_REQUEST['search']))?$_REQUEST['search']:'',
						// 'limit' => (int)$_REQUEST['limit'],
						// 'offset' => (int)$_REQUEST['offset'],
						// 'from_date' => (isset($_REQUEST['from_date']))?$_REQUEST['from_date']:'',
						// 'to_date' => (isset($_REQUEST['to_date']))?$_REQUEST['to_date']:'',

						'user_id' => '',
						'user_role' => '',
						'sort' => 'desc',
						'search' => '',
						'limit' => '',
						'offset' => '',
						'from_date' => '',
						'to_date' => ''

					];
		$fetch_data = OrderDetails::fetchdata($arr_data);
	}

	//to view order 
	public function view_orders(Request $request)
	{
		$data['menu']="view_orders";
		return view('admin.order.view_orders',['menu'=>$data['menu']]);
	}

	//to create order 
	public function create(Request $request)
	{
		$data['menu']="order_list";
		$data['products'] = ProductDetails::where('status','=','0')->get();
		$data['customers'] = CustomerDetails::where('status','=','0')->get();
		// $data['cads'] = Cad::where('status','=','0')->get();
		// $data['order_img'] = DB::table('order_images')->select('*')->get()->toArray();
		return ['products' => $data['products'] ,'customers' => $data['customers'],'order_img' => NULL,'menu'=>$data['menu']];
	}

	//to get data of particular id for update
	public function edit_order(Request $request)
	{
		$data['menu']="order_list";
		$data['orders']=OrderDetails::where('id',base64_decode($request->id))->first();
		$data['products'] = ProductDetails::where('status','=','0')->get();
		$data['customers'] = CustomerDetails::where('status','=','0')->get();
		$data['cads'] = Cad::where('status','=','0')->get();
		$data['order_img'] = OrderImages::where('order_id','=',$data['orders']['order_id'])->get()->toArray();	
		// echo "<pre>";  print_r($data['orders']);exit();
		return ['orders'=>$data['orders'],'products' => $data['products'],'customers' => $data['customers'],'cads' => $data['cads'],'order_img' => $data['order_img'],'menu'=>$data['menu']];
	}

	//to change status of particular id
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

	//to delete data of particular id
	public function delete($id)
	{
		OrderDetails::where('id',$id)->update(['status' => '2']);	
		OrderDetails::find($id)->delete();
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

	public function bulk_status_change($data)
	{
		$data = json_decode(stripslashes($data));
		$data_len=count($data);
		for($i=0; $i<$data_len; $i++)
		{
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
