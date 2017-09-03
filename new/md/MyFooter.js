import Home from "./Home.js";
import User from "./User.js";
import MyFooter from "./MyFooter.js";
import Cart from "./Cart.js";
import Myselef from "./Myselef.js";
export default {
	loadFooterStyle(index){
		$("#footer").find("li").eq(index).addClass("active").siblings().removeClass("active");
	},
	loadFooter(){
		
		
		$("#footer").load("viwes/myFooter.html",function(){
			console.log("ok");
			sessionStorage.setItem("index",0);
			$("#footer").find("li").on("tap",function(){
				$(this).addClass("active").siblings().removeClass("active");
				var index =$(this).index();
				if(index == "2"){
					
				}else{
					sessionStorage.setItem("index",index);
				}
				
				switch (index){
					case 0:
						Home.loadHeader();
						Home.loadContent();
					break;
					case 1:
						User.loadHeader();
						User.loadContent();
					break;
					case 2:
						Cart.loadHeader();
						Cart.loadContent();
					break;
					case 3:
						Myselef.loadHeader();
						Myselef.loadContent();
					break;	
					default:
						break;
				}	
			})
			
		})
	}
}
