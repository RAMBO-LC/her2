uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uMidColor;
uniform vec3 uBotColor;
uniform float uNight;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
