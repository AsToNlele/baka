// Author: Alexandr Celakovsky - xcelak00
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { InstagramEmbed } from "react-social-media-embed"
import { useSocialPostList } from "@/features/landing/hooks/useSocialPostList"
import { SmallLoading } from "@/components/Loading"

export const SocialMediaPosts = () => {
    const { data } = useSocialPostList()
    const settings = {
        // dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    }
    if (!data) {
        return <SmallLoading />
    }
    if (data.length === 0) {
        return null
    }
    return (
        <div className="max-w-80">
            <Slider {...settings}>
                {data?.map((post) => (
                    <InstagramEmbed
                        key={post.id}
                        url={post.url}
                        width={328}
                        captioned
                    />
                ))}
            </Slider>
        </div>
    )
}
