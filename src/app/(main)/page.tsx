import {Categories} from "@/features/home/container/categories";
import {PopularItems} from "@/features/home/container/popular-items";
import {ArticlesList} from "@/features/home/container/atricles-list";
import {InfoBlock} from "@/features/profile/ui/info-block";

export default function Home() {
  return (
    <div className="flex flex-col mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] gap-20">
      <Categories/>
      <PopularItems/>
       <InfoBlock/>
      <ArticlesList/>
    </div>
  );
}
