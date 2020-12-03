<template>
	<view>
		<uniSearchBar :radius="100" bgColor="#ffff" @confirm="_search" @input="_input"></uniSearchBar>
		<view class="list" v-if="searchList.length !=0">
			<view class="row" v-for="(item,index) in searchList" :key="index">
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>	
					<text>￥{{item.market_price}}</text>	
					<text>3565评论</text>	 
				</view>
			</view>
		</view>
		<view class="api" v-else>
			没有数据亲！
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import Api from "../../utils/Api.js"
	export default {
		components: {uniSearchBar},
		data() {
			return {
				value:"",
				searchList:[]
			}
		},
		onLoad(options){
			
		},
	
		methods: {
			_input:function(e){
				this.value = e.value
			},
			//点击搜索后，获取搜索结果
			_search:async function(){
				if(this.value == ''){
					uni.showToast({
						title:'搜索关键词不能为空',
						icon:'none'
					})
					return
				}
				uni.showLoading({
					title:'拼命搜索中'
				})
				let res  = await Api.doSearch({
					keywords:this.value
				});
				console.log(res);
				if(res.data.code == 200){
					if(res.data.list){
						this.searchList = Api.FormatImg(res.data.list)
					}else{
						this.searchList = []
					}
				}
				uni.hideLoading()
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
			}
		},
		
	}
</script>

<style>

	.row{
		position: relative;
		margin: 10rpx 20rpx;
		height: 190rpx;
		border-bottom: 1rpx solid #AAAAAA;
	}
	image{
		position: absolute;
		top: 0;
		left:10rpx;
		width: 160rpx;
	}
	.info{
		height: 85%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 200rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 25rpx;
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
