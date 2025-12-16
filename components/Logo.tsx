import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/login" className="inline-block hover:opacity-80 transition-opacity">
      <Image
        src="/images/logo/logo.png"
        alt="Snapwith"
        width={120}
        height={40}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}
