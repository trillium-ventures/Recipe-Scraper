const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const defaultDomain = url => {
    const Recipe = new RecipeSchema();
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);

                Recipe.image = $("meta[property='og:image']").attr("content");
                if (!Recipe.image) {
                    Recipe.image = "";
                }
                Recipe.name = $("meta[property='og:title']").attr("content");
                if (!Recipe.name) {
                    Recipe.name = $("meta[name='description']").attr("content");
                }
                if (!Recipe.name) {
                    Recipe.name = $(".wprm-recipe-name").text();
                }

                if (!Recipe.name) {
                    Recipe.name = "";
                }

                $(".wprm-recipe-ingredient").each(function(i, el){
                    console.log("FOUND A RECIPE INGREDIENT: ")
                    console.log()
                    Recipe.ingredients.push(
                        $(el)
                          .text()
                          .replace(/\s\s+/g, " ")
                          .trim()
                      );
                })
                // if (!Recipe.ingredients) {
                //     Recipe.ingredients = [];
                // }

                $(".wprm-recipe-instruction-text").each(function(i, el){
                    Recipe.instructions.push($(el).text());
                })
                // if (!Recipe.instructions) {
                //     Recipe.instructions = [];
                // }

                Recipe.defaultFlag = true;
                Recipe.time = "";
                Recipe.servings = "";

                resolve(Recipe);
                // }
            } else {
                console.log("SERVER RESPONSE: ", response.statusCode)
                reject(new Error("No recipe found on page"));
            }
        });
    });
};

module.exports = defaultDomain;
