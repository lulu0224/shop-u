<template>
	<view class="container">
		<!-- left左侧一级分类列表 -->
		<scroll-view scroll-y class="left">
			<!-- 循环遍历的 -->
			<view class="left_list" :class="activeIndex == index ? 'activeList' : ''"
			 v-for="(item,index) in cateData" :key="index" @click="_changeIndex(index)">
				<label for="">{{ item.catename }}</label>
			</view>
		</scroll-view>
		<!-- right右侧二级分类详情 -->
		<scroll-view scroll-y class="right">
			<view class="row">
				<view class="row_list" v-for="(item,index) in classify" :key="index" @click="_goProduct(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<text>{{item.catename}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Api from '../../utils/Api.js'
	export default {
		data(){
			return {
				activeIndex:0,
				cateData:[],//左侧一级分类数据
			}
		},
		onLoad() {
			this._getGoodsCate()
		},
		computed:{
			classify:function(){
				let index=this.activeIndex
				if(this.cateData.length==0) return []
				if(this.cateData[index].children){
					return Api.FormatImg(this.cateData[index].children) 
				}else{
					return []
				}
			}
		},
		methods:{
			//获取所有商品分类
			_getGoodsCate:async function(){
				let res  = await Api.getGoodsCate();
				if(res.data.code == 200){
					this.cateData = res.data.list
				}
				if(res.data.code == 500){
					uni.showToast({
						title:'网络开小差了',
						icon:'none'
					})
				}
			},
			//改变激活样式
			_changeIndex:function(index){
				this.activeIndex = index
				this._getGoodsCate()
			},
			//点击二级分类，跳转到相应商品列表
			_goProduct:function(id){
				uni.navigateTo({
					url:'../product/product?fid='+id
				})
			}
			
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");
	
	/* 点击左侧导航，显示动态样式 */
	.activeList{
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}
</style>
