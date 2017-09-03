import "./../scss/myselef.scss";
import Login from "./Login.js";
import Register from "./Register.js";

export default {
	loadHeader(){
		$("#header").load("viwes/myselef.html #myselefHeader",function(){
			console.log("ok")
		
			
		})
	},
	loadContent(){
		$("#content").load("viwes/myselef.html #myselefContent",function(){
			console.log("ok");
				$(".btn1").on("tap",function(){
					console.log(1111111);
					$("#footer").css("display","none")
					Login.loadHeader();
					Login.loadContent();
					
				});
				$(".btn2").on("tap",function(){
					$("#footer").css("display","none")
					console.log(1111111)
					Register.loadHeader();
					Register.loadContent();
					
				})
	
		})
	}
	
}