import { TitleDesc } from "@/shared/title-desc"
import { CategoryBlock } from "@/features/home/ui/category-block"
import { NavBtn } from "@/features/home/ui/nav-btn"
import {getCategories} from "@/enteties/category/category";


export const Categories = async () => {

    const categories = await getCategories()

    return (
        <div className="flex flex-col items-center mds:gap-10 gap-6">
            <TitleDesc title="Категории товаров" description="Выберите нужную категорию" />
            <div className="grid md:grid-cols-3 mds:grid-cols-2 grid-cols-1 gap-6 justify-between w-full">
                {categories.map((category:{
                    id: number;
                    photo: string;
                    title: string;
                    description: string;
                    createdAt: Date;
                    updateAt: Date;
                }) => (
                    <CategoryBlock
                        key={category.id}
                        title={category.title}
                        description={category.description}
                        photo={category.photo}
                    />
                ))}
            </div>
            <NavBtn text="Все категории" />
        </div>
    )
}
