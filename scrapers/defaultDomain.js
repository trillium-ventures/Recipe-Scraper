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

                // check if it is a tasty recipes plug in, and follow structure if yes.
               
                if ($('.tasty-recipes').length > 0) {
                    $(".tasty-recipes-ingredients")
                    .find("li")
                    .each((i, el) => {
                      Recipe.ingredients.push($(el).text());
                    });

                    if (Recipe.ingredients.length == 0) {
                        $(".tasty-recipe-ingredients")
                        .find("li")
                        .each((i, el) => {
                          Recipe.ingredients.push($(el).text());
                        });
                    }

                    $(".tasty-recipes-instructions")
                    .find("li")
                    .each((i, el) => {
                      Recipe.instructions.push($(el).text());
                    });

                    if (Recipe.instructions.length == 0) {
                        $(".tasty-recipe-instructions")
                        .find("li")
                        .each((i, el) => {
                          Recipe.instructions.push($(el).text());
                        });
                    }
        
                  Recipe.time.prep = $(".tasty-recipes-prep-time").text();
                  Recipe.time.cook = $(".tasty-recipes-cook-time").text();
                  Recipe.time.total = $(".tasty-recipes-total-time").text();
        
                  $(".tasty-recipes-yield-scale").remove();
                  Recipe.servings = $(".tasty-recipes-yield")
                    .text()
                    .trim();
                }

                else if ($('.wprm-recipe').length > 0) {
                    if (!Recipe.name) {
                        Recipe.name = $(".wprm-recipe-name").text();
                    }

                    $(".wprm-recipe-ingredient-group").each((i, el) => {
                        $(el)
                        .find(".wprm-recipe-ingredient")
                        .each((i, el) => {
                            Recipe.ingredients.push(
                            $(el)
                                .text()
                                .replace(/\s\s+/g, " ")
                                .trim()
                            );
                        });
                    });

                    $(".wprm-recipe-instruction-group").each((i, el) => {
                        Recipe.instructions.push(
                        $(el)
                            .children(".wprm-recipe-group-name")
                            .text()
                        );
                        $(el)
                        .find(".wprm-recipe-instruction-text")
                        .each((i, elChild) => {
                            Recipe.instructions.push($(elChild).text());
                        });
                    });

                    $(".wprm-recipe-time-container").each((i, el) => {
                        let label = $(el)
                        .children(".wprm-recipe-time-label")
                        .text();

                        if (!label) {
                            label = $(el).
                            children("wprm-recipe-time-header")
                            .text();
                        }
                        let time = $(el)
                        .children(".wprm-recipe-time")
                        .text();
                        if (label.includes("Prep")) {
                        Recipe.time.prep = time;
                        } else if (label.includes("Cook")) {
                        Recipe.time.cook = time;
                        } else if (label.includes("Resting")) {
                        Recipe.time.inactive = time;
                        } else if (label.includes("Total")) {
                        Recipe.time.total = time;
                        }
                    });

                    Recipe.servings = $(".wprm-recipe-servings").text().trim();
                    if(!Recipe.servings) {
                        Recipe.servings = $(".wprm-recipe-servings-with-unit")
                        .text()
                        .trim();
                    }
                }

                if (Recipe.ingredients.length === 0) {
                    Recipe.ingredients = []
                    Recipe.defaultFlag = true;
                }

                if(!Recipe.name) {
                    Recipe.name = ""
                }

                if (!Recipe.image) {
                    Recipe.image = ""
                }

                resolve(Recipe);
                // }
            } else {
                console.log("SERVER RESPONSE: ", response.statusCode)
                reject(new Error("Server error"));
            }
        });
    });
};

module.exports = defaultDomain;
