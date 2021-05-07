const { sanitizeEntity } = require('strapi-utils');
const _ = require('lodash')

module.exports = {
    async findSlug(ctx) {
        const { slug } = ctx.params;

        const entity = await strapi.services.section.findOne({ slug });
        return sanitizeEntity(entity, { model: strapi.models.section });
    },
    async findWithManufacturers() {
        const sections = (await strapi.connections.default.raw(`SELECT s.id, s.name, s.slug, m.name as m_name, m.slug as m_slug, m.id as m_id FROM sections s LEFT JOIN categories c ON c.section = s.id LEFT JOIN subcategories sc ON sc.category = c.id LEFT JOIN products p ON p.subcategory = sc.id LEFT JOIN manufacturers m ON p.manufacturer = m.id`))[0] || []

        const sectionsWithManufacturers = []

        sections.forEach(section => {
            if (!_.find(sectionsWithManufacturers, swm => swm.id === section.id)) sectionsWithManufacturers.push({ id: section.id, name: section.name, slug: section.slug, manufacturers: [] })

            if (!section.m_id) return

            const idx = _.findIndex(sectionsWithManufacturers, swm => swm.id === section.id)

            if (_.find(sectionsWithManufacturers[idx].manufacturers, m => m.id === section.m_id)) return

            sectionsWithManufacturers[idx].manufacturers.push({
                id: section.m_id,
                name: section.m_name,
                slug: section.m_slug
            })
        })

        return sectionsWithManufacturers;
    }
};