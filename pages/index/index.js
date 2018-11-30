//index.js
//获取应用实例
const app = getApp()
let ctx = wx.createCanvasContext("imageCanvas");

Page({
  data: {
    canvasWidth:310,
    canvasHeight: 200
  },
  onLoad: function (options) {
    //获取屏幕宽高
    this.setData({
      canvasWidth: wx.getSystemInfoSync().windowWidth,
      canvasHeight: wx.getSystemInfoSync().windowHeight
    })
    //绘制水印
    this.drawImage();
    ctx.draw();
  },
  // 添加图片
  addImg(){
    let that = this
    var mW = null
    var mH = null
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        //获取图片的宽高
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            const imgWidth = res.width
            const imgHeight = res.height
            if (imgWidth > that.data.canvasWidth && imgHeight < that.data.canvasHeight){
              mW = that.data.canvasWidth
              mH = (that.data.canvasWidth / imgWidth)*imgHeight
            } else if (imgWidth < that.data.canvasWidth && imgHeight > that.data.canvasHeight){
              mW = (that.data.canvasHeight / imgHeight) * imgWidth
              mH = that.data.canvasHeight
            } else if (imgWidth < that.data.canvasWidth && imgHeight < that.data.canvasHeight){
              mH = imgHeight
              mW = imgWidth
            } else if (imgWidth > that.data.canvasWidth && imgHeight > that.data.canvasHeight){
              if ((imgWidth - that.data.canvasWidth) > (imgHeight - that.data.canvasHeight)){
                mW = that.data.canvasWidth
                mH = (that.data.canvasWidth / imgWidth)*imgHeight
              }else{
                mW = (that.data.canvasHeight / imgHeight) * imgWidth
                mH = that.data.canvasHeight
              }
            }
            console.log('获取到图片大小',mW,mH)
            that.setData({
              canvasWidth:mW,
              canvasHeight:mH
            })
          }
        })
      }
    })
  },
  //批量生成图片
  batchImg(){
    wx.canvasToTempFilePath({
      canvasId: 'imageCanvas',
      quality:1,
      success(res) {
        console.log(res.tempFilePath)
        //保存文件到相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存图片成功',
                icon: 'success',
                duration: 2000
              })
            }
            })
      }
    })
  },
  checkImgType(typs){
    if(types == 0){

    }else if(types == 1){

    }else {
      console.log('未知错误')
    }
  },
  drawImage: function () {
    ctx.drawImage("../../image/images.jpg", 0, 0, this.canvasWidth, this.canvasHeight)//在画布上绘入图片，参数含义移步手册。
    ctx.rotate(45 * Math.PI / 180);

    //对斜对角线以左部分进行文字的填充
    for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
      ctx.beginPath();
      ctx.setFontSize(30);
      ctx.setFillStyle("rgba(255,255,255,.5)");

      ctx.fillText("水印", 0, 50 * j);
      for (let i = 1; i < 10; i++) {//这个for循环代表横向循环，
        ctx.beginPath();
        ctx.setFontSize(30);
        ctx.setFillStyle("rgba(255,255,255,.5)");
        ctx.fillText("水印", 80 * i, 50 * j);
      }
    }//两个for循环的配合，使得文字充满斜对角线的左下部分

    //对斜对角线以右部分进行文字的填充逻辑同上
    for (let j = 0; j < 10; j++) {
      ctx.beginPath();
      ctx.setFontSize(30);
      ctx.setFillStyle("rgba(255,255,255,.5)");

      ctx.fillText("水印", 0, -50 * j);
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.setFontSize(30);
        ctx.setFillStyle("rgba(255,255,255,.5)");
        ctx.fillText("水印", 80 * i, -50 * j);
      }
    }
    return ctx
  }
})
