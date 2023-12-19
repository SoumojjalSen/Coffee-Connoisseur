import { table, findRecordByFilter, getMinifiedRecords } from "@/lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;
      if (id) {
        const recordArray = await findRecordByFilter(id);

        if (recordArray.length !== 0) {
          const record = recordArray[0];

          const calculateUpvote = parseInt(record.votes) + 1;

          console.log("calculateVoting", {calculateUpvote})

          //update a record
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                votes: calculateUpvote,
              }
            }
          ]);

          if(updateRecord){
            const minifiedRecord = getMinifiedRecords(updateRecord);

            res.json(minifiedRecord)
          }

          res.json(recordArray);
        } else {
          res.json({ message: "Coffee store id doesn't exist", id });
        }
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
};

export default upvoteCoffeeStoreById;
