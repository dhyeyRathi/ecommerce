import { NextResponse } from "next/server";
import { getCategories } from "@/app/context/productContext";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}
