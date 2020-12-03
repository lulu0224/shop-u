<template>
	<view class="container" v-if="buffer">
		<view class="top">
			<scroll-view class="scroll-view_H" scroll-x="true" :scroll-left="scrollLeft" v-for="(item,index) in cartList" :key="item.id">
				<view class="cartInfo" id="demo1">
					<!-- 明日来写购物车基本信息 -->
					<view class="cartInfochild">
						<!-- 选择框 -->
						<view class="cartInfo_switch common">
							<!-- 点击当前商品 -->
							<switch type="checkbox" :checked="item.checked" @change="_checkSingle($event,index)" />
						</view>
						<!-- 图片 -->
						<view class="cartInfo_image common">
							<image :src="item.img" mode="widthFix"></image>
						</view>

						<!-- 信息 -->
						<view class="cartInfo_info">
							<label style="font-size: 26rpx;">{{item.goodsname}}</label>
							<label style="font-size: 24rpx; color: #ccc;">规格：不错的商品</label>
							<label style="color: red;">￥{{item.price}}</label>
						</view>
						<!-- 加减数量 -->
						<view class="cartInfo_num">
							<view class="cartInfo_num_child">
								<label @click="_editCart(1,index)">-</label>
								<label>{{item.num}}</label>
								<label @click="_editCart(2,index)">+</label>
							</view>
						</view>
					</view>

				</view>
				<view class="cartDel" id="demo2">
					<label for="" @click="_delCart(index)">删除</label>
				</view>
			</scroll-view>
		</view>

		<!-- 底部 -->
		<view class="foot">
			<view class="footd1">
				<switch type="checkbox" :checked="checkAll" @change="_checkAll($event)" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">总计：<label style="color: red;">{{totalPrice}}</label></view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="_goConfirm">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{totalNum}}件)</label>
			</view>
		</view>

	</view>
	<view v-else>
		<image src="/static/kk.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
	import Api from "../../utils/Api.js"
	export default {
		data() {
			return {
				scrollLeft: 0, //默认横向滚动 0,
				buffer: true, //检测购物车是否有数据
				cartList: [],
				resh:true,
				checkSingle: false
			}
		},
		onLoad(){
			this._getCartList()
			this.resh = false
		},
		onShow(){
			if(this.resh){
				this._getCartList()
			}
			this.resh = true
		},
		watch:{
			
		},
		computed:{
			 // 选中项列表
			checkedList(){
				let list = this.cartList.filter(item =>{
				return item.checked;
				})
				return list;
			},
			//计算总价
			totalPrice() {
				let total = 0;
				this.checkedList.map(item=>{
						total += item.price*item.num
				})
				return total
			},
			//计算总数量
			totalNum() {
				let num = 0;
				this.checkedList.map(item=>{
						num += item.num
				})
				return num
			},
			//全选
			checkAll:{
				get(){
					return this.cartList.every(item=>item.checked)
				},
				set(val){
					this.cartList.map(item=>item.checked = val);
				}
			}
		},
		
		methods: {
			//获取购物车列表
			_getCartList: async function() {
				let token = uni.getStorageSync('token') || '';
				let uid = uni.getStorageSync('uid') || '';
				if (token == '' || uid == '') {
					uni.showToast({
							title:'请先登录',
							icon:'none'
					})
					setTimeout(()=>{
						//#ifdef MP-WEIXIN
						uni.navigateTo({
							url: '../login/login'
						})
						//#endif
						//#ifndef MP-WEIXIN
						uni.navigateTo({
							url: '../send/send'
						})
						//#endif
					},2000)
					return
				} 
					
					let res = await Api.getCartList(token, {
						uid
					})
					if (res.data.code == 200) {
						if(!res.data.list){
							this.buffer = false
							return
						}
						uni.showLoading({
							title: '拼命加载中'
						})
							let cartList = Api.FormatImg(res.data.list)
							cartList.forEach(item => {
								item.checked = false
							})
							this.cartList = cartList
						}
					uni.hideLoading()
					if (res.data.code == 403) {
						uni.showToast({
							title: '登录已过期，请重新登录',
							icon: 'none'
						})
						setTimeout(() => {
							//#ifdef MP-WEIXIN
							uni.navigateTo({
								url: '../login/login'
							})
							//#endif
							//#ifndef MP-WEIXIN
							uni.navigateTo({
								url: '../send/send'
							})
							//#endif
						}, 2000)
					}
					if (res.data.code == 500) {
						uni.showToast({
							title: '网络开小差了',
							icon: 'none'
						})
					}
				
			},
			//点击全选
			_checkAll: function(e) {
				this.checkAll = e.detail.value
			},
			//单选
			_checkSingle: function(e,index) {
				this.cartList[index].checked = e.detail.value
			},
			//购物车商品数量修改
			_editCart: async function(type, index) {
				if (type == 1) { //数量减
					if (this.cartList[index].num == 1) {
						return
					}
				}
				let token = uni.getStorageSync('token') || ''
				let res = await Api.editCart(token, {
					id: this.cartList[index].id,
					type,
				})
				if (res.data.code == 200) {
					if(type == 1){
						this.cartList[index].num--
					}
					if(type == 2){
						this.cartList[index].num++
					}
				}
				if (res.data.code == 403) {
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					})
					setTimeout(() => {
						//#ifdef MP-WEIXIN
						uni.navigateTo({
							url: '../login/login'
						})
						//#endif
						//#ifndef MP-WEIXIN
						uni.navigateTo({
							url: '../send/send'
						})
						//#endif
					}, 2000)
				}
				if (res.data.code == 500) {
					uni.showToast({
						title: '网络开小差了',
						icon: 'none'
					})
				}
			},
			//购物车删除
			_delCart:async function(index){
				uni.showModal({
					title:'删除提示',
					content:'您确定要删除吗？',
					success:async res=>{
						if(res.confirm){
							let token = uni.getStorageSync('token') || ''
							let result = await Api.delCart(token, {
								id: this.cartList[index].id
							})
							if (result.data.code == 200) {
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								})
								this._getCartList()
							}
							if (result.data.code == 403) {
								uni.showToast({
									title: '登录已过期，请重新登录',
									icon: 'none'
								})
								setTimeout(() => {
									//#ifdef MP-WEIXIN
									uni.navigateTo({
										url: '../login/login'
									})
									//#endif
									//#ifndef MP-WEIXIN
									uni.navigateTo({
										url: '../send/send'
									})
									//#endif
								}, 2000)
							}
							if (result.data.code == 500) {
								uni.showToast({
									title: '网络开小差了',
									icon: 'none'
								})
							}
						}
					}
				})
			},
			//点击去结算，去往结算页面
			_goConfirm:function(){
				if(this.checkedList.length == 0){
					uni.showToast({
						title:'您还未勾选任何商品',
						icon:'none'
					})
					return
				}
				uni.setStorageSync('goods',this.checkedList);
				uni.navigateTo({
					url:'../confirm/confirm'
				})
			}
		
		}
	}
</script>

<style>
	@import url("../../common/css/cart.css");

	.cartInfo_image_img {
		width: 120rpx;
		height: 120rpx;
	}
</style>
