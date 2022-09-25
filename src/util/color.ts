import { color, rgb } from "d3";

const rgbLrgb1 = (v: number) => {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const rgbLrgb = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return [r / 255, g / 255, b / 255].map(rgbLrgb1);
};

const lrgbLuminance = ([r, g, b]: number[]) => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// From https://observablehq.com/@mbostock/wcag-contrast-ratio
export const contrast = (c1: string, c2: string): number => {
  const l1 = lrgbLuminance(rgbLrgb(rgb(c1)));
  const l2 = lrgbLuminance(rgbLrgb(rgb(c2)));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export const darkenToMinContrast = (
  c1: string,
  c2: string,
  minContrast: number
): string => {
  let resolvedColor = color(c1);

  if (!resolvedColor) {
    throw new Error(`unparseable color "${c1}"`);
  }

  while (contrast(resolvedColor.toString(), c2) < minContrast) {
    resolvedColor = resolvedColor.darker(0.1);
  }

  return resolvedColor.toString();
};
