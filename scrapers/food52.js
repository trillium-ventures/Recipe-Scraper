const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const food52 = url => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("food52.com/recipes")) {
      reject(new Error("url provided must include 'food52.com/recipes'"));
    } else {
      request(url, (error, response, html) => {
        if (!error && response.statusCode === 200) {
          const $ = cheerio.load(html);

          Recipe.image = $("meta[property='og:image']").attr("content");
          Recipe.name = $("meta[property='og:title']").attr("content");

          // $(".tasty-recipe-ingredients")
          //   .find("h4, li")
          //   .each((i, el) => {
          //     Recipe.ingredients.push($(el).text());
          //   });

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
            !Recipe.name ||
            !Recipe.image
          ) {
            reject(new Error("No recipe found on page"));
          } else {
            resolve(Recipe);
          }
        } else {
          console.log("HERE IS RESPONSE: ", response);
          reject(new Error("No recipe found on page"));
        }
      });
    }
  });
};

module.exports = food52;
