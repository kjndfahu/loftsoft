import {Categories} from "@/features/home/container/categories";
import {PopularItems} from "@/features/home/container/popular-items";
import {ArticlesList} from "@/features/home/container/atricles-list";

export default function Home() {
  return (
    <div className="flex flex-col pt-[150px] gap-20">
      <Categories/>
      <PopularItems/>
      <ArticlesList/>
    </div>
  );
}
