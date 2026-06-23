uniform float uTime;
uniform vec3 uColor;
uniform float uNight;

varying vec2 vUv;
varying float vHeight;

void main() {
  float alpha = smoothstep(0.0, 0.3, vHeight);
  vec3 color = uColor;
  if (uNight > 0.5) {
    color = mix(uColor, vec3(0.05, 0.05, 0.15), 0.6);
  }
  float tip = smoothstep(0.7, 1.0, vHeight);
  color += tip * vec3(0.05, 0.03, 0.0);

  gl_FragColor = vec4(color, alpha);
}
