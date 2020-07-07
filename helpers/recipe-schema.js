function Recipe() {
  this.name = "";
  this.defaultFlag = false;
  this.ingredients = [];
  this.instructions = [];
  this.time = {
    prep: "",
    cook: "",
    active: "",
    inactive: "",
    ready: "",
    total: ""
  };
  this.servings = "";
  this.image = "";
}

module.exports = Recipe;
