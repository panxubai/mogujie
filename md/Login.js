import "./../scss/loginOrRegister.scss";
import Register from "./Register.js";
import Myselef from "./Myselef.js";
export default{
	
	loadHeader(){
		$("#header").load("viwes/login.html #loginHeader",function(){
			$("#return").on("tap",function(){
				$("#footer").css("display","block")
				Myselef.loadHeader();
				Myselef.loadContent();
			});
		});
		
	},
	loadContent(){
		$("#content").load("viwes/login.html #loginContent",function(){
			$("#registerIng").on("tap",function(){
				$("#footer").css("display","none")
				Register.loadHeader();
				Register.loadContent();
				
			});
			
			$(".loginDl").on("tap",function(){
			var username = $("#loginContent .ipt1").val();
			var password = $("#loginContent .ipt2").val();
			if(username == "" || password ==""){
				alert("填写不完整")
			}else{
				
				var obj =	localStorage.getItem('array');
				var str1 = JSON.parse(obj); 
				var arrs = [];
				var arra = [];
				var b = 0;
				var c = 0;
				for(var n =0;n<str1.length;n++){		
					var ar = str1[n].username;
					arrs.push(ar);	
					console.log(arrs);
					for(var v =0;v<arrs.length;v++){		
						if(username == arrs[v]){
							b = 2;
							break;
						}else{
							b = 3;
						}
					
					};
				};	
				
				if(b == '2'){
					for(var i =0;i<str1.length;i++){
					var arr = str1[i].username+':'+str1[i].password;
					
					arra.push(arr);	
					
				};
				for(var j =0;j<arra.length;j++){
					console.log(arra[j]);
						if(username+':'+password == arra[j]){
							alert("登录成功");
							c = 0;
							break;
						}else{
							c=1;
						}
				};
				if(c == '1'){
					alert("密码错误")
					c = 0;
				}
				
			}else if(b == '3'){
				alert("用户名不存在");
				b = 0;
			}
				
			
				
			
				
					
			}
				
			})
			
		});
		
	},
	
	
}



