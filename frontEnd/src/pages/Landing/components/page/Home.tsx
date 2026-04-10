import { useAuth } from "../../../../context/AuthContext";
import ImageSlider from "../ImageSlider";
import { AboutSection, CommunitySection, SupportSection } from "../sections";
import ActivitiesSection from "../sections/activities";
import GallerySection from "../sections/gallery";
import JumuiyaSection from "../sections/jumuiya";
import OfficialsSection from "../sections/officials";
import ProjectsSection from "../sections/projects";



export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Show landing page content when NOT logged in */}
        {!user && (
          <>
            <ImageSlider />
            <AboutSection/>
            <CommunitySection />
            <GallerySection/>
          </>
        )}

        {/* Show all sections when logged in */}
        {user && (
          <>
            <JumuiyaSection/>
            <OfficialsSection />
            <ProjectsSection/>
            <ActivitiesSection/>
            <GallerySection />
            <ProjectsSection />
          </>
        )}

        {/* Show Support section to everyone */}
        <SupportSection/>
      </main>
    </div>
  );
};