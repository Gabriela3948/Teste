export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-3xl">🌿</span>
        </div>
        <p className="text-emerald-700 font-semibold text-lg">Carregando LifeTrack...</p>
      </div>
    </div>
  );
}
