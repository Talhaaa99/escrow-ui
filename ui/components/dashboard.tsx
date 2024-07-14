/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Zsz1HrbErzN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  BarChart,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { JSX, ClassAttributes, HTMLAttributes, SVGProps } from "react";
// imports methods relevant to the react framework
import * as React from "react";
// library we use to interact with the solana json rpc api
import * as web3 from "@solana/web3.js";
// allows us access to methods and components which give us access to the solana json rpc api and user's wallet data
// allows us to choose from the available wallets supported by the wallet adapter
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
// imports a component which can be rendered in the browser
import {
  WalletModalButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// applies the styling to the components which are rendered on the browser
require("@solana/wallet-adapter-react-ui/styles.css");
// imports methods for deriving data from the wallet's data store
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Navbar from "./navbar";
import axios from "axios";
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";

interface TransactionData {
  date: string;
  count: number;
}

export default function Dashboard() {
  const [balance, setBalance] = React.useState<number | null>(0);
  const [data, setData] = React.useState<any>({
    solSupply: { circulating: 0, nonCirculating: 0 },
    epoch: { slotRange: [0, 0], timeRemaining: "" },
    network: { blockHeight: 0, slotHeight: 0, tps: 0, trueTps: 0 },
    stake: { current: 0, delinquent: 0 },
    nftDashboard: [],
    defiDashboard: [],
    tpsData: [],
    pingTime: [],
  });
  const [error, setError] = React.useState<string | null>(null);
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const solanaEndpoint = "https://api.testnet.solana.com";

        // Fetch SOL supply
        const solSupplyResponse = await axios.post(solanaEndpoint, {
          jsonrpc: "2.0",
          id: 1,
          method: "getSupply",
        });
        const { circulating, nonCirculating } =
          solSupplyResponse.data.result.value;

        // Fetch current epoch info
        const epochInfoResponse = await axios.post(solanaEndpoint, {
          jsonrpc: "2.0",
          id: 1,
          method: "getEpochInfo",
        });
        const { slotIndex, slotsInEpoch } = epochInfoResponse.data.result;
        const timeRemaining = `${slotsInEpoch - slotIndex} slots`;

        // Fetch network info
        const blockHeightResponse = await axios.post(solanaEndpoint, {
          jsonrpc: "2.0",
          id: 1,
          method: "getBlockHeight",
        });
        const slotHeightResponse = await axios.post(solanaEndpoint, {
          jsonrpc: "2.0",
          id: 1,
          method: "getSlot",
        });
        const blockHeight = blockHeightResponse.data.result;
        const slotHeight = slotHeightResponse.data.result;

        // Fetch TPS data
        const tpsResponse = await axios.post(solanaEndpoint, {
          jsonrpc: "2.0",
          id: 1,
          method: "getRecentPerformanceSamples",
        });
        const { numTransactions, samplePeriodSecs } =
          tpsResponse.data.result[0];
        const tps = numTransactions / samplePeriodSecs;

        // Fetch NFT data
        const nftApiUrl =
          "https://api-mainnet.magiceden.dev/v2/marketplace/popular_collections";
        const nftResponse = await axios.get(nftApiUrl);
        const nftDashboard = nftResponse.data;

        // Fetch DeFi data
        const defiDashboard = [
          { name: "AMM 1", volume: 1000000 },
          { name: "AMM 2", volume: 800000 },
        ];

        // TPS and True TPS data for bar graph
        const tpsData = [{ name: "TPS", value: tps }];

        // Fetch average ping time
        const pingTime = [
          { name: "Node 1", time: 50 },
          { name: "Node 2", time: 45 },
        ];

        setData({
          solSupply: { circulating, nonCirculating },
          epoch: { slotRange: [slotIndex, slotsInEpoch], timeRemaining },
          network: { blockHeight, slotHeight, tps },
          /* stake: { current, delinquent }, */
          nftDashboard,
          defiDashboard,
          tpsData,
          pingTime,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        const info = await connection.getAccountInfo(publicKey);
        setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
      }
    };
    getInfo();
    // the code above will execute whenever these variables change in any way
  }, [connection, publicKey]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-black from-[#0B2447] to-[#19376D]">
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Solana Dashboard
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 p-4">
            <Card className="relative overflow-hidden rounded-lg col-span-2">
              <CardHeader className="relative z-10 px-6 pt-6">
                <CardTitle>Blockchain Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for the Solana network.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-2xl font-bold">1.2M</div>
                    <div className="text-sm">Transactions per day</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-2xl font-bold">$25B</div>
                    <div className="text-sm text-muted-foreground">
                      Total value locked
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-2xl font-bold">1.5M</div>
                    <div className="text-sm text-muted-foreground">
                      Active wallets
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute inset-0 -z-10 from-[#0077B6]/50 to-[#00B2FF]/50 blur-xl" />
            </Card>
            <Card className="relative overflow-hidden rounded-lg from-[#2ECC71] to-[#27AE60] col-span-2">
              <CardHeader className="relative z-10 px-6 pt-6">
                <CardTitle>Developer Tools</CardTitle>
                <CardDescription>
                  Explore the latest Solana development resources and tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                    prefetch={false}
                  >
                    <CodeIcon className="h-5 w-5" />
                    <span>Solana SDK</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                    prefetch={false}
                  >
                    <TerminalIcon className="h-5 w-5" />
                    <span>CLI Tools</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                    prefetch={false}
                  >
                    <CpuIcon className="h-5 w-5" />
                    <span>Validator Guides</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                    prefetch={false}
                  >
                    <LayersIcon className="h-5 w-5" />
                    <span>Ecosystem Projects</span>
                  </Link>
                </div>
              </CardContent>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2ECC71]/50 to-[#27AE60]/50 blur-xl" />
            </Card>
          </div>
          <div className="mx-auto mb-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {data?.network.blockheight !== 0 ? (
              <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-4 gap-8 p-4">
                <Card className="relative shadow-md rounded-lg align-start">
                  <CardHeader>
                    <CardTitle>SOL Supply</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 px-6 pb-6">
                    <p>Circulating: {data.solSupply.circulating}</p>
                    <p>Non-Circulating: {data.solSupply.nonCirculating}</p>
                  </CardContent>
                </Card>
                <Card className="relative shadow-md rounded">
                  <CardHeader>
                    <CardTitle>Current Epoch</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 px-6 pb-6">
                    <p>Slot Range: {data.epoch.slotRange.join(" - ")}</p>
                    <p>Time Remaining: {data.epoch.timeRemaining}</p>
                  </CardContent>
                </Card>
                <Card className="relative shadow-md rounded">
                  <CardHeader>
                    <CardTitle>Network Health</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 px-6 pb-6">
                    <p>Block Height: {data.network.blockHeight}</p>
                    <p>Slot Height: {data.network.slotHeight}</p>
                  </CardContent>
                </Card>
                <Card className="relative shadow-md rounded">
                  <CardHeader>
                    <CardTitle>TPS</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 px-6 pb-6">
                    <p>{data.network.tps}</p>
                  </CardContent>
                </Card>
                <Card className="relative shadow-md rounded col-span-4">
                  <div className="absolute bg-purple-600 -inset-1 z-[-1] rounded-lg blur"></div>
                  <CardHeader>
                    <CardTitle>Solana NFTs</CardTitle>
                    <CardDescription>
                      Check out the most popular NFTs on Solana
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 px-6 pb-6">
                    <div className="relative h-full overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Floor Price</TableHead>
                            <TableHead>Volume</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.nftDashboard
                            .slice(0, 10)
                            .map((product: any) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <img
                                    src={product.image}
                                    alt="/"
                                    className="rounded-[25px] max-h-[40px] max-w-[40px]"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {product.name}
                                </TableCell>
                                <TableCell>{product.floorPrice}</TableCell>
                                <TableCell>{product.volumeAll}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function ActivityIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function CodeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CpuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}

function LayersIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function LayoutGridIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function TerminalIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function WalletIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
