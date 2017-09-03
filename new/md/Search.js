import "./../scss/search.scss";
import Home from "./Home.js";
import User from "./User.js";
import MyFooter from "./MyFooter.js";

export default{
	loadHeader(){
		$("#header").load("viwes/search.html #searchHeader-page",function(){
			var $idx =$("#footer").find("li").attr("class");
			console.log($idx);
			$(".return").on("tap",function(){
				if($idx == ""){
					$("#footer").css("display","block")
				User.loadHeader();
				User.loadContent();
				}else{
					$("#footer").css("display","block")
				MyFooter.loadFooterStyle(0);
				Home.loadHeader();
				Home.loadContent();
				}			
			})		
		})
	},
	loadContent(){
		$("#content").load("viwes/search.html #searchContent",function(){
			
		})
	}
}
