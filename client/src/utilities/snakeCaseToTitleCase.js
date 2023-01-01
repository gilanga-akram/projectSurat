export const formatSnakeCaseToTitleCase = (string) => {
    if (!string) return '';
    return string.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());
 }