require('dotenv').config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const writeCSV = require('write-csv');



/**
 * Retrieves an access token used to make calls to the Spotify Web API.
 * 
 * @returns JSON object containing access token data.
 */
async function getToken() {
    console.log('Getting access token...');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
    });

    console.log('Access token data successfully retrieved.');
    // console.log(response);

    return await response.json();
}



/**
 * Searches the Spotify catalog for a specific album.
 * 
 * @param {string} access_token - Access token obtained from getToken function.
 * @param {string} query - Album to search for.
 * @returns JSON objecr containing album data.
 */
async function searchForAlbum(access_token, query) {
    console.log('Searching for album...');

    const response = await fetch(`https://api.spotify.com/v1/search?&q=${query}&type=album`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    console.log('Album successfully retrieved.');
    // console.log(response);

    return await response.json();
}



/**
 * Gets detailed Spotify catalog information for a specific album.
 * 
 * @param {string} access_token - Access token obtained from getToken function.
 * @param {string} href - Album link obtained from searchForAlbum function.
 * @returns JSON objecr containing detailed album data.
 */
async function getAlbum(access_token, href) {
    console.log('Getting detailed album data...');

    const response = await fetch(href, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    console.log('Detailed album data successfully retrieved.');
    // console.log(response);

    return await response.json();
}



/**
 * Gets detailed Spotify catalog information for a specific artist.
 * 
 * @param {string} access_token - Access token obtained from getToken function.
 * @param {string} href - artist link obtained from getAlbum function.
 * @returns JSON objecr containing detailed artist data.
 */
async function getArtist(access_token, href) {
    console.log('Getting artist data...');

    const response = await fetch(href, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    console.log('Artist data successfully retrieved.');
    // console.log(response);

    return await response.json();
}



/**
 * Main function, writes data to Shopify .csv template.
 * 
 * @param {string} query - Album to search for.
 */
async function main(query) {
    const token = await getToken().then(response => {
            // console.log(response); 
            return response.access_token; 
        })
        .catch(err => console.error('Error getting access token:\n', error));

    const albumHref = await searchForAlbum(token, query).then(response => {
            // console.log(response);
            return response.albums.items[0].href
        })
        .catch(err => console.error('Error searching for album:\n', err));

    const album = await getAlbum(token, albumHref).then(response => {
            // console.log(response);
            return response;
        })
        .catch(err => console.error('Error getting detailed album data:\n', err));

    const artistHref = album.artists[0].href;

    const artist = await getArtist(token, artistHref).then(response => {
        // console.log(response);
        return response;
    })
    .catch(err => console.error('Error getting detailed album data:\n', err));

    const artistName = album.artists[0].name;
    const albumName = album.name;
    const title = `${artistName} - ${albumName}`;
    const albumType = album.album_type;
    const image = album.images[0].url;
    const genres = artist.genres.join(', ');
    const upc = album.external_ids.upc;
    const releaseDate = album.release_date;
    const label = album.label;

    const product = {
        'Handle': title,
        'Title': title,
        'Body (HTML)': `<p>Released: ${releaseDate} on ${label}.<p>`,
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
        'Image Alt Text': `${title}`,
        'Gift Card': '',
        'SEO Title': `${title} | Village Record Club`,
        'SEO Description': `${albumName} by ${artistName}, released on ${releaseDate} on ${label}.`,
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

    const products = [product];

    // write to csv - figure out other location and unique file names later
    console.log('Writing to .csv file...');
    const date = new Date().toISOString();
    writeCSV(`./csv/albums-${date}.csv`, products);
}



// Let's go
const query = 'mf doom - operation doomsday';

main(query);
