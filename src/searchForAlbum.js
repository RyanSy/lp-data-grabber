import { searchForAlbum, searchForCoverArt } from "./modules/musicbrainz.js";
import writeCSV from "write-csv";
import { wantlist } from "./lists/wantlist.js";
const products = [];
const date = new Date().toISOString();
const query = 'pete-rock-return-of-the-sp1200';
console.log('\n');

const album = await searchForAlbum(query).then(data => data);
const id = album.id;
const title = album.title;
const artist = album['artist-credit'][0].name;
const type = album['release-group']['primary-type'];
const releaseDate = album.date;
const catalogNumber = album['label-info'][0]['catalog-number'];
const label = album['label-info'][0].label.name;
const image = await searchForCoverArt(id).then(data => data);

// build Discogs module to get genres, tags etc.

// Format product to save to Shopify csv template.
const product = {
    'Handle': '',
    'Title': `${artist} - ${title}`,
    'Body (HTML)': '',
    'Vendor': 'Village Record Club',
    'Product Category': 'Media > Music & Sound Recordings > Records & LPs',
    'Type': type,
    'Tags': `${artist}`,
    'Published': '',
    'Option1 Name': '',
    'Option1 Value': '',
    'Option2 Name': '',
    'Option2 Value': '',
    'Option3 Name': '',
    'Option3 Value': '',
    'Variant SKU': '',
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
    'Image Alt Text': `${artist} - ${title}`,
    'Gift Card': '',
    'SEO Title': `${artist} - ${title} | Village Record Club`,
    'SEO Description': `${title} by ${artist}`,
    'Google Shopping / Google Product Category': '543523',
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

// Write products to csv file.
try {
    console.log('Writing to .csv file...');
    writeCSV(`./src/csv/albums-${date}.csv`, products);
} catch(err) {
    console.error('Error writing to .csv file:\n', err);
}