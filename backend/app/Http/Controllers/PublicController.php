<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;
use Config;
use Session;
use Response;
use App\Admin;  
use App\Cad;
use App\ProductDetails;
use App\CustomerDetails;
use App\OrderDetails;
use App\OrderImages;
use Symfony\Component\Finder\SplFileInfo;


class PublicController extends Controller
{
    /**
     * To download file.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
	public function ajax_file_download($folder ='', $id = '')
    {
        $file = public_path('uploads/customer/'.$folder.'/'.$id);

        $info = pathinfo($file);
        $info['extension'] = strtolower($info['extension']);

        if($info['extension'] == 'pdf'){
            $name = $folder.'.pdf';
            header("Content-type: application/pdf"); 
            header("Content-Length: " . filesize($file)); 
            // Send the file to the browser. 
            readfile($file); 
        }
        else if($info['extension'] == 'docx'){
            $name = $folder.'.docx';
        }

        $headers = array('Content-Type: application/octet-stream');

        return response()->download($file, $name, $headers);    
    }

    /**
     * To download order PDF.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function execPDF($order_id){
        
        $url = url('/')."/generatePDF/".$order_id;

        exec('/usr/bin/wkhtmltopdf -O landscape --page-width 260mm --page-height 210mm '.$url.' '.public_path('uploads/order/').$order_id.'.pdf', $output, $retval);

        $file = public_path('uploads/order/').$order_id.'.pdf';

        $headers = array(
            'Content-Type: application/pdf',
        );

        return Response::download($file, 'order.pdf', $headers);
    }

    /**
     * To generate PDF.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePDF($order_id='')
    {   
        $data = DB::table('order_details','od')
                            ->select('od.order_id','od.customer_id','od.jc_number','od.weight','od.quantity','od.design_by','od.order_details','od.delivery_date','pd.product_type','pd.name as product_name','cd.name',
                                    DB::raw(
                                        "(
                                        SELECT GROUP_CONCAT(DISTINCT                               order_images.order_image) FROM `order_images` AS `order_images` where `order_images`.order_id = od.order_id
                                        ) as order_image"
                                    )
                                )
                            ->leftJoin('order_images as oi', 'oi.order_id', '=', 'od.order_id')
                            ->leftJoin('customer_details as cd', 'od.customer_id', '=', 'cd.customer_id')
                            ->leftJoin('product_details as pd', 'pd.product_id', '=', 'od.product_id')
                            ->where('od.id',base64_decode($order_id))
                            ->where('od.deleted_at',NULL)
                            ->get()
                            ->first();

        return view('admin/order/orderPDF')->with(['data' => $data]);
    }

    /**
     * To check user password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function check_user_password(Request $request){
        $password= $request->input('password');
        $user_id= $request->input('user_id');
        $user_id=base64_decode($user_id);

        $result = Admin::where('id',$user_id)
                        ->where('status','!=','2')
                        ->first();  

        if($result){
            $validCredentials = Hash::check($password, $result->getAuthPassword());
            echo $validCredentials; 
        }
    }

    /**
     * To update user password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */ 
    public function update_user_password(Request $request){
        $confirm_pwd= $request->input('confirm_pwd');
        $password = Hash::make($confirm_pwd);
        $user_id= $request->input('change_pwd_usr_id');
        $user_id=base64_decode($user_id);

        $update_password = Admin::where('id', $user_id)
                                    ->where('status','!=','2')
                                    ->update(['password'=>$password]);
        $success= $update_password;
        return json_encode($success);
    }

    /**
     * To store order details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */ 
    public function store(Request $request)
    {
        $id = $request->input('id');    
        $user_id = '';
        $user_role = '';
        $user_status = '';
        $pdt_id = $request->input('product_id');
        $user_status = '0';

        $image='';

        if($request->input('hdn_rdm_order_id')!=''){
            $rdm_order_id=$request->input('hdn_rdm_order_id');
        }
        else{
            $rdm_order_id=self::randomPassword();
        }

        if($request->file('order_image')!=''){
            $destinationPath = 'uploads/order/'; // upload path
            $files = $request->file('order_image');
            $profile_path = uniqid() . '_' . trim($files->getClientOriginalName());
            $files->move($destinationPath, $profile_path);
            $image=$destinationPath.$profile_path; 
        }

        if($id!='') {   
            if($request['temp_order_img']!=''){   
                $image=$request['temp_order_img'];
            }
        }

        $product_type = ProductDetails::select('product_type')->where('product_id','=',$pdt_id)->first();

        $order_data = [
            'order_id' => $rdm_order_id,
            'product_type' => $product_type['product_type'],
            'product_id' => $request->input('product_id'),
            'customer_id' => $request->input('customer_id'),
            'worker_id' => $request->input('worker_id'),
            // 'mould_id' => $request->input('mould_name'),
            'purity' => $request->input('purity') == 'null' ? NULL : $request->input('purity'),
            'jc_number' => $request->input('jc_number') == 'null' ? NULL : $request->input('jc_number'),
            'quantity' => $request->input('quantity') == 'null' ? NULL : $request->input('quantity'),
            // 'cad_id' => $request->input('cad_id'),
            'weight' => $request->input('weight') == 'null' ? NULL : $request->input('weight'),
            'design_by' => $request->input('design_by'),
            'delivery_date' => $request->input('delivery_date') == 'null' ? NULL : $request->input('delivery_date'),
            'metal_provided' => $request->input('metal_provided') == 'null' ? NULL : $request->input('metal_provided'),
            'metal_provided_date' => $request->input('metal_provided_date') == 'null' ? NULL : $request->input('metal_provided_date'),
            'order_due_date' => $request->input('order_due_date') == 'null' ? NULL : $request->input('order_due_date'),
            'order_image' => $image,
            'order_details' => $request->input('order_details'),
            'user_status' => $user_status,
            // 'order_creator_role' => $user_role,
            // 'order_creator_id'=> $user_id, 
        ];

        if(!empty($image)){
            OrderImages::where('order_creator_id', $user_id)->where('order_id',  $order_data['order_id'])->delete();
            OrderImages::insert(['order_id'=>$order_data['order_id'],'order_image'=>$image]);
        }

        $res = OrderDetails::updateOrCreate(['id'=>$id],$order_data); 
		$res['message'] = 'Order data updated successfully!';

        return $res;   
    }

    public function randomPassword() {

        $number = 00000;
        $number++;
        $last_id = '';
        if (OrderDetails::exists()){
            $last_id = OrderDetails::orderBy('id', 'desc')
                                    ->withTrashed()
                                    ->first()
                                    ->id;
        }                        
        if ($last_id==''){
            $order_id = 1;
        }
        else{
            $order_id = $last_id + 1;
        }

        $order_id = str_pad($order_id, 5, "0", STR_PAD_LEFT);

        
        /*$alphabet = "1234567890";
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 5; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }*/
        return $order_id; //turn the array into a string
    }
}
