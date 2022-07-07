<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Auth\LoginController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::any('/login', function () {
//     return redirect('login/admin');
// });

// $login_url = array('login_admin'=>'/login/admin');

// foreach ($login_url as $key => $value) {
// 	Route::get($value, [LoginController::class,'showLoginForm'])->name($key);
// 	Route::post($value, [LoginController::class,'login'])->name('login.submit');
// }

Route::get('/login/admin', [LoginController::class,'showLoginForm'])->name('login_admin');
Route::post('/login/admin', [LoginController::class,'login'])->name('login.submit');

// Route::group(['middleware' => ['auth:admin']], function() {
    Route::group(['middleware' => 'CORS'], function () {

        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);

        Route::get('/admin/add_customer',  [CustomerController::class, 'create']);
        Route::post('/admin/store_customer', [CustomerController::class, 'store_customer'])->name('store_customer');
        Route::get('/admin/customer_details', [CustomerController::class, 'fetch_customer_details']);
        Route::get('/admin/edit_customer/{id}', [CustomerController::class, 'edit_customer']);
        Route::post('/admin/customer_delete/{id}', [CustomerController::class, 'delete']);
        Route::post('/admin/customer_change_status/{id}', [CustomerController::class, 'status_change']);
        Route::post('/admin/customer_bulk_status_change/{data}', [CustomerController::class, 'bulk_status_change']);
        Route::post('/admin/customer_multi_delete/{data}', [CustomerController::class, 'multiple_delete']);
        Route::post('/admin/gst_no_check', [CustomerController::class, 'gst_no_check']);
        Route::post('/admin/pan_no_check', [CustomerController::class, 'pan_no_check']);

        Route::post('/admin/store_category', [CategoryController::class, 'store_category'])->name('store_category');
        Route::post('/admin/category_name_check', [CategoryController::class, 'category_name_check']);
        Route::get('/admin/category_details', [CategoryController::class, 'fetch_category_details']);
        Route::get('/admin/edit_category/{id}', [CategoryController::class, 'edit_category']);
        Route::post('/admin/category_delete/{id}', [CategoryController::class, 'delete']);
        Route::post('/admin/category_change_status/{id}', [CategoryController::class, 'status_change']);
        Route::post('/admin/category_bulk_status_change/{data}', [CategoryController::class, 'bulk_status_change']);
        Route::post('/admin/category_multi_delete/{id}', [CategoryController::class, 'multiple_delete']);

        Route::post('/admin/add_product', [ProductController::class,'create']);
        Route::post('/admin/store_product', [ProductController::class,'store']);
        Route::get('/admin/product_details', [ProductController::class,'fetch_product_details']);
        Route::get('/admin/edit_product/{id}', [ProductController::class,'edit_product']);
        Route::post('/admin/product_delete/{id}', [ProductController::class,'delete']);
        Route::post('/admin/product_change_status/{id}', [ProductController::class,'status_change']);
        Route::post('/admin/product_bulk_status_change/{data}', [ProductController::class,'bulk_status_change']);
        Route::post('/admin/product_multi_delete/{id}', [ProductController::class,'multiple_delete']);
        Route::post('/admin/product_name_check', [ProductController::class,'product_name_check']);

        Route::post('/admin/add_order', [OrderController::class,'create']);
        Route::get('/admin/order_listing', [OrderController::class,'listing']);
        Route::get('/admin/view_orders', [OrderController::class,'view_orders']);	
        Route::get('/admin/add_order', [OrderController::class,'create']);
        Route::get('/admin/edit_order/{id}', [OrderController::class,'edit_order']);
        Route::get('/admin/order_details', [OrderController::class,'fetch_order_details']);
        Route::post('/admin/order_change_status/{id}', [OrderController::class,'status_change']);
        Route::post('/admin/order_delete/{id}', [OrderController::class,'delete']);
        Route::post('/admin/order_bulk_status_change/{data}', [OrderController::class,'bulk_status_change']);
        Route::post('/admin/order_multi_delete/{data}', [OrderController::class,'multiple_delete']);

        Route::post('/admin/store_order', [PublicController::class,'store'])->name('store_order');

   
    });
// });

Route::post('/admin/logout/', [LoginController::class,'logout']);