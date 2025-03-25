export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function convertBase64ToImage(base64: string): HTMLImageElement {
  const img = new Image();
  img.src = base64;
  return img;
}