import Image from 'next/image'

export default function JoymdLogo() {
  return (
    <Image
      src="/instapaytient_logo.png"
      width={100}
      height={44.53}
      alt="joymd logo"
      priority={true}
      placeholder="empty"
      style={{
        width: 'auto',
        height: 'auto'
      }}
    />
  )
}