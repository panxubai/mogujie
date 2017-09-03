import "./../scss/main.scss";
import "./../scss/home.scss";
import Search from "./Search.js";
import MyFooter from "./MyFooter.js";
import Cart from "./Cart.js";
import Spxq from "./Spxq.js";
export default {
	loadHeader(){
		$("#header").load("viwes/home.html #searchHeader",function(){
			
			$("#search").on("tap",function(){
				$("#footer").css("display","none")
				Search.loadHeader();
				Search.loadContent();
			});
			$("#cart").on("tap",function(){	
				Cart.loadHeader();
				Cart.loadContent();
			});
		})
	},
	loadContent(){
		$("#content").load("viwes/home.html #homeContent",function(){			
			$.ajax({
				url:"http://mce.mogucdn.com/jsonp/multiget/3?pids=51822%2C51827%2C41119%2C51833%2C51836%2C4604&callback=?",
				type:"get",
				dataType:"jsonp",
				success:function(data){
					//首页轮播
				var obj = data.data;	
				var objImg=data.data[51822].list;
				//	console.log(obj);
					for(var i in objImg){
						//、console.log(i);
						$("#homeWrapper").append('<div class="swiper-slide" id="imgDiv">'+
						'<img src="'+objImg[i].image_800+'"/>'+
						'</div>')
						
					}
						var mySwiper = new Swiper("#homeBanner",{
							pagination:".swiper-pagination",
							autoplay:3000,
							loop:true,
							autoplayDisableOnInteraction:false
						});
					//轮播下面第一排
					var objNav = data.data[51827].list;
					for(var j in objNav){
						//console.log(i);
						$("#nav").append('<div id="navShop">'+
							'<span>'+objNav[j].title+'</span>'+
							'<i>'+objNav[j].description+'</i>'+
							'<img src="'+objNav[j].image+'"/>'+
						'</div>'+'<p></p>')
									
					};
					//倒计时
					var timeOut = data.data[41119].list;
					$("#timeOut").append('<p>'+timeOut[0].title+'.'+timeOut[0].viceTitle+'</p>'+
					'<div class="time">'+
						'<span class="timeHour">03</span>'+':'+'<span class="timeMinute">00</span>'+':'+
						'<span class="timeSecond">15</span>'+
					'</div>'
				);
				
			var dingshiqi = setInterval(function(){
					clearInterval(dingshiqi);
					var timeSecond = $(".timeSecond").html();
					var timeMinute = $(".timeMinute").html();
					var timeHour = $(".timeHour").html();
					
					if(timeSecond == '00'){
						
						timeSecond = 59;
						if(timeMinute == '00'){
								timeMinute = 59;
							timeHour--;
						}else{
								timeMinute--;
						};
						
							if(timeHour == '0' + '-1'){
								timeSecond ='00';
								timeMinute ='00';
								timeHour ='00';
								clearInterval(dingshiqi);
							}
						
					}else{
						if(timeSecond <= 1){
							timeSecond = '00';
						}else{
							timeSecond--;
						}
						
					};
					$(".timeSecond").html(timeSecond);
					$(".timeMinute").html(timeMinute);
					$(".timeHour").html(timeHour);
					
				},1000)
				
					//倒计时下面的商品
					
					var objList=data.data[51833].list;
					
					for(var n in objList){
					var str =  objList[n].viceTitle;
					var reg = /^\{/gi;
			        var reg2 = /\}$/gi;
			        str = str.replace(reg, '');
			        str = str.replace(reg2, '');
						$("#listBox").append('<li >'+
							'<strong>'+objList[n].title+'</strong>'+
							'<i>'+str+' </i>'+	
							'<img src="'+objList[n].image+'"/>'+
						'</li>')
						
					};
					
					var objUser=data.data[51836].list;
					for(var o in objUser){
						$("#listUser").append('<li>'+
							'<img src="'+objUser[o].image+'"/>'+
							'<p>'+objUser[o].title+'</p>'+
						'</li>')
					}
					
			
				}
			});
			
			$.ajax({
				type:"get",
				url:"https://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&_version=61&_=1501124581862&callback=?",
				dataType:"jsonp",
				success:function(data){
					var data = data.result.wall.docs
					//console.log(data);
					for(var t in data){
						var $li = $('<li class="listLi" iid= "'+data[t].iid+'"></li>')
						$("#bottomNav").append($li);
						$li.append('<img src="'+data[t].img+'"/>'+'<ol class="olNav"></ol>'+'<p class="pNav">'+
						'<a>'+'￥'+data[t].price+'</a>'+
						'<a>'+data[t].cfav+'</a>'+
						'</p>');
	
					}
					for(var p in data[t].props){
							$(".olNav").append('<span>'+data[t].props[p]+'</span>')
							//console.log(data[t].props[p])
							
					};
					//点击商品进入详情页
					var ni = $("#bottomNav li").on("tap",function(){
						//console.log(11111);
						$("#header").css("display","none");
						var iid = $(this).attr("iid");
						localStorage.setItem("iid",iid);
						Spxq.loadContent();
						Spxq.loadFooter();
	
					})
				}
				
			})
			
		//商品列表	
			
//http://m.mogujie.com/jsonp/detail.api/v1?iid=1k3yaqm&template=1-2-detail_normal-1.0.0&callback=httpCb150128736200598&_=1501287362005
//http://m.mogujie.com/jsonp/detail.api/v1?iid=1kest58&template=1-2-detail_normal-1.0.0&callback=httpCb150128799985234&_=1501287999852
//http://m.mogujie.com/jsonp/detail.api/v1?iid=1kcb2l2&template=1-2-detail_normal-1.0.0&callback=?&_=1501309346884			
			
			
			
		})
	}	
}