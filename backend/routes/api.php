<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route::group(['middleware' => 'CORS'], function ($router) {
    Route::post('/register', [UserController::class, 'register'])->name('register.user');
    Route::post('/login', 'App\Http\Controllers\UserController@login');
    Route::get('/view-profile', [UserController::class, 'viewProfile'])->name('profile.user');
    Route::get('/logout', [UserController::class, 'logout'])->name('logout.user');

    Route::get('/admin/customer_listing', 'App\Http\Controllers\Admin\CustomerController@listing');
    Route::get('/admin/add_customer', 'Admin\CustomerController@create');
    Route::post('/admin/store_customer', 'Admin\CustomerController@store')->name('store_customer');
    Route::get('/admin/customerReport', 'App\Http\Controllers\Admin\CustomerController@fetch_customer_details');
    Route::get('/admin/edit_customer/{id}', 'Admin\CustomerController@edit_customer');
    Route::post('/admin/customer_delete/{id}', 'Admin\CustomerController@delete');
    Route::post('/admin/customer_change_status/{id}', 'Admin\CustomerController@status_change');
    Route::post('/admin/customer_bulk_status_change/{data}', 'Admin\CustomerController@bulk_status_change');
    Route::post('/admin/customer_multi_delete/{data}', 'Admin\CustomerController@multiple_delete');
    Route::post('/admin/gst_no_check', 'Admin\CustomerController@gst_no_check');
    Route::post('/admin/pan_no_check', 'Admin\CustomerController@pan_no_check');

    Route::get('/admin/categoryReport', 'Admin\CategoryController@listing');
    Route::post('/admin/store_category', 'Admin\CategoryController@store')->name('store_category');
    Route::post('/admin/category_name_check', 'Admin\CategoryController@category_name_check');
    Route::get('/admin/category_details', 'Admin\CategoryController@fetch_category_details');
    Route::get('/admin/category_update/{id}', 'Admin\CategoryController@update');
    Route::post('/admin/category_delete/{id}', 'Admin\CategoryController@delete');
    Route::post('/admin/category_change_status/{id}', 'Admin\CategoryController@status_change');
    Route::post('/admin/category_bulk_status_change/{data}', 'Admin\CategoryController@bulk_status_change');
    Route::post('/admin/category_multi_delete/{id}', 'Admin\CategoryController@multiple_delete');
// });