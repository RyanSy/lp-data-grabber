import 'dotenv/config';
const discogsToken = process.env.DISCOGS_TOKEN;



/**
 * Searches Discogs database for master data.
 * @param {String} query - The album to search for.
 * @returns {Object} A JSON object containing master data.
 */
export async function search(query) {
    console.log(`Searching Discogs database for master release data for "${query}"...`);

    const masterRelease = await fetch(`https://api.discogs.com/database/search?q=${query}&type=master&format=album&token=${discogsToken}`, {
        headers: {
            'User-Agent': 'LP Data Grabber 1.0: ryanbsy@gmail.com)'
        }
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}.`);
            }

            // to check discogs rate limit, uncomment below
            // const responseHeaders = response.headers;
            // let discogsResponseHeaders = {};
            // discogsResponseHeaders['x-discogs-ratelimit'] = await responseHeaders.get('x-discogs-ratelimit');
            // discogsResponseHeaders['x-discogs-ratelimit-remaining'] = await responseHeaders.get('x-discogs-ratelimit-remaining');
            // discogsResponseHeaders['x-discogs-ratelimit-used'] = await responseHeaders.get('x-discogs-ratelimit-used');
            // console.log('Discogs rate limit response headers:', discogsResponseHeaders);

            return response.json();
        })
        .then(data => {            
            if (data.results.length > 0) {
                console.log('Master release data found.');
                
                const masterReleaseData = data.results[0];
                
                return masterReleaseData;
            } else {
                console.log('No Discogs master release data found.');
                return null;
            }
        })
        .catch(err => console.error('Error searching Discogs database:', err));
    
    if (masterRelease) {
        return masterRelease;
    } else {
        return null;
    }
}

// Sample request:
// searchMasterRelease('Billy Idol - Rebel Yell').then(data => console.log(data));

/**
 * Sample response:
 * 
 * {
  country: 'Worldwide',
  year: '2023',
  format: [ 'Vinyl', 'LP', 'Album' ],
  label: [
    'Method Records',
    'Method Records',
    'Method Records',
    'StarDelta Audio Mastering',
    'Schallplattenfabrik Pallas GmbH'
  ],
  type: 'master',
  genre: [ 'Hip Hop', 'Rock' ],
  style: [ 'Post-Punk' ],
  id: 3001736,
  barcode: [
    '6 02448 16677 7',
    'MTHDVC005-A- Stardelta -60299- II',
    'MTHDVC005-B- Stardelta -60299- I'
  ],
  user_data: { in_wantlist: false, in_collection: false },
  master_id: 3001736,
  master_url: 'https://api.discogs.com/masters/3001736',
  uri: '/master/3001736-slowthai-U-Gotta-Love-Yourself',
  catno: 'MTHDVC005',
  title: 'slowthai - U Gotta Love Yourself',
  thumb: 'https://i.discogs.com/lyiwpbPK89VOkLL6TMvHK0t1MbicDobrgkux6j6CU0M/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI2Mjg1/MzQ1LTE2Nzc4MDk2/ODAtMjYzMi5qcGVn.jpeg',
  cover_image: 'https://i.discogs.com/ppKxpz3ro6wd3QsEEJXnFV_xhrnVZzY2RzQ9mp-vFVA/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI2Mjg1/MzQ1LTE2Nzc4MDk2/ODAtMjYzMi5qcGVn.jpeg',
  resource_url: 'https://api.discogs.com/masters/3001736',
  community: { want: 869, have: 3982 }
}
 */