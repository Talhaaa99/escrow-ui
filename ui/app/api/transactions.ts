import { NextApiRequest, NextApiResponse } from "next";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const { publicKey } = req.query;

  if (!publicKey) {
    return res.status(400).json({ error: "Missing public key" });
  }

  try {
    const transactions = await connection.getConfirmedSignaturesForAddress2(
      new PublicKey(publicKey as string)
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default handler;
