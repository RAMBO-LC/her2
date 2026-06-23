uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uMidColor;
uniform vec3 uBotColor;
uniform float uNight;

varying vec2 vUv;

void main() {
  float gradient = vUv.y;
  vec3 color;
  if (gradient < 0.5) {
    float t = gradient / 0.5;
    color = mix(uBotColor, uMidColor, t);
  } else {
    float t = (gradient - 0.5) / 0.5;
    color = mix(uMidColor, uTopColor, t);
  }

  if (uNight > 0.5) {
    float horizonGlow = smoothstep(0.8, 0.4, gradient) * 0.15;
    color += horizonGlow * vec3(0.4, 0.3, 0.2);
  }

  gl_FragColor = vec4(color, 1.0);
}
