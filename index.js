const axios = require("axios");
const JSON5 = require("json5");
const fs = require("fs");

async function ksl({ keyword }) {
  return await axios
    .get(
      `https://www.ksl.com/classifieds/search?category[]=&subCategory[]=&keyword=${keyword ||
        ""}&priceFrom=&priceTo=&zip=&miles=25&sellerType[]=&marketType[]=Sale&hasPhotos[]=&postedTimeFQ[]=`
    )
    .then(({ data }) => parse(data))
    .catch(console.error);
}

function parse(html) {
  // Get the datas
  const beginning = html.indexOf("window.renderSearchSection(") + 27;
  let chunk = html.substr(beginning);
  const end = chunk.indexOf(")</script>");
  const j = html.substr(beginning, end);

  // Only return relevant stuffs
  let l = JSON5.parse(j).listings;
  let listings = [];

  l.forEach(listing => {
    if (!listing.standardFeaturedAd) {
      listing.url = "https://www.ksl.com/classifieds/listing/" + listing.id;
      listings.push(listing);
    }
  });

  return listings;
}

module.exports = {
  ksl
};
