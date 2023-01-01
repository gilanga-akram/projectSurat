export const formatNumber = (data) => {
    if (!data) return '';
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
 }