import "./../scss/spxq.scss";
import Home from "./Home.js";
import User from "./User.js";
import MyFooter from "./MyFooter.js";
export default {
	loadContent(){
		$("#content").load("viwes/spxq.html #spxqContent",function(){
			console.log("ok");	
			
			var id =	localStorage.getItem('iid');
				$.ajax({				
				url:"http://m.mogujie.com/jsonp/detail.api/v1?iid="+id+"&template=1-2-detail_normal-1.0.0&callback=?&_=1501287362005",
				type:"get",
				dataType:"jsonp",
				success:function(data){
				var data = data.data;
				//console.log(data);				
				//轮播图
				for(var i in data.topImages){
					$("#spxqWrapper").append('<div class="swiper-slide" id="imgDiv">'+
						'<img src="'+data.topImages[i]+'"/>'+
						'</div>')
				}
					var mySwiper = new Swiper("#spxqBanner",{
							pagination:".swiper-pagination",						
						});
				//标题
					$("#spxqTittle").append('<p>'+data.itemInfo.title+'</p>');	
					$("#spxqTittle").append('<span>￥'+data.itemInfo.highNowPrice+'<i>￥'+data.itemInfo.highPrice+'</i></span>');
					$("#spxqTittle").append('<b>'+data.itemServices.columns[1].desc+'</b>');
					$("#spxqTittle").append('<ol class="spxqol"></ol>');
					var services = data.itemServices.services;
					
					for(var j in services){
						//console.log(services[j].name)
						$(".spxqol").append('<strong>'+services[j].name+'</strong>');	
					};
					var mainImg = data.detailInfo.detailImage[0].list;
					for(var n in mainImg){
						//console.log(services[j].name)
						$("#mainImg").append('<img src="'+mainImg[n]+'"/>');	
					};
					
				}
			});
			
//data.itemServices.columns[j].desc
			
			
		})
	},
	loadFooter(){
		$("#footer").load("viwes/spxq.html #spxqFooter",function(){
			//console.log("ok");
			$("#spxqKf").on("tap",function(){
				
				var index = sessionStorage.getItem("index");
				console.log(index)
				if(index == '0'){
					$("#header").css("display","block");
					Home.loadHeader();
					Home.loadContent();
					MyFooter.loadFooter();
					MyFooter.loadFooterStyle(0);
				}else{
					$("#header").css("display","block");
					User.loadHeader();
					User.loadContent();
					MyFooter.loadFooter();
					MyFooter.loadFooterStyle(1);
					
				}
				
			});
			$("#spxqCart").on("tap",function(){
				//console.log(3333);
				$("#footer").css("display","none");
				$("#addCart").html("");
				$("#addCart").css("display","block");
				//====================
				var id =	localStorage.getItem('iid');
				$.ajax({				
				url:"http://m.mogujie.com/jsonp/detail.api/v1?iid="+id+"&template=1-2-detail_normal-1.0.0&callback=?&_=1501287362005",
				type:"get",
				dataType:"jsonp",
				success:function(data){
				var data = data.data;
				//console.log(data);				

					$("#addCart").append('<div id="cartDiv">'+
						'<img src="'+data.topImages[0]+'"/>'+'</div>')
					
					
					$("#addCart").append('<span>￥'+data.itemInfo.highNowPrice+'</span>');
					$("#addCart").append('<p>请选择:'+data.skuInfo.styleKey+' ' +data.skuInfo.sizeKey+'</p>');	
					
					
					$("#addCart").append('<ol id="yanse"><a>'+data.skuInfo.styleKey+'：</a></ol>');
					var props = data.skuInfo.props[0].list;
					for(var j in props){
						//console.log(services[j].name)
						$("#yanse").append('<strong>'+props[j].name+'</strong>');	
					};
					
					$("#addCart").append('<ol id="chima"><a>'+data.skuInfo.sizeKey+'：</a></ol>');
					var props = data.skuInfo.props[1].list;
					for(var v in props){
						//console.log(services[j].name)
						$("#chima").append('<strong>'+props[v].name+'</strong>');	
					};	
					$("#addCart").append('<ol id="number"><a>数量：</a></ol>');

						//console.log(services[j].name)
						$("#number").append('<ul><li class="romove">-</li><li class="numShop">1</li><li class="add">+</li></ul>');	
						$("#addCart").append('<button id="btnCart">确定</button>'	);
						$("#addCart").append('<h1 id="guanbi">x</h1>');
						
						
					$("#yanse strong").on("tap",function(){
						$(this).addClass("active").siblings().removeClass("active");
						
					});
					$("#chima strong").on("tap",function(){
						$(this).addClass("active").siblings().removeClass("active");
						
					});
					$("#guanbi").on("tap",function(){
					$("#addCart").css("display","none");
					$("#footer").css("display","block");
						
					});	
						
					$(".romove").on("tap",function(){
						var num = $(".numShop").html();
						if(num == 1){
							num = 1;
						}else{
							num--;
						}
						$(".numShop").html(num);
					});
					$(".add").on("tap",function(){
						var num = $(".numShop").html();
						
							num++;
						
						$(".numShop").html(num);
					});
					//点击确定添加到购物车
					$("#btnCart").on("tap",function(){
						
						var active1 = $("#yanse strong").attr("class");
						var active2 = $("#chima strong").attr("class");
						console.log(active1);
						if(active1 == undefined){
							alert("请选择颜色")
						}else if(active2 == undefined){
							alert("请选择尺码")
						}else{
							//alert("可以选择");
							var obj =	localStorage.getItem('data');
							var str = JSON.parse(obj); 
							console.log(str);
							var yanse = $("#yanse .active").html();
							var chima = $("#chima .active").html();
							var num = $(".numShop").html();
							var  money = data.itemInfo.highNowPrice;
							var  title = data.itemInfo.title;
							var src = data.topImages[0];
							console.log(num,yanse,chima,money,title,src);
							var array = [];
						if(str == null){
							array.push({'yanse':yanse,'chima':chima,'num':num,'money':money,'title':title,'src':src});
							var str1 = JSON.stringify(array);  
							localStorage.setItem('data',str1);
							console.log(str1)
						}else{
							str.push({'yanse':yanse,'chima':chima,'num':num,'money':money,'title':title,'src':src});
							var str1 = JSON.stringify(str);  
							localStorage.setItem('data',str1);
							console.log(str1)
						}
							
							
								


//							if(str == null){
//								
//								
//								
//							}
							
						}
						
					});
						
				}
			});
				
			});
			
		})
	}
}


