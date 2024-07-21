import Image from "next/image";

export default function Header() {
  return (
    <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
      <a
        href="https://www.llamaindex.ai/"
        className="flex items-center justify-center font-nunito text-lg font-bold gap-2"
      >
        <Image
          className="rounded-xl shadow-2xl border-4 border-white"
          src="/paailogo.png"
          alt="Llama Logo"
          width={200} 
          height={100}
          priority
        />
      </a>
    </div>
  );
}
