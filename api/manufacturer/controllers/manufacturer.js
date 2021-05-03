const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async findSlug(ctx) {
        const { slug } = ctx.params;

        const entity = await strapi.services.manufacturer.findOne({ slug });
        return sanitizeEntity(entity, { model: strapi.models.manufacturer });
    },
};