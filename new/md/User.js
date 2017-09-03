import "./../scss/main.scss";
import "./../scss/user.scss";
import Search from "./Search.js";
import Cart from "./Cart.js";
import Spxq from "./Spxq.js";
export default {
	loadHeader(){
		$("#header").load("viwes/user.html #searchHeader",function(){
			console.log("ok");
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
		$("#content").load("viwes/user.html #userContent",function(){
			console.log("ok")
			$.ajax({
				url:"http://mce.mogucdn.com/jsonp/multiget/3?pids=41789%2C4604&callback=?",
				type:"get",
				success:function(data){
					
					var listTittle = data.data[41789].list;
					//console.log(listTittle);
					for(var i in listTittle){
					$("#leftNav").append('<li maitKey="'+listTittle[i].maitKey+'" miniWallkey="'+listTittle[i].miniWallkey+'">'+
						'<p>'+listTittle[i].title+'</p>'+
					'</li>')
						
					}
					//默认
					$("#leftNav li").eq(0).addClass("active");
					$.ajax({
								url:"http://mce.mogujie.com/jsonp/makeup/3?pid=41888&_=1500888633455&callback=?",
								type:"get",
								success:function(data){
									$("#mianUp").html("");
									var dataList = data.data.categoryNavigation.list;
									//console.log(dataList);
									for(var p in dataList){
									$("#mianUp").append('<li>'+
										'<img src="'+dataList[p].image+'"/>'+
										'<span>'+dataList[p].title+'</span>'+
									'</li>');
									}

								}
								
						});
						$.ajax({
								url:"https://list.mogujie.com/search?cKey=h5-cube&fcid=10062603&page=1&_version=1&pid=&q=&cpc_offset=0&_=1501144810553&callback=?",
								type:"get",
								success:function(data){
									$("#mainList").html("");
									var mainList = data.result.wall.docs;
								//	console.log(mainList);
									for(var p in mainList){
									$("#mainList").append('<li iid= "'+mainList[p].iid+'">'+
										'<img src="'+mainList[p].img+'"/>'+
										'<ol>'+mainList[p].title+'</ol>'+
											'<p>'+
												'<a>'+mainList[p].price+'</a>'+
												'<a>'+mainList[p].cfav+'</a>'+
											'</p>'+
									'</li>');
									};
					var ni = $("#mainList li").on("tap",function(){
						//console.log(11111);
						$("#header").css("display","none");
						var iid = $(this).attr("iid");
						localStorage.setItem("iid",iid);
						Spxq.loadContent();
						Spxq.loadFooter();
	
					})

								}
								
							});
					//点击切换
					$("#leftNav li").on("tap",function(){
						$(this).addClass("active").siblings().removeClass("active");
						var $data = $(this).attr("maitKey");					
						//console.log($data);
							$.ajax({
								url:"http://mce.mogujie.com/jsonp/makeup/3?pid="+$data+"&_=1500888633455&callback=?",
								type:"get",
								success:function(data){
									$("#mianUp").html("");
									var dataList = data.data.categoryNavigation.list;
									console.log(dataList);
									for(var p in dataList){
									$("#mianUp").append('<li>'+
										'<img src="'+dataList[p].image+'"/>'+
										'<span>'+dataList[p].title+'</span>'+
									'</li>');
									}

								}
								
							});
							var $datas = $(this).attr("miniWallkey");
							$.ajax({
								url:"https://list.mogujie.com/search?cKey=h5-cube&fcid="+$datas+"&page=1&_version=1&pid=&q=&cpc_offset=0&_=1501144810553&callback=?",
								type:"get",
								success:function(data){
									$("#mainList").html("");
									var mainList = data.result.wall.docs;
								//	console.log(mainList);
									for(var p in mainList){
									$("#mainList").append('<li iid= "'+mainList[p].iid+'">'+
										'<img src="'+mainList[p].img+'"/>'+
										'<ol>'+mainList[p].title+'</ol>'+
											'<p>'+
												'<a>'+mainList[p].price+'</a>'+
												'<a>'+mainList[p].cfav+'</a>'+
											'</p>'+
									'</li>');
									};
					var ni = $("#mainList li").on("tap",function(){
						//console.log(11111);
						$("#header").css("display","none");
						var iid = $(this).attr("iid");
						localStorage.setItem("iid",iid);
						Spxq.loadContent();
						Spxq.loadFooter();
	
					})
									
									
								}
								
							});
							
							
						
					})
				}
				
				
			});
			
			$("#ranking p").on("tap",function(){
				$(this).addClass("activeR").siblings().removeClass("activeR");
				
			})
			
			
			
		})
	}
	
}
