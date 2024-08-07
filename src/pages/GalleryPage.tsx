
import ImageSlider from "../components/gallery/ImageSlider";
import ScrollableGallery from "../components/gallery/ScrollableGallery";
import Header from "../components/header/Header";

const GalleryPage = () => {
    return (
        <div>
            <Header title="Travel Drago" />
            <h1>Gallery Page</h1>
            <ScrollableGallery />
            <ImageSlider />
        </div>
    );
}

export default GalleryPage;