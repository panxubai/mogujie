import "./../scss/cart.scss";
import Home from "./Home.js";
import MyFooter from "./MyFooter.js";
import User from "./User.js";
import Myselef from "./Myselef.js";
export default {
	loadHeader(){
		$("#header").load("viwes/cart.html #cartHeader",function(){
			console.log("ok");
				$("#return").on("tap",function(){
				var index = sessionStorage.getItem("index");
				console.log(index)
				if(index == '0'){
					Home.loadHeader();
					Home.loadContent();
					MyFooter.loadFooterStyle(0);
				}else if(index == '1'){
					User.loadHeader();
					User.loadContent();
					MyFooter.loadFooterStyle(1);
				}else{
					Myselef.loadHeader();
					Myselef.loadContent();
					MyFooter.loadFooterStyle(3);
				}
				
			});
			
		})
	},
	loadContent(){
		$("#content").load("viwes/cart.html #cartContent",function(){
			console.log("ok");
			var obj =	localStorage.getItem('data');
			var str = JSON.parse(obj); 
			console.log(str);
			
			for(var i = 0 ;i<str.length;i++){
				$("#cartMain").append('<li>'+
			'<img src="'+str[i].src+'"/>'+
			'<p>'+str[i].title+'</p>'+
			'<ol>'+'<span>颜色：'+str[i].yanse+'</span>'+'<span>尺码：'+str[i].chima+'</span>'+'<span>数量：'+str[i].num+'</span>'+'</ol>'+
			'<h1>￥'+str[i].money+'</h1>'+
			'<button class="remove">删除</button>'+
		'</li>')
				
			};
			var sum = 0;
			for(var j = 0 ;j<str.length;j++){
				var moneySum= str[j].money;
				sum += Number(moneySum);
				console.log(sum);
				$("#sumMoney").html("")
				$("#sumMoney").html('总价:￥'+sum)
			}
			$(".remove").on("tap",function(){	
				var inx = $(this).parent().index();
				console.log(inx);
				
				console.log(str[inx].money);
				var sum1 = sum - Number(str[inx].money);
				console.log(sum1)
				$("#sumMoney").html("")
				$("#sumMoney").html('总价:￥'+sum1)
				str.splice(inx,1);
				console.log(str);
				var str1 = JSON.stringify(str);  
				console.log(str1);
				localStorage.setItem('data',str1);
				$("#cartMain li").eq(inx).remove();				
				
				
				
			});
		
			
				
			
			
		})
	}
	
}
