export const generateCustomUUID = (...segments: number[]) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const generateSegment = (length: number) => {
        return Array.from({ length }, () => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    };

    const defaultSegments = [8, 5, 7];
    const segmentsToUse = segments.length > 0 ? segments : defaultSegments;
    return `${segmentsToUse.map(generateSegment).join('-')}`;
};