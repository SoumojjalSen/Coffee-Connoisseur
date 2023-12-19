import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    try {
      // find a record
      const { id, name, address, full_address, votes, imgUrl } = req.body;

      if (id) {
        const record = await findRecordByFilter(id);

        if (record.length !== 0) {
          res.json(record);
        } else {
          //create a record
          if (name) {
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  full_address,
                  votes,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecord);
            res.json({ message: "Record is created", records: records });
          } else {
            req.status(400);
            res.json({ message: "Name is missing" });
          }
        }
      } else {
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error finding or creating store : ", err);
      res.status(500);
      res.json({ message: "Error finding or creating store : ", err });
    }
  } else {
    res.json({ message: "method is GET" });
  }
};

export default createCoffeeStore;
