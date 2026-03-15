// test-osm.js
const lat = 17.3850;
const lng = 78.4867;
const radius = 3000;

const categories = [
  { label: 'Restaurants',   filter: '"amenity"="restaurant"' },
  { label: 'Cafes',         filter: '"amenity"="cafe"' },
  { label: 'Bars/Pubs',     filter: '"amenity"="bar"' },
  { label: 'Parks',         filter: '"leisure"="park"' },
  { label: 'Gyms',          filter: '"leisure"="fitness_centre"' },
  { label: 'Malls',         filter: '"shop"="mall"' },
  { label: 'Cinemas',       filter: '"amenity"="cinema"' },
  { label: 'Museums',       filter: '"tourism"="museum"' },
  { label: 'Bookshops',     filter: '"shop"="books"' },
  { label: 'Art galleries', filter: '"tourism"="gallery"' },
  { label: 'Sports',        filter: '"leisure"="sports_centre"' },
  { label: 'Fast food',     filter: '"amenity"="fast_food"' },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

for (const cat of categories) {
  const query = `
[out:json][timeout:10];
node[${cat.filter}](around:${radius},${lat},${lng});
out 3;
`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    const text = await res.text();
    const data = JSON.parse(text);
    const count = data.elements?.length || 0;

    if (count > 0) {
      console.log(`✅ ${cat.label} (${count} found)`);
      data.elements.forEach(p => console.log(`   - ${p.tags?.name || 'Unnamed'}`));
    } else {
      console.log(`❌ ${cat.label} — none found`);
    }
  } catch (err) {
    console.log(`⚠️  ${cat.label} — failed (rate limited or no data)`);
  }

  console.log('');
  await sleep(1000); // 1 second between each request
}