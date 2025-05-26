import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb- gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button asChild>
          <Link href={"/products"}>Go to vertical Prototype</Link>
        </Button>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center">
        <p>
          &copy; This project is developed solely for educational purposes at
          Hochschule Fulda.
        </p>
      </footer>
    </div>
  );
}
