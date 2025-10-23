/**
 * Format price to IDR currency
 * @param {number} price - Price in raw number
 * @param {boolean} withSymbol - Include currency symbol (default: true)
 * @returns {string} Formatted price
 */
export const formatPrice = (price, withSymbol = true) => {
    // Handle invalid values (NaN, null, undefined, empty string)
    if (price === null || price === undefined || isNaN(price) || price === "") {
        return withSymbol ? "Rp0" : "0";
    }

    // Convert to number if it's a string
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    // Check again after conversion
    if (isNaN(numericPrice)) {
        return withSymbol ? "Rp0" : "0";
    }

    const formatter = new Intl.NumberFormat("id-ID", {
        style: withSymbol ? "currency" : "decimal",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(numericPrice);
};
