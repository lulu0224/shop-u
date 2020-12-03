<template>
	<view>
		<view class="search">
			<icon type="search" color="white" size="10"></icon>
			<input type="text" value="" placeholder="搜索商品" placeholder-class="placeholder" @focus="_getsearch"/>
		</view>
		<view class="list">
			<view class="row" v-for="(item,index) in productList" :key='index' @click="_goDetail(item.id)">
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>	
					<text>￥{{item.market_price}}</text>	
					<text>3565评论</text>	
				</view>
			</view>
		</view>
		<view class="api" v-if="productList.length==0">
			暂无商品数据！
		</view>
	</view>
</template>

<script>
	import Api from "../../utils/Api.js"
	export default {
		data() {
			return {
				fid:"",
				page:1,
				pageCount:0,
				productList:[]
			}
		},
		onLoad(options){
			this.fid = options.id
			this._getCateGoods(options.fid,1)
		},
		onReachBottom(){
			this.page++;
			if(this.page < this.pageCount){
				this._getCateGoods(this.fid,this.page)
			}else{
				uni.showToast({
					title:'我们是有底线的哟~',
					icon:'none'
				})
			}
		},
		methods: {
			//获取分类下的所有商品
			_getCateGoods:async function(fid,page){
				uni.showLoading({
					title:'拼命加载中'
				})
				let res = await Api.getCateGoodsPage({
					fid,
					size:6,
					page
					})
				if(res.data.code == 200){
					if(res.data.list[1]){
						this.productList = this.productList.concat(Api.FormatImg(res.data.list[1]))
						this.pageCount = res.data.list[0]
					}
				}
				uni.hideLoading()
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
				
			},
			//点击商品，跳转到相应商品的详情
			_goDetail:function(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			},
			//搜索功能，去往搜索页面
			_getsearch:function(e){
				uni.navigateTo({
					url:'../search/search'
				})
			}
		}
		
	}
</script>

<style>
	.search{
		margin: 65rpx;
		height: 75rpx;
		background-color: #f26b11;
		border-radius: 80rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	icon{
		margin:0 10rpx 0 250rpx;
	}
	.placeholder{
		color: white;
		font-size: 25rpx;
	}
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
