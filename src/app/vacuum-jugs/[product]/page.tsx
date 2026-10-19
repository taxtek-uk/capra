import { ProductPage, productMeta, productParams } from "@/components/shop/ProductPage";

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = productParams("vacuum-jugs");
export const generateMetadata = async ({ params }: { params: Promise<{ product: string }> }) => productMeta("vacuum-jugs", (await params).product);

export default async function Page({ params }: { params: Promise<{ product: string }> }) {
  return <ProductPage family="vacuum-jugs" slug={(await params).product} />;
}
