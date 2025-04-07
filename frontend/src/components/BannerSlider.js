import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../styles/slider.css";

const banners = [
  { id: 1, img: '/images/5472486.jpg', alt: 'Банер 1' },
  { id: 2, img: '/images/8919669.jpg', alt: 'Банер 2' },
];

const BannerSlider = () => {
  return (
    <div className="banner-wrapper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 20000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img src={banner.img} alt={banner.alt} className="banner-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
