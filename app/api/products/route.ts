import { NextResponse } from "next/server";
import { getProducts } from "@/app/context/productContext";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
