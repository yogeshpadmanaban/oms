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
use App\CategoryDetails;
use App\OrderDetails;
use Config;

class AdminController extends Controller
{
    /**
     * Display a count.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function dashboard(Request $request)
	{
		$data['products'] = ProductDetails::limit('3')->get()->toArray(); 
		
		$data['category_count'] = CategoryDetails::where('status','0')->get()->count();
		$data['products_count'] = ProductDetails::where('status','0')->get()->count();
		$data['customers_count'] = CustomerDetails::where('status','0')->get()->count();
		$data['orders_count'] = OrderDetails::where('status','0')->get()->count();
		return ([
					'tot_category' => $data['category_count'],
					'tot_products' => $data['products_count'],
					'tot_customers' => $data['customers_count'],
					'tot_orders' => $data['orders_count'],
					'product_data' => $data['products'],
				]);
	}

}
