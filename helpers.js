var register = function(Handlebars) {
    Handlebars.registerHelper('json', function(content) {
        return JSON.stringify(content);
    });

};

module.exports.register = register;
module.exports.helpers = register(null);