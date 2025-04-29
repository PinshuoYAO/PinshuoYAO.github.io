/*
	Solid State by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight(),
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

	// Menu.
		var $menu = $('#menu');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {

				event.stopPropagation();

				// Hide.
					$menu._hide();

			})
			.find('.inner')
				.on('click', '.close', function(event) {

					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();

					// Hide.
						$menu._hide();

				})
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 350);

				});

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

	// === START MOBILE NAV TOGGLE ===
	document.addEventListener('DOMContentLoaded', () => {
		const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
		const body = document.body;
		// Check if the toggle button exists before adding the listener
		if (mobileNavToggle) {
			mobileNavToggle.addEventListener('click', () => {
				body.classList.toggle('mobile-nav-active');
				// Toggle aria-expanded attribute for accessibility
				const isExpanded = body.classList.contains('mobile-nav-active');
				mobileNavToggle.setAttribute('aria-expanded', isExpanded);
			});
		}
		// Optional: Close menu when clicking on a link inside the mobile menu
		const mobileNavMenu = document.querySelector('.mobile-nav-menu');
		if(mobileNavMenu) {
			mobileNavMenu.addEventListener('click', (event) => {
				if (event.target.tagName === 'A') {
					body.classList.remove('mobile-nav-active');
					mobileNavToggle.setAttribute('aria-expanded', 'false');
					// Allow default link behavior or handle smooth scrolling if needed
				}
			});
		}
		// Optional: Close menu when clicking outside the menu
		document.addEventListener('click', (event) => {
			if (body.classList.contains('mobile-nav-active') && 
				!mobileNavMenu.contains(event.target) && 
				!mobileNavToggle.contains(event.target)) {
				body.classList.remove('mobile-nav-active');
				mobileNavToggle.setAttribute('aria-expanded', 'false');
			}
		});

	});
	// === END MOBILE NAV TOGGLE ===

	// 动态背景效果
	document.addEventListener('DOMContentLoaded', function() {
		// 背景动画元素
		const dots = document.querySelectorAll('.optimized-dot');
		// 鼠标移动时添加额外的动画效果
		document.addEventListener('mousemove', function(e) {
			const mouseX = e.clientX / window.innerWidth;
			const mouseY = e.clientY / window.innerHeight;
			dots.forEach((dot, index) => {
				const offsetX = (mouseX - 0.5) * (index + 1) * 20;
				const offsetY = (mouseY - 0.5) * (index + 1) * 20;
				dot.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
			});
		});
		// 初始化矢量场动画
		initVectorField();

		// 页面加载时立即触发一次滚动检测，确保内容可见
		window.dispatchEvent(new Event('scroll'));

		// 直接给所有.fade-in元素加.visible，确保内容显示
		const fadeElements = document.querySelectorAll('.fade-in');
		fadeElements.forEach(element => {
			element.classList.add('visible');
		});
	});

	// 矢量场动画
	function initVectorField() {
		const container = document.getElementById('vector-field-container');
		if (!container) return;
		
		// 创建canvas元素
		const canvas = document.createElement('canvas');
		canvas.width = container.offsetWidth;
		canvas.height = container.offsetHeight;
		container.appendChild(canvas);
		
		const ctx = canvas.getContext('2d');
		
		// 设置粒子
		const particleCount = 100;
		const particles = [];
		
		// 粒子类
		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.vx = 0;
				this.vy = 0;
				this.radius = Math.random() * 2 + 1;
				this.color = `rgba(67, 83, 255, ${Math.random() * 0.5 + 0.2})`;
			}
			
			update() {
				// 计算矢量场中的力
				const angle = (Math.sin(this.x * 0.01) + Math.cos(this.y * 0.01)) * Math.PI;
				const force = 0.1;
				
				this.vx += Math.cos(angle) * force;
				this.vy += Math.sin(angle) * force;
				
				// 应用摩擦力
				this.vx *= 0.95;
				this.vy *= 0.95;
				
				// 更新位置
				this.x += this.vx;
				this.y += this.vy;
				
				// 边界处理
				if (this.x < 0) this.x = canvas.width;
				if (this.x > canvas.width) this.x = 0;
				if (this.y < 0) this.y = canvas.height;
				if (this.y > canvas.height) this.y = 0;
			}
			
			draw() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
			}
		}
		
		// 初始化粒子
		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle());
		}
		
		// 动画循环
		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			// 更新并绘制每个粒子
			particles.forEach(particle => {
				particle.update();
				particle.draw();
			});
			
			// 绘制粒子之间的连接线
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					
					if (distance < 100) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(67, 83, 255, ${(100 - distance) / 500})`;
						ctx.lineWidth = 0.5;
						ctx.stroke();
					}
				}
			}
			
			requestAnimationFrame(animate);
		}
		
		animate();
		
		// 响应窗口大小变化
		window.addEventListener('resize', function() {
			canvas.width = container.offsetWidth;
			canvas.height = container.offsetHeight;
		});
	}

	// 滚动动画
	window.addEventListener('scroll', function() {
		const scrollPosition = window.scrollY;
		
		// 为有.fade-in类的元素添加滚动时的淡入效果
		const fadeElements = document.querySelectorAll('.fade-in');
		fadeElements.forEach(element => {
			const elementPosition = element.getBoundingClientRect().top;
			const windowHeight = window.innerHeight;
			
			if (elementPosition < windowHeight - 100) {
				element.classList.add('visible');
			}
		});
		
		// 导航栏滚动效果
		const nav = document.querySelector('.navigation');
		if (scrollPosition > 50) {
			nav.classList.add('scrolled');
		} else {
			nav.classList.remove('scrolled');
		}
	});

})(jQuery);