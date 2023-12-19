import { findRecordByFilter } from "@/lib/airtable";

const getCoffeeStoresById = async (req, res) => {

  const { id } = req.query;

  try {
    if (id) {
      const coffeeStoreRecord = await findRecordByFilter(id);

      if (coffeeStoreRecord.length !== 0) {
        res.json(coffeeStoreRecord);
      } else {
        res.json({ message: "Id couldn't be found !!!" });
      }
    }
  } catch (err) {
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
};

export default getCoffeeStoresById;
