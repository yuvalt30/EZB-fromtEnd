export function getNewColor() {
  let color = "#";
  const letters = "0123456789ABCDEF";

  for (let i = 0; i < 6; i++) {
    color = color + letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
