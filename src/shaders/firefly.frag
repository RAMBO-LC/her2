uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float dist = distance(vUv, vec2(0.5));
  float glow = exp(-dist * dist * 30.0);
  float core = exp(-dist * dist * 200.0);
  vec3 color = uColor * (glow * 0.6 + core);
  float alpha = glow * 0.8 + core * 0.4;
  gl_FragColor = vec4(color, alpha);
}
