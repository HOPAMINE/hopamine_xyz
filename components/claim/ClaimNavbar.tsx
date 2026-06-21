import Image from "next/image";
import Link from "next/link";

export function ClaimNavbar() {
  return (
    <div className="flex flex-row items-center p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Link href="/claim">
        <Image
          src="/hopathon/the-green-hackathon.svg"
          alt="The Green Hackathon"
          width={120}
          height={120}
          className="h-auto w-[min(52vw,120px)] sm:w-[120px]"
        />
      </Link>
    </div>
  );
}
