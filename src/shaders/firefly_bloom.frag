uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float dist = distance(vUv, vec2(0.5));
  float glow = exp(-dist * dist * 20.0);
  float core = exp(-dist * dist * 100.0);
  float artifact = 1.0 - dist * 1.5;
  float grain = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
  artifact = clamp(artifact + grain * 0.02, 0.0, 1.0);
  vec3 color = uColor * (glow * 0.3 + core);
  float alpha = (glow * 0.5 + core * 0.3) * artifact;
  gl_FragColor = vec4(color, alpha);
}
