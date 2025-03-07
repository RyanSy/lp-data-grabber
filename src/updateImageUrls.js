import { getToken, searchForAlbum } from './modules/spotify.js';
import * as fs from 'node:fs';
import { createObjectCsvWriter } from 'csv-writer';
import csv from 'csv-parser';
const inputCsvJson = [];
let modifiedCsvJson = [];
console.log('\n');

/**
 * Global config.
 */
const config = {
//   inputFile: './src/csv/test-old.csv', // old file (TESTING)
//   outputFile: './src/csv/test-new.csv', // updated file (TESTING)
  inputFile: './src/csv/products-that-need-new-images.csv', // old file
  outputFile: './src/csv/products-with-updated-images.csv', // updated file
  rejectsFile: './src/csv/rejects.csv' // albums not found
};

const productHeader = [
    {id: 'Handle', title: 'Handle'},
    {id: 'Title', title: 'Title'},
    {id: 'Body (HTML)', title: 'Body (HTML)'},
    {id: 'Vendor', title: 'Vendor'},
    {id: 'Product Category', title: 'Product Category'},
    {id: 'Type', title: 'Type'},
    {id: 'Tags', title: 'Tags'},
    {id: 'Published', title: 'Published'},
    {id: 'Option1 Name', title: 'Option1 Name'},
    {id: 'Option1 Value', title: 'Option1 Value'},
    {id: 'Option2 Name', title: 'Option2 Name'},
    {id: 'Option2 Value', title: 'Option2 Value'},
    {id: 'Option3 Name', title: 'Option3 Name'},
    {id: 'Option3 Value', title: 'Option3 Value'},
    {id: 'Variant SKU', title: 'Variant SKU'},
    {id: 'Variant Grams', title: 'Variant Grams'},
    {id: 'Variant Inventory Tracker', title: 'Variant Inventory Tracker'},
    {id: 'Variant Inventory Qty', title: 'Variant Inventory Qty'},
    {id: 'Variant Inventory Policy', title: 'Variant Inventory Policy'},
    {id: 'Variant Fulfillment Service', title: 'Variant Fulfillment Service'},
    {id: 'Variant Price', title: 'Variant Price'},
    {id: 'Variant Compare At Price', title: 'Variant Compare At Price'},
    {id: 'Variant Requires Shipping', title: 'Variant Requires Shipping'},
    {id: 'Variant Taxable', title: 'Variant Taxable'},
    {id: 'Variant Barcode', title: 'Variant Barcode'},
    {id: 'Image Src', title: 'Image Src'},
    {id: 'Image Position', title: 'Image Position'},
    {id: 'Image Alt Text', title: 'Image Alt Text'},
    {id: 'Gift Card', title: 'Gift Card'},
    {id: 'SEO Title', title: 'SEO Title'},
    {id: 'SEO Description', title: 'SEO Description'},
    {id: 'Google Shopping / Google Product Category', title: 'Google Shopping / Google Product Category'},
    {id: 'Google Shopping / Gender', title: 'Google Shopping / Gender'},
    {id: 'Google Shopping / Age Group', title: 'Google Shopping / Age Group'},
    {id: 'Google Shopping / MPN', title: 'Google Shopping / MPN'},
    {id: 'Google Shopping / AdWords Grouping', title: 'Google Shopping / AdWords Grouping'},
    {id: 'Google Shopping / AdWords Labels', title: 'Google Shopping / AdWords Labels'},
    {id: 'Google Shopping / Condition', title: 'Google Shopping / Condition'},
    {id: 'Google Shopping / Custom Product', title: 'Google Shopping / Custom Product'},
    {id: 'Google Shopping / Custom Label 0', title: 'Google Shopping / Custom Label 0'},
    {id: 'Google Shopping / Custom Label 1', title: 'Google Shopping / Custom Label 1'},
    {id: 'Google Shopping / Custom Label 2', title: 'Google Shopping / Custom Label 2'},
    {id: 'Google Shopping / Custom Label 3', title: 'Google Shopping / Custom Label 3'},
    {id: 'Google Shopping / Custom Label 4', title: 'Google Shopping / Custom Label 4'},
    {id: 'Variant Image', title: 'Variant Image'},
    {id: 'Variant Weight Unit', title: 'Variant Weight Unit'},
    {id: 'Variant Tax Code', title: 'Variant Tax Code'},
    {id: 'Cost per item', title: 'Cost per item'},
    {id: 'Price / International', title: 'Price / International'},
    {id: 'Compare At Price / International', title: 'Compare At Price / International'},
    {id: 'Status', title: 'Status'}
];

const productCsvWriter = createObjectCsvWriter({
    path: config.outputFile,
    header: productHeader
});

const rejectsCsvWriter = createObjectCsvWriter({
    path: config.rejectsFile,
    header: productHeader
});

/**
 * Initialize script.
 */
function init() {
    console.log('Initiating...');
    console.log(`Preparing to parse CSV file... ${config.inputFile}...`);
  
    fs.createReadStream(config.inputFile)
      .pipe(csv())
      .on('data', (data) => inputCsvJson.push(data))
      .on('end', () => {
        modifiedCsvJson = inputCsvJson;
        initFunctions();
      });
}

/**
 * Execute functions once data is available.
 */
async function initFunctions() {
    console.log('Initiating script...');
    let index = 0;
    let updatedItems = [];
    let rejects = [];

    const intervalId = setInterval(async () => {
            const album = modifiedCsvJson[index]['Title'];
            const url = await updateImageUrl(album);
            const item = modifiedCsvJson[index];
            const itemKey = 'Image Src';
            
            if (url != null) {
                item[itemKey] = url;
            } else {
                item[itemKey] = '';
                rejects.push(item)
                console.log(`"${album}" saved to rejects list.`);
            }

            updatedItems.push(item);
            console.log(`"${album}" saved to updated items.`);

            index++;

            if (index === modifiedCsvJson.length) {
                await productCsvWriter.writeRecords(updatedItems)
                    .then(() => {
                        console.log(`${config.outputFile} updated successfully.`);
                    })
                    .catch(err => {
                        console.error(`Error updating ${config.outputFile}: ${err}`);
                    });

                await rejectsCsvWriter.writeRecords(rejects)
                    .then(() => {
                        console.log(`${config.rejectsFile} updated successfully.`);
                    })
                    .catch(err => {
                        console.error(`Error updating ${config.rejectsFile}: ${err}`);
                    })

                clearInterval(intervalId);

                console.log('Done.')
            }
        }, 1000);

}

/**
 * Search Spotify API for new image url and update product csv file.
 */
async function updateImageUrl(album) {    
    try {
        const token = await getToken().then(data => data.access_token);
        const coverArtUrl = await searchForAlbum(token, album).then(data => data.albums.items[0].images[0].url);
        console.log(`Image url found for "${album}".`)
        return coverArtUrl;
    } catch (err) {
        console.error(`Error updating image url for "${album}": ${err}`);
        return null;
    }
}

init();