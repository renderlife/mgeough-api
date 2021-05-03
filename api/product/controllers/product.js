'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const _ = require('lodash')

module.exports = {
    async count(ctx) {
        const { query } = ctx

        const count = await strapi.connections.default.raw(`SELECT COUNT(p.id) as count FROM products p LEFT JOIN subcategories s ON p.subcategory = s.id WHERE ${query.category ? "s.category = '" + query.category + "'" : ''} ${query.manufacturer ? (query.category ? 'AND' : '') + " p.manufacturer IN (" + query.manufacturer + ")" : ''} ${query.subcategory ? (query.manufacturer ? 'AND' : '') + " p.subcategory IN (" + query.subcategory + ")" : ''} ${query.manufacturer || query.category || query.subcategory ? 'AND' : ''} p.name LIKE '%${query._q || ""}%'`)
        return count[0][0] ? count[0][0].count : 0
    }
};
