import Categories from "@/components/Categories/Categories";
import Navigation from "@/components/Navigation/Navigation";

// https://vef2-2025-v3-unnid-i-tima.onrender.com/categories

export default function Home() {
  return (
    <div>
      <Navigation />

      <Categories title="Vinsælir flokkar" tag="hot" popular />
      <Categories title="Allir flokkar" />
    </div>
  );
}
