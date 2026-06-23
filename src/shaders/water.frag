uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;
uniform vec3 uSkyColor;
uniform vec3 uWaterColor;

varying vec2 vUv;
varying vec3 vPosition;

float wave(vec2 p, float t) {
  float d1 = sin(p.x * 8.0 + t * 1.2) * 0.02;
  float d2 = sin(p.y * 12.0 + t * 0.8 + p.x * 3.0) * 0.015;
  float d3 = sin((p.x + p.y) * 6.0 + t * 0.5) * 0.01;
  return d1 + d2 + d3;
}

float ripple(vec2 p, vec2 center, float t) {
  float d = distance(p, center);
  float r = sin(d * 30.0 - t * 4.0) * exp(-d * 3.0) * 0.5;
  return r;
}

void main() {
  vec2 uv = vUv;
  float w = wave(uv, uTime);
  w += ripple(uv, uMouse, uTime) * uIntensity;

  vec3 base = mix(uWaterColor, vec3(1.0), 0.1);
  vec3 highlight = uSkyColor * 0.6;
  vec3 color = mix(base, highlight, w * 0.5 + 0.3);

  float spec = pow(max(0.0, w + 0.3), 4.0) * 0.3;
  color += vec3(spec * 0.8, spec * 0.9, spec);

  gl_FragColor = vec4(color, 0.7);
}
