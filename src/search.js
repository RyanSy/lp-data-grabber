require('dotenv').config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const writeCSV = require('write-csv');

/**
 * Get access token
 */
async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' +
                Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
    });

    return await response.json();
}

/**
 * Search
 */
async function search(access_token, item) {
    const query = item;
    const response = await fetch(`https://api.spotify.com/v1/search?&q=illmatic&type=album`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    return await response.json();
}

getToken().then(response => {
    const token = response.access_token;

    //  get new releases
    search(token, 'illmatic').then(async data => {
        console.log(data.albums.items[0]);
        // const products = [];

        // //  for each new release, format according to Shopify csv template and save to array
        // for (let i = 0; i < newReleases.length; i++) {
        //     if (newReleases[i].album_type != 'single') {
        //         const response = await fetch(newReleases[i].href, {
        //             method: 'GET',
        //             headers: { 'Authorization': 'Bearer ' + token },
        //         });
        //         const album = await response.json();
        //         const artist = album.artists[0].name;
        //         const title = `${album.artists[0].name} - ${album.name}`;
        //         const genres = album.genres;
        //         const image = album.images[0].url;
        //         const upc = album.external_ids.upc;
        //         const albumType = album.album_type;

        //         const product = {
        //             'Handle': title,
        //             'Title': title,
        //             'Body (HTML)': '',
        //             'Vendor': 'Village Record Club',
        //             'Product Category': 'Media > Music & Sound Recordings > Records & LPs',
        //             'Type': albumType,
        //             'Tags': `${artist}, ${genres}`,
        //             'Published': '',
        //             'Option1 Name': '',
        //             'Option1 Value': '',
        //             'Option2 Name': '',
        //             'Option2 Value': '',
        //             'Option3 Name': '',
        //             'Option3 Value': '',
        //             'Variant SKU': upc,
        //             'Variant Grams': '',
        //             'Variant Inventory Tracker': '',
        //             'Variant Inventory Qty': '',
        //             'Variant Inventory Policy': 'deny',
        //             'Variant Fulfillment Service': 'manual',
        //             'Variant Price': '',
        //             'Variant Compare At Price': '',
        //             'Variant Requires Shipping': '',
        //             'Variant Taxable': '',
        //             'Variant Barcode': '',
        //             'Image Src': image,
        //             'Image Position': '',
        //             'Image Alt Text': '',
        //             'Gift Card': '',
        //             'SEO Title': '',
        //             'SEO Description': '',
        //             'Google Shopping / Google Product Category': '',
        //             'Google Shopping / Gender': '',
        //             'Google Shopping / Age Group': '',
        //             'Google Shopping / MPN': '',
        //             'Google Shopping / AdWords Grouping': '',
        //             'Google Shopping / AdWords Labels': '',
        //             'Google Shopping / Condition': '',
        //             'Google Shopping / Custom Product': '',
        //             'Google Shopping / Custom Label 0': '',
        //             'Google Shopping / Custom Label 1': '',
        //             'Google Shopping / Custom Label 2': '',
        //             'Google Shopping / Custom Label 3': '',
        //             'Google Shopping / Custom Label 4': '',
        //             'Variant Image': '',
        //             'Variant Weight Unit': '',
        //             'Variant Tax Code': '',
        //             'Cost per item': '',
        //             'Price / International': '',
        //             'Compare At Price / International': '',
        //             'Status': 'Active',
        //         };
        //         products.push(product);
        //     }
        // }

        // // write to csv - figure out other location and unique file names later
        // const date = new Date().toISOString();
        // writeCSV(`./csv/new-releases-${date}.csv`, products);
    }).catch(err => console.error(err));

}).catch(err => console.error(err));