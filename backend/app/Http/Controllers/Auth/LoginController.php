<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */

     // protected $redirectTo = '/home';
   
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('guest')->except('logout');
        $this->role = last(request()->segments());
        
        $this->middleware('guest:admin', ['except' => ['logout']]);        
    }

    public function showLoginForm(Request $request)
    {
        // Get URLs
        $urlPrevious = url()->previous();
        $urlBase = url()->to('/');

        // Set the previous url that we came from to redirect to after successful login but only if is internal
        if(($urlPrevious != $urlBase . '/login') && (substr($urlPrevious, 0, strlen($urlBase)) === $urlBase)) 
        {
           // session()->put('url.intended', $urlPrevious);
        }

        $full = explode("?", $request->fullurl());
        $para = "";
        if(count($full) > 1)
        {
           $para = '?'.$full[1];
           #dd(decode_url($full[1]));
        }

        $action = ['action'=>route('login_'.$this->role), 'role'=>$this->role, 'refer'=>$para];
        
        return view('auth.login')->with($action);
    }
   
    public function login(Request $request)
    {   
        $input = $request->all();

        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required',
        ]); 

        $credentials = ['email' => $request->email, 'password' => $request->password, 'status'=>'0'];

        // dd($credentials);
      
        Auth::shouldUse($this->role);
        if (Auth::guard($this->role)->attempt($credentials)) {

            $accessToken = auth()->user()->createToken('authToken')->accessToken;
            $res = ['user_id'=>auth()->user()->id,'user_role'=>$this->role,'email'=>$request->email,'token'=>$accessToken];
            // $request->session()->put('sess_arr', $sess_arr);

            // return redirect()->to('/'.$this->role.'/dashboard');
            return $res;
        }
        else{
            return ([
            'message' => 'The email or password is incorrect, please try again'
            ]);
        }
    
    }

    public function logout()
    { 
        $user = Auth::guard("api")->user()->token();
        $user->revoke();
        $responseMessage = "successfully logged out";
        return response()->json([
            'success' => true,
            'message' => $responseMessage
        ], 200);
        // $user_role =  request()->session()->get('sess_arr')['user_role'];
        // Session::flush();
        // $user_role = ($user_role!='')?$user_role:'admin';
        // // echo $user_role;exit;
        // Auth::guard($user_role)->logout();
        // return redirect('/login/'.$user_role);
    }
}
