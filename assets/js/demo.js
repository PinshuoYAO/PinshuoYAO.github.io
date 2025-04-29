/**
 * 向量场动画效果
 */
document.addEventListener('DOMContentLoaded', function() {
  // 只在有容器的页面初始化
  const container = document.getElementById('vector-field-container');
  if (!container) return;
  
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const gridSize = 30;
  const cols = Math.floor(width / gridSize);
  const rows = Math.floor(height / gridSize);
  
  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);
  
  // 获取绘图上下文
  const ctx = canvas.getContext('2d');
  
  // 向量数组
  let vectors = [];
  
  // 初始化向量场
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const angle = Math.random() * Math.PI * 2;
      vectors.push({
        x: x * gridSize + gridSize / 2,
        y: y * gridSize + gridSize / 2,
        dx: Math.cos(angle),
        dy: Math.sin(angle)
      });
    }
  }
  
  // 鼠标位置
  let mouseX = -1000;
  let mouseY = -1000;
  
  // 监听鼠标移动
  container.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  
  // 监听鼠标离开
  container.addEventListener('mouseleave', function() {
    mouseX = -1000;
    mouseY = -1000;
  });
  
  // 更新并绘制向量场
  function draw() {
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制向量
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < vectors.length; i++) {
      const v = vectors[i];
      
      // 计算到鼠标的距离
      const dx = mouseX - v.x;
      const dy = mouseY - v.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // 当鼠标靠近时应用力
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.2;
        v.dx -= dx / dist * force;
        v.dy -= dy / dist * force;
        
        // 标准化向量
        const len = Math.sqrt(v.dx * v.dx + v.dy * v.dy);
        v.dx /= len;
        v.dy /= len;
      }
      
      // 绘制线段
      ctx.beginPath();
      ctx.moveTo(v.x, v.y);
      ctx.lineTo(v.x + v.dx * 10, v.y + v.dy * 10);
      ctx.stroke();
    }
    
    // 随机轻微扰动向量
    if (Math.random() < 0.05) {
      const idx = Math.floor(Math.random() * vectors.length);
      const angle = Math.atan2(vectors[idx].dy, vectors[idx].dx) + (Math.random() - 0.5) * 0.2;
      vectors[idx].dx = Math.cos(angle);
      vectors[idx].dy = Math.sin(angle);
    }
    
    requestAnimationFrame(draw);
  }
  
  // 开始动画
  draw();
  
  // 处理容器点击 - 全局扰动
  container.addEventListener('click', function() {
    vectors.forEach(v => {
      const angle = Math.atan2(v.dy, v.dx) + (Math.random() - 0.5) * Math.PI / 2;
      v.dx = Math.cos(angle);
      v.dy = Math.sin(angle);
    });
  });
}); 