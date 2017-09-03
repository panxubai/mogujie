import "./../scss/loginOrRegister.scss";
import Myselef from "./Myselef.js";
import Login from "./Login.js";
export default{
	
	loadHeader(){
		$("#header").load("viwes/register.html #registerHeader",function(){
			$("#return").on("tap",function(){
				$("#footer").css("display","block")
				Myselef.loadHeader();
				Myselef.loadContent();
			});
			$("#cartNews").on("tap",function(){
		
				Login.loadHeader();
				Login.loadContent();
			});
		});
		
	},
	loadContent(){
		$("#content").load("viwes/register.html #registerContent",function(){

			
			$(".registerZc").on("tap",function(){
			var username = $("#registerContent .ipt1").val();
			var password = $("#registerContent .ipt2").val();
			var password1 = $("#registerContent .ipt3").val();
			
			if(username == "" || password == "" || password1 == ""){
				alert("请填写完整")
			}else if(password != password1){
				alert("两次输入密码不一致")
			}else{
				
				var obj =	localStorage.getItem('array');
				var str1 = JSON.parse(obj); 
				var a = 3;
				console.log(str1)
				var arra = [];
				if(str1 == null){
						str1.push({'username':username,'password':password})
						var str = JSON.stringify(str1);  
						localStorage.setItem('array',str);
						console.log(str);
						a =3;
						alert("注册成功")
					
				}else{
					for(var i =0;i<str1.length;i++){
					var arr = str1[i].username;
					arra.push(arr);					
				};
				for(var i =0;i<arra.length;i++){
					console.log(arra)
					if(username == arra[i]){
						//alert("5")
						a = 0;
						break;
						console.log(arr,username)
					}else{
						a = 1;						
					}				
				};	
					
					if(a == '0'){
						a = 3;
						alert("用户名重复")
						
					}else if(a == '1'){		
						str1.push({'username':username,'password':password})
						var str = JSON.stringify(str1);  
						localStorage.setItem('array',str);
						console.log(str);
						a =3;
						alert("注册成功")
						
					}
					
				}			
			}
		});	
			
		});
		
	},
	
	
}
//var i =	localStorage.getItem('array',str);
//			var str1 = JSON.parse(i); 
//				console.log(str1)
