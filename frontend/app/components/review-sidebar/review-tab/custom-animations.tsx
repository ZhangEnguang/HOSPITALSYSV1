"use client"

export function CustomAnimations() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
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
          transform: translateY(10px);
        }
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out forwards;
      }

      .animate-fadeInUp {
        animation: fadeInUp 0.3s ease-in-out forwards;
      }

      .animate-fadeOutDown {
        animation: fadeOutDown 0.3s ease-in-out forwards;
      }

      .animate-slideInRight {
        animation: slideInRight 0.3s ease-in-out forwards;
      }
    `}</style>
  )
}
