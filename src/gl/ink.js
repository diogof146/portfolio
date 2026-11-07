import { NOISE } from "@/gl/gl"
import { sharedRenderer } from "@/gl/shared"

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uP;
uniform vec2 uOrigin;
uniform float uTime;
uniform sampler2D uImg;
${NOISE}

vec3 duotone(float l) {
  vec3 shadow = vec3(0.03, 0.14, 0.24);
  vec3 mid = vec3(0.0, 0.62, 0.88);
  vec3 high = vec3(0.78, 0.95, 1.0);
  return l < 0.5 ? mix(shadow, mid, l * 2.0) : mix(mid, high, l * 2.0 - 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 q = uv * vec2(aspect, 1.0);
  vec2 o = uOrigin * vec2(aspect, 1.0);

  float reach = max(max(length(o), length(o - vec2(aspect, 0.0))), max(length(o - vec2(0.0, 1.0)), length(o - vec2(aspect, 1.0))));
  float n = fbm(q * 3.2 + uTime * 0.06);
  float field = length(q - o) / reach * 0.78 + n * 0.34;
  float front = uP * 1.3 - 0.12;
  float wet = smoothstep(front - 0.045, front + 0.045, field);
  float edge = 1.0 - smoothstep(0.0, 0.08, abs(field - front));

  vec2 dir = normalize(q - o + 0.0001);
  vec2 shift = dir * edge * 0.012 / vec2(aspect, 1.0);
  vec3 color = texture2D(uImg, uv - shift).rgb;
  vec3 print = duotone(dot(color, vec3(0.2126, 0.7152, 0.0722)));
  vec3 col = mix(color, print, wet);
  float glow = edge * smoothstep(0.0, 0.06, uP) * (1.0 - smoothstep(0.9, 1.0, uP));
  col += vec3(0.0, 0.5, 0.8) * glow * 0.55;
  gl_FragColor = vec4(col, 1.0);
}
`

export const inkPrint = sharedRenderer(FRAGMENT)
