const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
});
const base = Airtable.base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

const minifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => minifiedRecord(record));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecord);
};

export { table, getMinifiedRecords, findRecordByFilter };
