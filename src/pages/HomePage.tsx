import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-primary">
        Penyelamat Makanan
      </h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Platform untuk menghubungkan makanan surplus layak konsumsi dengan yang membutuhkan. #ZeroHunger
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          Mulai Sekarang
        </Link>
      </div>
    </div>
  );
}
