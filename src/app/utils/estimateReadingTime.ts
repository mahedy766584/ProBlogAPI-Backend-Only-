export const estimateReadingTime = (text: string): number => {
    const wordPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordPerMinute);
    return minutes;
};