import { NextApiRequest, NextApiResponse } from "next";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = new Connection(clusterApiUrl("devnet"));
  try {
    const voteAccounts = await connection.getVoteAccounts();
    res.status(200).json(voteAccounts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default handler;
