const parseDomain = require("parse-domain");

const domains = {
  "101cookbooks": require("./101cookbooks"),
  alexandracooks: require("./alexandracooks"),
  allrecipes: require("./allrecipes"),
  ambitiouskitchen: require("./ambitiouskitchen"),
  archanaskitchen: require("./archanaskitchen"),
  averiecooks: require("./averiecooks"),
  bbc: require("./bbc"),
  bbcgoodfood: require("./bbcgoodfood"),
  bonappetit: require("./bonappetit"),
  budgetbytes: require("./budgetbytes"),
  centraltexasfoodbank: require("./centraltexasfoodbank"),
  closetcooking: require("./closetcooking"),
  cookieandkate: require("./cookieandkate"),
  copykat: require("./copykat"),
  damndelicious: require("./damndelicious"),
  eatingwell: require("./eatingwell"),
  epicurious: require("./epicurious"),
  finecooking: require("./finecooking"),
  food: require("./food"),
  foodandwine: require("./foodandwine"),
  foodnetwork: require("./foodnetwork"),
  gimmesomeoven: require("./gimmesomeoven"),
  kitchenstories: require("./kitchenstories"),
  maangchi: require("./maangchi"),
  minimalistbaker: require("./minimalistbaker"),
  myrecipes: require("./myrecipes"),
  nigella: require("./nigella"),
  nomnompaleo: require("./nomnompaleo"),
  omnivorescookbook: require("./omnivorescookbook"),
  saveur: require("./saveur"),
  seriouseats: require("./seriouseats"),
  simplyrecipes: require("./simplyrecipes"),
  smittenkitchen: require("./smittenkitchen"),
  tastecooking: require("./tastecooking"),
  thepioneerwoman: require("./thepioneerwoman"),
  therealfoodrds: require("./therealfoodrds"),
  thespruceeats: require("./thespruceeats"),
  thewoksoflife: require("./thewoksoflife"),
  vegrecipesofindia: require("./vegrecipesofindia"),
  whatsgabycooking: require("./whatsgabycooking"),
  woolworths: require("./woolworths"),
  yummly: require("./yummly")
};

const defaultDomain = require("./defaultDomain")

const recipeScraper = url => {
  return new Promise((resolve, reject) => {
    let parse = parseDomain(url);
    if (parse) {
      let domain = parse.domain;
      if (domains[domain] !== undefined) {
        resolve(domains[domain](url));
        
      } else {
        resolve(defaultDomain(url));      }
    } else {
      reject(new Error("Failed to parse domain"));
    }
  });
};

module.exports = recipeScraper;
