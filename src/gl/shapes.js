export const TOOL_SHAPES = `
float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a;
  vec3 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float sdTorus(vec3 p, vec2 t) { return length(vec2(length(p.xz) - t.x, p.y)) - t.y; }
float sdCylinder(vec3 p, float h, float r) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec2 server(vec3 p) {
  float d = 1e5;
  float led = 1e5;
  for (int i = 0; i < 3; i++) {
    float y = (float(i) - 1.0) * 0.56;
    d = min(d, sdRoundBox(p - vec3(0.0, y, 0.0), vec3(0.95, 0.23, 0.6), 0.07));
    led = min(led, sdSphere(p - vec3(0.66, y, 0.58), 0.055));
    led = min(led, sdSphere(p - vec3(0.48, y, 0.58), 0.055));
    d = max(d, -sdRoundBox(p - vec3(-0.3, y, 0.62), vec3(0.42, 0.035, 0.06), 0.02));
  }
  return led < d ? vec2(led, 1.0) : vec2(d, 0.0);
}

vec2 browser(vec3 p) {
  float body = sdRoundBox(p, vec3(1.05, 0.76, 0.1), 0.08);
  body = max(body, -sdRoundBox(p - vec3(0.0, -0.09, 0.12), vec3(0.95, 0.58, 0.05), 0.03));
  float content = sdRoundBox(p - vec3(-0.33, 0.06, 0.07), vec3(0.42, 0.24, 0.02), 0.02);
  float side = sdRoundBox(p - vec3(0.55, -0.18, 0.07), vec3(0.28, 0.32, 0.02), 0.02);
  float dots = 1e5;
  for (int i = 0; i < 3; i++) dots = min(dots, sdSphere(p - vec3(-0.88 + float(i) * 0.15, 0.62, 0.1), 0.045));
  float d = min(body, min(content, side));
  return dots < d ? vec2(dots, 1.0) : vec2(d, 0.0);
}

vec2 controller(vec3 p) {
  float body = sdRoundBox(p - vec3(0.0, 0.08, 0.0), vec3(0.72, 0.32, 0.22), 0.2);
  float grips = min(sdCapsule(p, vec3(-0.6, 0.0, 0.0), vec3(-0.8, -0.5, 0.0), 0.27), sdCapsule(p, vec3(0.6, 0.0, 0.0), vec3(0.8, -0.5, 0.0), 0.27));
  float d = smin(body, grips, 0.16);
  float pad = min(sdRoundBox(p - vec3(-0.5, 0.12, 0.27), vec3(0.17, 0.05, 0.06), 0.02), sdRoundBox(p - vec3(-0.5, 0.12, 0.27), vec3(0.05, 0.17, 0.06), 0.02));
  float b = sdSphere(p - vec3(0.52, 0.26, 0.27), 0.065);
  b = min(b, sdSphere(p - vec3(0.52, -0.02, 0.27), 0.065));
  b = min(b, sdSphere(p - vec3(0.38, 0.12, 0.27), 0.065));
  b = min(b, sdSphere(p - vec3(0.66, 0.12, 0.27), 0.065));
  d = min(d, pad);
  return b < d ? vec2(b, 1.0) : vec2(d, 0.0);
}

vec2 app(vec3 p) {
  float tile = sdRoundBox(p, vec3(0.8, 0.8, 0.14), 0.32);
  float ring = sdTorus((p - vec3(0.0, 0.0, 0.15)).xzy, vec2(0.36, 0.075));
  float bump = sdSphere(p - vec3(0.0, 0.0, 0.12), 0.12);
  float glow = min(ring, bump);
  return glow < tile ? vec2(glow, 1.0) : vec2(tile, 0.0);
}

vec2 wrench(vec3 p) {
  vec3 w = vec3(0.7071 * (p.x + p.y), 0.7071 * (p.y - p.x), p.z);
  float handle = sdRoundBox(w - vec3(0.0, -0.2, 0.0), vec3(0.15, 0.72, 0.07), 0.06);
  vec3 h = w - vec3(0.0, 0.66, 0.0);
  float head = sdCylinder(h.xzy, 0.08, 0.38);
  head = max(head, -sdRoundBox(h - vec3(0.0, 0.28, 0.0), vec3(0.15, 0.32, 0.3), 0.02));
  vec3 t = w - vec3(0.0, -1.0, 0.0);
  float ring = max(sdCylinder(t.xzy, 0.07, 0.28), -sdCylinder(t.xzy, 0.2, 0.15));
  float d = min(min(handle, head), ring);
  float bolt = sdCylinder(t.xzy, 0.04, 0.09);
  return bolt < d ? vec2(bolt, 1.0) : vec2(d, 0.0);
}

vec2 shape(float k, vec3 p) {
  if (k < 0.5) return server(p);
  if (k < 1.5) return browser(p);
  if (k < 2.5) return controller(p);
  if (k < 3.5) return app(p);
  return wrench(p);
}
`
