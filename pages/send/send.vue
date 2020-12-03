<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone"/>
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text @click="_check">{{msg}}</text>
			</view>
			<input type="text" placeholder="- - - -" maxlength="4" v-model="code" @blur="_checkcode"/>
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<button  type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;" @click ="_login">登录</button>
		</view>
		<view class="row">
			<text style="color: #006699;text-align: center;" >通过微信授权登录</text>
		</view>
	</view>
</template>
 
<script>
	import Api from "../../utils/Api.js"
	export default {
		data() {
			return {
				phone:"",
				checkphone:false,
				code:"",
				checkcode:false,
				msg:"获取验证码",
				sendFlag:true
			}
		},
		onLoad() {},
		methods: {
			//点击获取验证码
			_check:async function(){
					if(this.phone== ''){
						uni.showToast({
							title:'手机号不能为空',
							icon:'none'
						})
						return false
					}
					let reg = /^1[3456789]\d{9}$/
					if(!reg.test(this.phone)){
						uni.showToast({
							title:'手机号格式不正确',
							icon:'none'
						})
						return false
					}
				this.checkphone = true;
				if(this.sendFlag){
					this.sendFlag = false;
					let res = await Api.sendCode({
						phone:this.phone
					})
					if(res.data.code== 200){
						uni.setStorageSync("code",res.data.list.code)
						let t = 60;
						let timer = setInterval(()=>{
							t--;
							if(t<=0){
								clearInterval(timer);
								t = 60;
								uni.removeStorageSync("code")
								this.msg = '获取验证码';
								this.sendFlag = true
								return
							}
							this.msg = `${t}s后重新发送`
						},1000)
					}
					if(res.data.code==500){
							this.sendFlag = true
							uni.showToast({
								title:'网络开小差了',
								icon:'none'
							})
						}
				}
			},
			//当验证码输入框失去焦点时，做验证
			_checkcode:function(){
				if(this.code == ''){
					uni.showToast({
						title:'验证码不能为空',
						icon:'none'
					})
					return false
				}
				if(this.code.length!=4){
					uni.showToast({
						title:'验证码不正确',
						icon:'none'
					})
					return false	
				}
				let inputcode=this.code
				let code=uni.getStorageSync('code')||""
				if(inputcode!=code){
					uni.showToast({
						title:'验证码不正确',
						icon:'none'
					})
					return false	
				}
				this.checkcode=true
			},
			//点击登录
			_login:async function(){
				if(!this.checkcode || !this.checkcode){
					uni.showToast({
						title:'您输入的内容有误',
						icon:'none'
					})
				}
				if(this.checkphone&&this.checkcode){
					let res  = await Api.login({
						phone:this.phone
					})
					if(res.data.code == 200){
						uni.setStorageSync('phone',res.data.list.phone);
						uni.setStorageSync('token',res.data.list.token);
						uni.setStorageSync('uid',res.data.list.uid);
						uni.navigateBack()
						}
					if(res.data.code==500){
						this.sendFlag = true
						uni.showToast({
							title:'网络开小差了',
							icon:'none'
						})
					}
				}
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	/* @import url("../../common/css/index.css"); */
	.box{
		position: relative;
	}

	.row{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}
	.send{
		display: flex;
		justify-content: space-between;
	}
	.send text:nth-of-type(2){
		color: #00BB00;
	}
	text{
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}
	input{
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}
	
</style>
