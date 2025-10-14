import Image from "next/image";

export default function JoymdLogo() {
  return (
    <Image
      alt="joymd logo"
      height={44.53}
      placeholder="empty"
      priority={true}
      src="/instapaytient_logo.png"
      style={{
        width: "auto",
        height: "auto",
      }}
      width={100}
    />
  );
}
