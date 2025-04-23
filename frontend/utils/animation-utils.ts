export type AnimationType = "fade" | "slide" | "zoom" | "none"

// 移除所有 toast 提示消息
export function applyPageAnimation(animation: AnimationType) {
  // 移除所有页面过渡类
  const mainContent = document.querySelector("main")
  if (mainContent) {
    mainContent.classList.remove("fade-animation", "slide-animation", "zoom-animation", "no-animation")

    // 根据动画类型添加相应的类
    if (animation === "fade") {
      mainContent.classList.add("fade-animation")
    } else if (animation === "slide") {
      mainContent.classList.add("slide-animation")
    } else if (animation === "zoom") {
      mainContent.classList.add("zoom-animation")
    } else {
      mainContent.classList.add("no-animation")
    }
  }

  // 将动画类型应用于页面
  document.documentElement.setAttribute("data-animation", animation)
}

// 触发页面过渡动画
export function triggerPageTransition() {
  const mainContent = document.querySelector("main")
  if (!mainContent) return

  const animation = document.documentElement.getAttribute("data-animation") || "none"
  if (animation === "none") return

  // 添加淡出类
  mainContent.classList.add("page-transition-exit")

  // 触发重绘
  void mainContent.offsetWidth

  // 添加淡出动画类
  mainContent.classList.add("page-transition-exit-active")

  // 延迟后移除淡出类，添加淡入类
  setTimeout(() => {
    mainContent.classList.remove("page-transition-exit", "page-transition-exit-active")
    mainContent.classList.add("page-transition-enter")

    // 触发重绘
    void mainContent.offsetWidth

    // 添加淡入动画类
    mainContent.classList.add("page-transition-enter-active")

    // 动画结束后清除类
    setTimeout(() => {
      mainContent.classList.remove("page-transition-enter", "page-transition-enter-active")
    }, 300)
  }, 300)
}

// 设置页面动画
export function setupPageAnimations() {
  // 添加页面动画样式
  if (!document.getElementById("animation-styles")) {
    const styleEl = document.createElement("style")
    styleEl.id = "animation-styles"
    styleEl.textContent = `
      .fade-animation {
        transition: opacity 0.3s ease-in-out;
      }
      
      .slide-animation {
        transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      }
      
      .zoom-animation {
        transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      }
      
      .page-transition-enter {
        opacity: 0;
      }
      
      .page-transition-enter-active {
        opacity: 1;
      }
      
      .page-transition-exit {
        opacity: 1;
      }
      
      .page-transition-exit-active {
        opacity: 0;
      }
      
      .slide-animation.page-transition-enter {
        transform: translateX(20px);
      }
      
      .slide-animation.page-transition-enter-active {
        transform: translateX(0);
      }
      
      .slide-animation.page-transition-exit-active {
        transform: translateX(-20px);
      }
      
      .zoom-animation.page-transition-enter {
        transform: scale(0.95);
      }
      
      .zoom-animation.page-transition-enter-active {
        transform: scale(1);
      }
      
      .zoom-animation.page-transition-exit-active {
        transform: scale(1.05);
      }
    `
    document.head.appendChild(styleEl)
  }
}

