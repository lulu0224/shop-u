<template>
	<view class="">
		<!-- 搜索框区域 -->
		<view class="head">
			<image src="../../static/index/logo.jpg" mode="widthFix"></image>
			<view class="searchview">
				<input type="text" value="" placeholder="寻找商品" @focus="_getsearch" />
			</view>
		</view>
		<!-- 快速分类导航 滚动视图 -->
		<scroll-view scroll-x class="quicknav">
			<view v-for="(item,index) in quicknav" :key="index" @click="_changeIndex(index,item.id)">
				<text :class="index == topindex ? 'navactive' : '' ">{{item.catename}}</text>
			</view>
		</scroll-view>
		<!-- 轮播图 -->
		<swiper indicator-dots circular autoplay :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in swipers" :key="index">
				<image :src="item.img" mode=widthFix></image>
			</swiper-item>
		</swiper>
		<!-- 功能导航 -->
		<view class="funnav">
			<view class="funnavrow" v-for="(item,index) in funNavList" :key="index" @click="_goGoodsCate(index)">
				<image :src="item.icon" mode="widthFix"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<!-- 秒杀商品推荐区域 -->
		<view class="seckill">
			<!-- 秒杀左侧区域 -->
			<view class="leftseckill">
				<view class="title">
					<image src="../../static/index/xianshi.jpg" mode="widthFix"></image>
					<text>限时秒杀</text>
				</view>
				<view class="info">
					<text>每天零点场，好货抢不停</text>
				</view>
				<view class="time">
					<view>00</view>:
					<view>00</view>:
					<view>00</view>
					<view>秒杀</view>
				</view>
				<image src="../../static/index/goods2.jpg" mode="widthFix" class="goodimg"></image>
			</view>
			<!-- 秒杀右侧区域 -->
			<view class="rightseckill">
				<view class="top">
					<view class="topinfo">
						<text>品牌上新 <text style="background: #f33182;font-size: 28rpx;color: white;">折</text></text>
						<text>每天九点，抢大牌</text>
					</view>
					<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
				</view>
				<view class="bottom">
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 广告图片推送区域 -->
		<view class="gg">
			<image src="../../static/index/swiper1.jpg" mode="widthFix"></image>
		</view>
		<!-- 推荐商品区域 -->
		<view class="recommendgood">
			<!-- 推荐导航 -->
			<view class="recommendnav">
				<view :class="tabindex==0 ? 'recommendactive' : '' "  @click="_changeTab(0)" >
					<text>热门推荐</text>
				</view>
				<view @click="_changeTab(1)" :class="tabindex == 1 ? 'recommendactive' : '' ">
					<text>上新推荐</text>
				</view>
				<view @click="_changeTab(2)" :class="tabindex == 2 ? 'recommendactive' : '' ">
					<text>所有商品</text>
				</view>
			</view>
			<view class="recommendlist">
				<view class="recommendrow" v-for="(item,index) in productContent" :key="index" @click="_godetail(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<view class="recommendrowinfo">
						<text>{{item.goodsname}}</text>
						<text>现价格： ￥{{item.price}}</text>
						<text>原价格：￥{{item.market_price}}</text>
						<text>
							立即抢购
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from "../../utils/Api.js"
	export default {
		data() {
			return {
				quicknav: [], //快速分类导航,
				topindex: 0,
				tabindex: 0,
				swipers: [],
				products: [], //热销、上新、所有商品数据
				funNavList: [{ //功能导航数据
						name: "限时抢购",
						icon: require("../../static/index/xiaohuoban.png")
					},
					{
						name: "积分商城",
						icon: require("../../static/index/jifentixicopy.png")
					},
					{
						name: "联系我们",
						icon: require("../../static/index/lianxiwomen.png")
					},
					{
						name: "商品分类",
						icon: require("../../static/index/-shangpinfenlei-gai.png")
					}
				],
			}
		},
		onLoad() {
			this._getTopCate()
			this._getBanner()
			this._getSeckill()
			this._getIndexGoods()
		},
		computed:{
			productContent:function(){
				let index = this.tabindex;
				if(this.products.length == 0){
					return []
				}else{
					if(this.products[index].content){
						return Api.FormatImg(this.products[index].content)
					}else{
						return []
					}
					
				}
			}
		},
		methods: {
			//搜索功能，去往搜索页面
			_getsearch:function(e){
				uni.navigateTo({
					url:'../search/search'
				})
			},
			//获取一级分类
			_getTopCate:async function(){
				let res  = await Api.getTopCate();
				if(res.data.code == 200){
					this.quicknav = res.data.list
				}
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
			},
			//改变一级分类的激活样式和跳转到相应的分类列表
			_changeIndex:function(index,fid){
				this.topindex = index
				uni.navigateTo({
					url:'../product/product?fid='+fid
				})
			},
			//获取轮播图
			_getBanner:async function(){
				let res  = await Api.getBanner();
				if(res.data.code == 200){
					this.swipers = Api.FormatImg(res.data.list)
				}
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
			},
			//点击商品分类，去往商品分类页面
			_goGoodsCate:function(index){
				if(index == 3){
					uni.navigateTo({
					url:'../classify/classify'
				})
				}
			},
			//获取限时秒杀信息
			_getSeckill:async function(){
				let res  = await Api.getSeckill()
			},
			//选项卡切换
			_changeTab:function(n){
					this.tabindex = n
					this._getIndexGoods()
			},
			//获取商品信息
			_getIndexGoods:async function(){
				let res  = await Api.getIndexGoods()
				if(res.data.code == 200){
					this.products = res.data.list
				}
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
			},
			//点击一个商品进入该商品的详情页
			_godetail:function(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			}
		}
		
	}
</script>

<style>
@import url("../../common/css/index.css");
</style>
