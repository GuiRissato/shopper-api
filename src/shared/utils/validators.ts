export function validateBase64(base64String: string): boolean {
    const base64Regex = /^data:image\/(jpeg|png|gif|bmp);base64,[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(base64String);
  }

export function getCurrentMonth(dateString: string): number {
    const date = new Date(dateString);
    return date.getMonth() + 1;
  }
  