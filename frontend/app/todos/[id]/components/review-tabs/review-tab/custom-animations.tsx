export function CustomAnimations() {
  const customAnimations = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(5px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(5px);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulseHighlight {
  0% {
    background-color: rgba(59, 130, 246, 0.1);
  }
  50% {
    background-color: rgba(59, 130, 246, 0.2);
  }
  100% {
    background-color: rgba(59, 130, 246, 0.1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-fadeOut {
  animation: fadeOut 0.3s ease-out forwards;
}

.animate-fadeInUp {
  animation: fadeInUp 0.3s ease-out forwards;
}

.animate-fadeOutDown {
  animation: fadeOutDown 0.3s ease-out forwards;
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out forwards;
}

.animate-pulseHighlight {
  animation: pulseHighlight 1.5s infinite;
}

.transition-height {
  transition: height 0.3s ease-out;
}

.transition-opacity {
  transition: opacity 0.25s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fadeOutScale {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
}

.animate-fadeInScale {
  animation: fadeInScale 0.3s ease-out forwards;
}

.animate-fadeOutScale {
  animation: fadeOutScale 0.3s ease-out forwards;
}
`

  return <style>{customAnimations}</style>
}

