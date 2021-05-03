const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async findSlug(ctx) {
        const { slug } = ctx.params;

        const entity = await strapi.services.section.findOne({ slug });
        return sanitizeEntity(entity, { model: strapi.models.section });
    },
};