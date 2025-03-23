export default function getGradient(ctx, chartArea, colors) {
  let width, height, gradient;

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (!gradient || width !== chartWidth || height !== chartHeight) {
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
  }

  return gradient;
}
