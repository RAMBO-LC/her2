export function detectPerformance() {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  let lowPower = false
  if ('getBattery' in navigator) {
    navigator.getBattery().then(b => { lowPower = b.level < 0.2 && !b.charging })
  }
  return { isMobile, lowPower, isLowEnd: isMobile || lowPower }
}

export function getGrassCount() {
  const { isMobile } = detectPerformance()
  return isMobile ? 300 : 800
}

export function getFireflyCount() {
  const { isMobile } = detectPerformance()
  return isMobile ? 18 : 30
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

export function easeInOut(t) {
  return t * t * (3 - 2 * t)
}
