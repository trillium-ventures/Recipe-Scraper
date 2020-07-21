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

                if (Recipe.ingredients.length === 0) {
                    Recipe.defaultFlag = true;
                }
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
