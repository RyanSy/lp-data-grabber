import { getToken } from './spotify.js';

const token = await getToken().then(data => data.access_token);



