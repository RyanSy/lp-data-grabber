import writeCSV from 'write-csv';
import { getToken, getNewReleases } from './modules/spotify.js';
// import { product } from './modules/product.js';
const products = [];
const date = new Date().toISOString();

// Get Spotify access token.
const token = await getToken().then(data => data.access_token);

// Get new releases from Spotify API.
const newReleases = await getNewReleases(token).then(data => data.albums.items);

// For each new release, add data to Shopify product template and save to products array.
for (let i = 0; i < newReleases.length; i++) {
  if (newReleases[i].album_type !== 'single') {
    const response = await fetch(newReleases[i].href, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    });
    const album = await response.json();
    const artist = album.artists[0].name;
    const title = `${album.artists[0].name} - ${album.name}`;
    const genres = album.genres;
    const image = album.images[0].url;
    const upc = album.external_ids.upc;
    const albumType = album.album_type;

    // code below is pushing the last entry to the array only
    // let newRelease = product;
    // newRelease['Title'] = title;
    // newRelease['Tags'] = genres;
    // newRelease['Image Src'] = image;
    // newRelease['Variant SKU'] = upc;
    // newRelease['Type'] = albumType;
    // products.push(newRelease);

    const product = {
        'Handle': title,
        'Title': title,
        'Body (HTML)': '',
        'Vendor': 'Village Record Club',
        'Product Category': 'Media > Music & Sound Recordings > Records & LPs',
        'Type': albumType,
        'Tags': `${artist}, ${genres}`,
        'Published': '',
        'Option1 Name': '',
        'Option1 Value': '',
        'Option2 Name': '',
        'Option2 Value': '',
        'Option3 Name': '',
        'Option3 Value': '',
        'Variant SKU': upc,
        'Variant Grams': '',
        'Variant Inventory Tracker': '',
        'Variant Inventory Qty': '',
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': '',
        'Variant Compare At Price': '',
        'Variant Requires Shipping': '',
        'Variant Taxable': '',
        'Variant Barcode': '',
        'Image Src': image,
        'Image Position': '',
        'Image Alt Text': '',
        'Gift Card': '',
        'SEO Title': '',
        'SEO Description': '',
        'Google Shopping / Google Product Category': '',
        'Google Shopping / Gender': '',
        'Google Shopping / Age Group': '',
        'Google Shopping / MPN': '',
        'Google Shopping / AdWords Grouping': '',
        'Google Shopping / AdWords Labels': '',
        'Google Shopping / Condition': '',
        'Google Shopping / Custom Product': '',
        'Google Shopping / Custom Label 0': '',
        'Google Shopping / Custom Label 1': '',
        'Google Shopping / Custom Label 2': '',
        'Google Shopping / Custom Label 3': '',
        'Google Shopping / Custom Label 4': '',
        'Variant Image': '',
        'Variant Weight Unit': '',
        'Variant Tax Code': '',
        'Cost per item': '',
        'Price / International': '',
        'Compare At Price / International': '',
        'Status': 'Active',
    };
    products.push(product);
  }
}

// Write products to csv file.
try {
  console.log('Writing to .csv file...');
  writeCSV(`./src/csv/new-releases-${date}.csv`, products);
} catch(err) {
  console.error('Error writing to .csv file:\n', err);
}
