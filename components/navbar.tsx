import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-end items-end bg-black">
      <WalletMultiButton
        style={{
          backgroundColor: "ButtonFace",
          color: "black",
          border: 3,
          borderColor: "white",
          borderRadius: 25,
          borderBlockColor: "violet",
          MozWindowShadow: "default",
          backgroundBlendMode: "darken",
        }}
      />
    </nav>
  );
};

export default Navbar;
