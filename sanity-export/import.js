const path = require('path');
const fs = require('fs');
const { createClient } = require('@sanity/client');
const sanityImport = require('@sanity/import');
require('dotenv').config();

// Load environment variables
const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_ACCESS_TOKEN;

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN || token,
    apiVersion: '2024-01-31',
    useCdn: false
});

const input = fs.createReadStream(path.join(__dirname, 'export.tar.gz'));

sanityImport(input, {
    client: client,
    operation: 'createOrReplace' // `create`, `createOrReplace` or `createIfNotExists`
})
    .then(({ numDocs, warnings }) => {
        console.log('imported %d documents', numDocs);
        console.log('warnings:', warnings);
        // Note: There might be warnings! Check `warnings`
    })
    .catch((err) => {
        console.error('Import failed: %s', err.message);
    });
