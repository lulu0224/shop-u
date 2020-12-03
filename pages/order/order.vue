]<template>
	<view>
		<uni-search-bar :radius="100" bgColor="#ffff" @confirm="search" @input="input" @cancel="cancel"></uni-search-bar>
		<view class="list" v-if="orders.length!=0">
			<view class="row" v-for="(item,index) in orders" :key="index">
				<view class="imagebox" v-for="(item1,index1) in item.child" :key="index1">
					<image :src="item1.img" mode="widthFix" ></image>
					<text>{{item1.goodsname}}</text>
				</view>
				<view class="info">
					<text  space="nbsp">总计{{item.countnumber}}商品  </text>  
					<text>应付金额 ￥:{{item.countmoney}}</text>
				</view>
			</view>
		</view>
		<view class="api" v-else>  
			没有数据亲！
		</view>
	</view>
</template>

<script>
	import Api from "../../utils/Api.js"
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'; 
	export default {
		components: {uniSearchBar},
		data() {
			return {
				orders:[]
			}
		},
		onLoad() {
			this.token=uni.getStorageSync("token")||""
		},
		onShow(options){
			if(this.token==""){
				uni.showToast({
					title:'请先登录',
					icon:'none'
				})
				uni.navigateTo({
					url:'../send/send'
				})
				return
			}else{
				this._getOrder()
			}
		},
	
		methods: {
			_getOrder:async function(){
				let res=await Api.getOrder(this.token,{
					uid:uni.getStorageSync("uid")
				})
				console.log(res)
				if(res.data.code==200){
					res.data.list.forEach(item=>{
						item.child=Api.FormatImg(item.child)
					})
					this.orders=res.data.list
				}
				if(res.data.code==403){
					uni.showToast({
						title:"请重新登录",
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:'../send/send'
						})
					},2000)
				}
				if(res.data.code==500){
					uni.showToast({
						title:"网络开小差了",
						icon:'none'
					})
				}
			}
		}
		
	}
</script>

<style>

	.row{
		position: relative;
		margin: 10rpx 20rpx;
		min-height: 240rpx;
		border: 1rpx solid #AAAAAA;
		border-radius: 30rpx;
	}
	
	.imagebox{
		
		display: flex;
		align-items: center;
	}
	image{
		width: 160rpx;
		margin-left: 10rpx;
	}
	text{
		font-size: 14px;
	}
	.info{
		position: absolute;
		bottom: 20rpx;
		right: 0rpx;
		display: flex;
		justify-content: space-between;
		font-size: 25rpx;
		width: 340rpx;
	}
	.info text:nth-of-type(2){
		color: red;
	}
	.info text:nth-of-type(3){
		font-size: 20rpx;
		color: #AAAAAA;
	}
	.api{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>
