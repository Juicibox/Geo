import { CulturalMap } from '@/components/CulturalMap';
import { loadArtistas, loadMunicipiosGeoJSON } from '@/data/loadData';

export default function Home() {
  const artistas = loadArtistas();
  const municipiosGeoJSON = loadMunicipiosGeoJSON();

  return (
    <main className="h-screen w-screen overflow-hidden">
      <CulturalMap artistas={artistas} municipiosGeoJSON={municipiosGeoJSON} />
    </main>
  );
}
