<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="goodInfo.img" />
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{goodInfo.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">￥{{goodInfo.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>			
		</view>
		
		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
				  <label class="jian" @click="_dec">-</label>
				  <label class="zhi">{{num}}</label>
				  <label class="jia" @click="_inc">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label>商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{goodInfo.specsname}}</label>
					<view class="bg" >{{goodInfo.specsattr}}</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		 <view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<rich-text :nodes="goodInfo.description"></rich-text>
			<image :src="goodInfo.img" mode="widthFix" style="width: 100%;" />
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="_addCart">加入购物车</button>
			<button class="footbtn2" @click="_buyNow">立即购买</button>
		</view>
	</view>
</template>

<script>
	import Api from "../../utils/Api.js"
	export default {
		data() {
			return {
				id:'',
				goodInfo:{},
				num:1,
				bg:'threed3i1'
			}
		},
		onLoad: function (options) {
			this.id = options.id
			this._getGoodInfo(options.id)
		},
		onShow(){
			
		},
		
		methods: {
			//点击减按钮
			_dec:function(){
				if(this.num > 1){
					this.num--;
				}
			},
			//点击增按钮
			_inc:function(){
				if(this.num < this.goodInfo.number){
					this.num ++;
				}
			},
			//获取该商品的详情
			_getGoodInfo:async function(id){
				uni.showLoading({
					title:'加载中'
				})
				let res = await Api.getGoodInfo(id);
				if(res.data.code == 200){
					this.goodInfo = Api.FormatImg(res.data.list)
					this.goodInfo = this.goodInfo[0]
				}
				uni.hideLoading()
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
			},
			//点击加入购物车
			_addCart:async function(){
				let token = uni.getStorageSync('token') || '';
				let uid = uni.getStorageSync('uid') || '';
				if(token == '' || uid == ''){
					//#ifdef MP-WEIXIN
					uni.navigateTo({
						url:'../login/login'
					})
					//#endif
					//#ifndef MP-WEIXIN
					uni.navigateTo({
						url:'../send/send'
					})
					//#endif
				}else{
					let res = await Api.addCart(token,{
						uid,
						goodsid:this.id,
						num:this.num
					})
					if(res.data.code == 200){
						uni.showToast({
							title:'加入购物车成功'
						})
					}
					if(res.data.code == 403){
						uni.showToast({
							title:'登录已过期，请重新登录',
							icon:'none'
						})
						setTimeout(()=>{
							//#ifdef MP-WEIXIN
							uni.navigateTo({
								url:'../login/login'
							})
							//#endif
							//#ifndef MP-WEIXIN
							uni.navigateTo({
								url:'../send/send'
							})
							//#endif
						},2000)
					}
					if(res.data.code == 500){
						uni.showToast({
							title:'网络开小差了',
							icon:'none'
						})
					}
				}
			},
			//点击立即购买
			_buyNow:function(){
				let goodList = []
				this.goodInfo.num = this.num
				goodList.push(this.goodInfo)
				uni.setStorageSync('goods',goodList);
				uni.navigateTo({
					url:'../confirm/confirm'
				})
			}
		}
		
	}
</script>

<style>
	@import url("../../common/css/details.css");
</style>
