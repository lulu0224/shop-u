<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{ information.name }}</label>
				<label for="">{{ information.phone }}</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">{{ information.address }}</label>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">
			<view class="cartsInfo" v-for="(item,index) in goods" :key="index">
				<!-- 70px -->
				<view class="carts_detail">
					<image :src="item.img" mode="widthFix" style="width:500rpx;"></image>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:不错的商品</view>
					</view>
					<view class="carts_price">
						<label for="">￥ {{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian">-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>
			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use">
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥200</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{totalPrice}}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn" @click="_submitOrder">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary">提交订单</button>
		</view>
	</view>
</template>

<script>
	import Api from "../../utils/Api.js"
	export default {
		data() {
			return {
				information: {
					name: 'YouSu',
					phone: '18240279221',
					address: '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层'
				},
				goods: []
			}
		},
		onLoad(option) {
			let token = uni.getStorageSync('token') || '';
			let uid = uni.getStorageSync('uid') || '';
			let goods = uni.getStorageSync('goods') || [];
			if (token == '' || uid == '') {
				uni.showToast({
					title: '请先登录',
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
				return
			}
			if (goods.length == 0) {
				uni.showToast({
					title: '您还未选择任何商品',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 2000)
			} else {
				this.goods = goods
			}
		},
		computed: {

			//计算总价
			totalPrice() {
				let total = 0;
				this.goods.forEach(item => {
					total += item.price * item.num
				})
				return total
			},
			//计算总数量
			totalNum() {
				let num = 0;
				this.goods.forEach(item => {
					num += item.num
				})
				return num
			},
		},
		methods: {
			//点击提交订单
			_submitOrder: async function() {
				let idArr = this.goods.map(item => {
					return item.id
				})
				let token = uni.getStorageSync('token') || '';
				let uid = uni.getStorageSync('uid') || '';
				let res = await Api.addOrder(token, {
					params: {
						uid,
						username: this.information.name,
						userphone: this.information.phone,
						address: this.information.address,
						countmoney: this.totalPrice,
						countnumber: this.totalNum,
						addtime: Api.formatTime()
					},
					idstr: idArr.join(",")
				})
				if (res.data.code == 200) {
					uni.showToast({
						title: "下单成功"
					})
					setTimeout(() => {
						uni.switchTab({
							url: '../mine/mine'
						})
					}, 2000)
				}
				if (res.data.code == 403) {
					uni.showToast({
						title: "请重新登录",
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
						title: "网络开小差了",
						icon: 'none'
					})
				}
			}
		}

	}
</script>

<style>
	@import url("../../common/css/confirm.css");
</style>
