'use strict';

const { isNumber } = require('lodash');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const _ = require('lodash')

module.exports = {
    async count(ctx) {
        const { query } = ctx

        let manufacturers = []
        if (query.manufacturer) {
            manufacturers = query.manufacturer.split(',').map(n => parseInt(n)).filter(n => isNumber(n))
        }

        let subs = []
        if (query.subcategory) {
            subs = query.subcategory.split(',').map(n => parseInt(n)).filter(n => isNumber(n))
        }

        const q = [
            !query.category || `s.category = '${query.category}'`,
            !query.manfacturer || `p.manufacturer IN (${manufacturers.join(',')})`,
            !query.subcategory || `p.subcategory IN (${subs.join(',')})`,
            `p.name LIKE '%${query._q || ""}%'`
        ].filter(v => typeof v === 'string').join(' AND ')

        const count = await strapi.connections.default.raw(`SELECT COUNT(p.id) as count FROM products p LEFT JOIN subcategories s ON p.subcategory = s.id WHERE ${q}`)
        return count[0][0] ? count[0][0].count : 0
    }
};
