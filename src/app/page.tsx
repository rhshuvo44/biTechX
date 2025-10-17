"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [router]);

  return null;
}
