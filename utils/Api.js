import {http,baseUrl}  from  './http.js'
//给图片加上域名
const FormatImg=(list)=>{
	list.forEach(item=>{
		item.img = baseUrl+item.img
	})
	return list
}
//转化时间格式
const formatTime=()=>{
	let date=new Date()
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second
}
//获取导航一级分类
const getTopCate=()=>{
	return http({
		url:'/api/getcate',
	})
}
//获取轮播图
const getBanner=()=>{
	return http({
		url:'/api/getbanner',
	})
}
//获取商品分类
const getGoodsCate=()=>{
	return http({
		url:'/api/getcates'
	})
}
//获取一级分类下的所有商品
const getCateGoods=(data={})=>{
	return http({
		url:'/api/getcategoods',
		data
	})
}
//获取一级分类下的所有商品（分页版）
const getCateGoodsPage=(data={})=>{
	return http({
		url:'/api/getcategoodPage',
		data
	})
}
//获取限时秒杀信息
const getSeckill=()=>{
	return http({
		url:'/api/getseckill'
	})
}
//获取商品信息（首页）
const getIndexGoods=()=>{
	return http({
		url:'/api/getindexgoods'
	})
}
//获取一个商品信息
const getGoodInfo=(id)=>{
	return http({
		url:'/api/getgoodsinfo',
		data:{
			id
		}
	})
}
//搜索
const doSearch=(data={})=>{
	return http({
		url:'/api/search',
		data
	})
}
//发送短信验证码
const sendCode=(data={})=>{
	return http({
		url:'/api/sms',
		data
	})
}
//登录
const login=(data={})=>{
	return http({
		url:'/api/wxlogin',
		data
	})
}
//加入购物车
const addCart=(token,data={})=>{
	return http({
		url:'/api/cartadd',
		data,
		header:{
			'content-type':"application/x-www-form-urlencoded",
			'authorization':token
		}
	})
}
//获取购物车列表
const getCartList=(token,data={})=>{
	return http({
		url:'/api/cartlist',
		data,
		header:{
			'content-type':"application/x-www-form-urlencoded",
			'authorization':token
		}
	})
}
//购物车修改
const editCart=(token,data={})=>{
	return http({
		url:'/api/cartedit',
		data,
		header:{
			'content-type':"application/x-www-form-urlencoded",
			'authorization':token
		}
	})
}
//购物车删除
const delCart=(token,data={})=>{
	return http({
		url:'/api/cartdelete',
		data,
		header:{
			'content-type':"application/x-www-form-urlencoded",
			'authorization':token
		}
	})
}
//订单添加
const addOrder=(token,data={})=>{
	return http({
		url:'/api/orderadd',
		data,
		header:{
			'content-type':"application/x-www-form-urlencoded",
			'authorization':token
		}
	})
}
//获取订单列表
const getOrder=(token,data={})=>{
	return http({
		url:'/api/orders',
		data,
		header:{
			'content-type':"application/x-www-form-urlencoded",
			'authorization':token
		}
	})
}
export default{
	FormatImg,
	formatTime,
	getTopCate,
	getCateGoods,
	getCateGoodsPage,
	getBanner,
	getGoodsCate,
	getSeckill,
	getIndexGoods,
	getGoodInfo,
	doSearch,
	sendCode,
	login,
	addCart,
	getCartList,
	editCart,
	delCart,
	addOrder,
	getOrder
}