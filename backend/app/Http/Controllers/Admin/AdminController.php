<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Admin;
use App\ProductDetails;
use App\CustomerDetails;
use App\OrderDetails;

class AdminController extends Controller
{
	//to view dashboard
	public function dashboard(Request $request)
	{
		$data['menu']="dashboard";            
		$data['users'] =Admin::where('status','1')->get()->count();
		$data['products'] =ProductDetails::limit('3')->get()->toArray(); 

		// echo "<pre>";
		// print_r($data['products']);exit();

		$data['products_count'] =ProductDetails::where('status','0')->get()->count();
		$data['customers_count'] =CustomerDetails::where('status','0')->get()->count();
		$data['orders_count'] =OrderDetails::where('status','0')->get()->count();
		return view('admin.dashboard',['user_count'=>$data['users'],'tot_products'=>$data['products_count'],'tot_customers'=>$data['customers_count'],'tot_orders'=>$data['orders_count'],'product_data'=>$data['products']],['menu'=>$data['menu']]);
	}

}
