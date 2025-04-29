/**
 * Shift.js - 视差和鼠标跟踪效果
 */

(function() {
  "use strict";
  
  // 全局变量
  var mouseX = 0,
      mouseY = 0,
      windowWidth = window.innerWidth,
      windowHeight = window.innerHeight;
  
  // 初始化函数
  function init() {
    // 添加鼠标移动事件监听
    document.addEventListener('mousemove', onMouseMove);
    
    // 添加窗口大小改变事件监听
    window.addEventListener('resize', onResize);
    
    // 添加设备方向事件监听（针对移动设备）
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation);
    }
    
    // 开始动画循环
    requestAnimationFrame(update);
  }
  
  // 鼠标移动处理函数
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
  
  // 设备方向处理函数（针对移动设备）
  function onDeviceOrientation(e) {
    // 将设备倾斜转换为鼠标坐标的等效值
    if (e.beta && e.gamma) {
      mouseX = (e.gamma / 30) * (windowWidth / 2) + windowWidth / 2;
      mouseY = (e.beta / 30) * (windowHeight / 2) + windowHeight / 2;
    }
  }
  
  // 窗口大小变化处理函数
  function onResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }
  
  // 获取鼠标位置的归一化值 (0-1范围)
  function getNormalizedMouseX() {
    return mouseX / windowWidth;
  }
  
  function getNormalizedMouseY() {
    return mouseY / windowHeight;
  }
  
  // 更新动画
  function update() {
    // 持续更新动画
    requestAnimationFrame(update);
    
    // 获取归一化的鼠标位置
    var nx = getNormalizedMouseX();
    var ny = getNormalizedMouseY();
    
    // 找到所有有视差效果的元素
    var parallaxElements = document.querySelectorAll('.parallax');
    
    // 更新每个视差元素的位置
    for (var i = 0; i < parallaxElements.length; i++) {
      var el = parallaxElements[i];
      var speed = el.getAttribute('data-parallax-speed') || 5;
      
      var offsetX = (nx - 0.5) * speed;
      var offsetY = (ny - 0.5) * speed;
      
      el.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
    }
  }
  
  // 公开API
  window.Shift = {
    init: init,
    getMouseX: function() { return mouseX; },
    getMouseY: function() { return mouseY; },
    getNormalizedMouseX: getNormalizedMouseX,
    getNormalizedMouseY: getNormalizedMouseY
  };
  
  // 页面加载完成后自动初始化
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})(); 