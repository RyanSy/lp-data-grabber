import { getToken, searchForAlbum, getArtist } from "./modules/spotify.js";
import writeCSV from "write-csv";
import { wantlist } from "./lists/wantlist.js";
const products = [];
const date = new Date().toISOString();
console.log('\n');

// Get Spotify access token.
const token = await getToken().then(data => data.access_token);

// Get album data.
for (let i = 0; i < wantlist.length; i++) {
    const album = await searchForAlbum(token, wantlist[i]).then(data => {
        console.log(data.albums.items);
    });

    // Get artist data.
    const artistHref = album.artists[0].href;
    const artist = await getArtist(token, artistHref).then(data => data);

    // Format product to save to Shopify csv template.
    const artistName = album.artists[0].name;
    const albumName = album.name;
    const title = `${artistName} - ${albumName}`;
    const albumType = album.album_type;
    const image = album.images[0].url;
    const genres = artist.genres.join(', ');

    // Fix below when possible.
    // const releaseDate = album.release_date;
    // const label = album.label;

    const product = {
        'Handle': title,
        'Title': title,
        'Body (HTML)': '',
        'Vendor': 'Village Record Club',
        'Product Category': 'Media > Music & Sound Recordings > Records & LPs',
        'Type': albumType,
        'Tags': `${artistName}, ${genres}`,
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
        'Image Alt Text': `${title}`,
        'Gift Card': '',
        'SEO Title': `${title} | Village Record Club`,
        'SEO Description': `${albumName} by ${artistName}`,
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
}

// Write products to csv file.
try {
    console.log('Writing to .csv file...');
    writeCSV(`./src/csv/albums-${date}.csv`, products);
} catch(err) {
    console.error('Error writing to .csv file:\n', err);
}













    
