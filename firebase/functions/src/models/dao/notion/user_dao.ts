import {DataSnapshot} from "../../../utilities/snapshot/data_snapshot";
import {notion, USER_DATABASE_ID} from "./config";


/**
 * Adds two numbers together.
 * @param {string} _id The first number.
 * @return {string} The sum of the two numbers.
 */
export async function getUserInfo(_id: string): Promise<DataSnapshot<string>> {
  return notion.databases.query({
    database_id: USER_DATABASE_ID,
    filter: {
      property: "identity",
      rich_text: {
        equals: _id,
      },
    },
  }).then((res) => {
    const data = res.results.at(0);
    if (!data?.id) {
      throw new DataSnapshot(false, 2001, undefined, "User not found.");
    }
    return new DataSnapshot(true, 2000, ()=> data.id);
  });
}
