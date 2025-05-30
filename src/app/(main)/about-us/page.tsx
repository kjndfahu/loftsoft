import {Hero} from "@/features/about-us/ui/hero";
import {Banner} from "@/features/about-us/ui/banner";
import {BenefitsLoftsoft} from "@/features/about-us/container/benefits-loftsoft";
import {LicenseInformationBlock} from "@/features/home/ui/license-information-block";
import {FaqBlock} from "@/features/about-us/container/faq-block";
import {ReviewsInfo} from "@/features/reviews/ui/reviews-info";
import {Review} from "@/features/product-page/ui/review";
import RatingVisualization from "@/features/reviews/ui/rating-visualization";
import {getAllReviews} from "@/enteties/review/review";

export default async function AboutUsPage() {
    const { success, reviews, error } = await getAllReviews();

    if (!success || !reviews) {
        return (
            <div className="flex flex-col w-full py-[150px] pl-[350px] pr-[100px] gap-5">
                <p className="text-red-500">Error: {error || "Unable to load reviews"}</p>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col pb-20 mds:pt-[150px] pt-[80px] xxl:px-[250px] xl:px-[150px] mdbvp:px-[100px] sml:px-[50px] px-[20px] mds:gap-[120px] gap-[60px]">
            <Hero/>
            <Banner/>
            <BenefitsLoftsoft/>
            <div className="flex flex-col md:gap-8 gap-5">
                <ReviewsInfo reviews={reviews}/>
                <div className="flex mds:flex-row flex-col w-full md:gap-6 mds:gap-2 gap-4">
                    <div className="flex flex-1 h-auto flex-col gap-4">
                        {!reviews ? (
                            <div className="flex flex-col gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index}
                                         className="animate-pulse w-full rounded-[16px] h-[210px] bg-[#F5F7FF]"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500">{error}</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8">Отзывов пока нет</div>
                        ) : (
                            reviews.map((review) => (
                                <Review
                                    key={review.id}
                                    text={review.text}
                                    grade={review.grade}
                                    createdAt={review.createdAt}
                                    photo={review.photos}
                                    user={review.user}
                                    item={review.item}
                                />
                            ))
                        )}
                    </div>
                    <RatingVisualization reviews={reviews}/>
                </div>
            </div>
            <FaqBlock/>
            <LicenseInformationBlock/>
        </div>
    );
}
