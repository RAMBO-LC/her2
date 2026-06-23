uniform float uTime;
uniform float uWindStrength;
uniform float uGust;
uniform vec3 uColor;
uniform float uHeightScale;

varying vec2 vUv;
varying float vHeight;

void main() {
  vUv = uv;
  vec3 pos = position;

  float height = pos.y;
  vHeight = height;

  float windPhase = pos.x * 3.0 + uTime * 1.5 + pos.z * 2.0;
  float windDisp = sin(windPhase) * uWindStrength * height * 0.3;
  windDisp += sin(pos.x * 1.5 + uTime * 0.6 + uGust) * uGust * 0.5 * height * 0.4;

  pos.x += windDisp;
  pos.z += cos(windPhase * 0.7) * uWindStrength * height * 0.15;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
