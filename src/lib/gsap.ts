import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// SSR-safe plugin registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ScrollTrigger performance tuning
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

// Global tween defaults
gsap.defaults({
  ease: "power4.out",
  duration: 1.2,
});

// Re-measure triggers when images, fonts, and lazy content settle
window.addEventListener("load", () => ScrollTrigger.refresh());

// Re-measure after every client-side navigation (View Transitions)
document.addEventListener("astro:page-load", () => ScrollTrigger.refresh());

export { gsap, ScrollTrigger };
