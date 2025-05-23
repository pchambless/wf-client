const fs = require('fs');
const path = require('path');
const { fetchData } = require('./utils/api-client');

const SAMPLES_DIR = path.join(__dirname, 'samples');
// Ensure the samples directory exists
if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

/**
 * Fetches data from an event and saves it to a file
 */
async function fetchAndSave(eventType, params = {}, options = {}) {
  const { forceRefresh = false, description = '' } = options;
  
  // Use just the event type as the filename (without parameters)
  const fileName = `${eventType}.json`;
  const filePath = path.join(SAMPLES_DIR, fileName);
  
  console.log(`Fetching ${eventType}${description ? ` (${description})` : ''}...`);
  
  // Check cache
  if (!forceRefresh && fs.existsSync(filePath)) {
    console.log(`Using cached data from ${fileName}`);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  try {
    // Make the API call using our independent client
    const result = await fetchData(eventType, params);
    
    // Format data
    const data = {
      table: eventType,
      rows: Array.isArray(result) ? result : [result]
    };
    
    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved ${data.rows.length} rows to ${fileName}`);
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${eventType}: ${error.message}`);
    throw error;
  }
}

/**
 * INGREDIENT-RELATED DATA
 */

// Fetch ingredient types for account
async function fetchIngredientTypes(acctID = 1) {
  return fetchAndSave('ingrTypeList', { ':acctID': acctID }, {
    description: `Ingredient Types for Account ${acctID}`
  });
}

// Fetch ingredients for a type
async function fetchIngredients(ingrTypeID) {
  return fetchAndSave('ingrList', { ':ingrTypeID': ingrTypeID }, {
    description: `Ingredients for Type ${ingrTypeID}`
  });
}

// Fetch batches for a specific ingredient
async function fetchIngredientBatches(ingrID = 3) { // Default to Cumin
  return fetchAndSave('ingrBtchList', { ':ingrID': ingrID }, {
    description: `Batches for Ingredient ${ingrID}`
  });
}

/**
 * PRODUCT-RELATED DATA
 */

// Fetch product types for account
async function fetchProductTypes(acctID = 1) {
  return fetchAndSave('prodTypeList', { ':acctID': acctID }, {
    description: `Product Types for Account ${acctID}`
  });
}

// Fetch products for a type
async function fetchProducts(prodTypeID = 1) { // Default to Sauces
  return fetchAndSave('prodList', { ':prodTypeID': prodTypeID }, {
    description: `Products for Type ${prodTypeID}`
  });
}

// Fetch product batches for a product
async function fetchProductBatches(prodID = 27) { // Keep the default example
  return fetchAndSave('prodBtchList', { ':prodID': prodID }, {
    description: `Batches for Product ${prodID}`
  });
}

// Fetch recipe ingredients for a product
async function fetchRecipe(prodID = 27) { // Keep the default example
  return fetchAndSave('rcpeList', { ':prodID': prodID }, {
    description: `Recipe for Product ${prodID}`
  });
}

// Fetch tasks for a product type
async function fetchTasks(prodTypeID = 1) { // Default to Sauces
  return fetchAndSave('taskList', { ':prodTypeID': prodTypeID }, {
    description: `Tasks for Product Type ${prodTypeID}`
  });
}

/**
 * ACCOUNT-RELATED DATA
 */

// Fetch all accounts
async function fetchAccounts() {
  return fetchAndSave('acctList', {}, {
    description: 'All Accounts'
  });
}

// Fetch brands for account
async function fetchBrands(acctID = 1) {
  return fetchAndSave('brndList', { ':acctID': acctID }, {
    description: `Brands for Account ${acctID}`
  });
}

// Fetch vendors for account
async function fetchVendors(acctID = 1) {
  return fetchAndSave('vndrList', { ':acctID': acctID }, {
    description: `Vendors for Account ${acctID}`
  });
}

// Fetch workers for account
async function fetchWorkers(acctID = 1) {
  return fetchAndSave('wrkrList', { ':acctID': acctID }, {
    description: `Workers for Account ${acctID}`
  });
}

/**
 * GLOBAL LOOKUPS
 */

// Fetch measurement units
async function fetchMeasurements() {
  return fetchAndSave('measList', {}, {
    description: 'Global Measurement Units'
  });
}

/**
 * Fetch sample data for each entity type
 */
async function fetchSampleData() {
  try {
    // Accounts
    await fetchAccounts();
    
    // Account-related (all for account 1)
    await fetchBrands();
    await fetchVendors();
    await fetchWorkers(); // Added workers here
    
    // Ingredients
    await fetchIngredientTypes();
    await fetchIngredients(5); // Spices (type 5)
    await fetchIngredientBatches(); // Default to Cumin (ID 3)
    
    // Products
    await fetchProductTypes();
    await fetchProducts(); // Default to Sauces (type 1)
    await fetchProductBatches(); // Default to product 27
    await fetchRecipe(); // Default to product 27
    await fetchTasks(); // Default to product type 1
    
    // Global lookups
    await fetchMeasurements();
    
    console.log('✅ Sample data fetched successfully!');
  } catch (error) {
    console.error('❌ Error fetching sample data:', error.message);
  }
}

// Execute this file directly to fetch sample data
if (require.main === module) {
  console.log('Fetching sample data for migration...');
  fetchSampleData();
}

module.exports = {
  fetchAndSave,
  fetchSampleData,
  fetchAccounts,
  fetchBrands,
  fetchVendors,
  fetchWorkers,
  fetchIngredientTypes,
  fetchIngredients,
  fetchIngredientBatches,
  fetchProductTypes,
  fetchProducts,
  fetchProductBatches,
  fetchRecipe,
  fetchTasks,
  fetchMeasurements
};
