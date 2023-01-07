export const formatSnakeCaseToTitleCase = (string) => {
    if (!string) return '';
    return string.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());
}

export const toTitleCase = (string) => {
    if (!string) return '';
    return string.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const titleToSnakeCase = (string) => {
    if (!string) return '';
    return string && string.match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(s => s.toLowerCase())
        .join('_');
}