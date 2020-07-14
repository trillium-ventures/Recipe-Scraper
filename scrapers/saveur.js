const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("daena-recipe-scraper/helpers/recipe-schema");

const saveur = url => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("saveur.com/")) {
      reject(new Error("url provided must include 'saveur.com/'"));
    } else {
      request(url, (error, response, html) => {
        if (!error && response.statusCode === 200) {
          const $ = cheerio.load(html);

          Recipe.image = $("meta[property='og:image']").attr("content");
          Recipe.name = $("meta[property='og:title']").attr("content");

          $(".ingredient")
            .find("h4, li")
            .each((i, el) => {
              Recipe.ingredients.push($(el).text());
            });

          // $(".tasty-recipe-instructions")
          //   .find("li")
          //   .each((i, el) => {
          //     Recipe.instructions.push($(el).text());
          //   });

          // Recipe.time.prep = $(".tasty-recipes-prep-time").text();
          // Recipe.time.cook = $(".tasty-recipes-cook-time").text();
          // Recipe.time.total = $(".tasty-recipes-total-time").text();

          // $(".tasty-recipes-yield-scale").remove();
          // Recipe.servings = $(".tasty-recipes-yield")
          //   .text()
          //   .trim();

          if (
            !Recipe.name
            // !Recipe.ingredients.length ||
            // !Recipe.instructions.length
          ) {
            reject(new Error("No recipe found on page"));
          } else {
            resolve(Recipe);
          }
        } else {
          console.log("HERE IS ERROR: ", response)
          reject(new Error("error: ", response.code));
        }
      });
    }
  });
};

module.exports = saveur;
