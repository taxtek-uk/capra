import { ProductPage, productMeta, productParams } from "@/components/shop/ProductPage";

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = productParams("insulated-bottles");
export const generateMetadata = async ({ params }: { params: Promise<{ product: string }> }) => productMeta("insulated-bottles", (await params).product);

export default async function Page({ params }: { params: Promise<{ product: string }> }) {
  return <ProductPage family="insulated-bottles" slug={(await params).product} />;
}
