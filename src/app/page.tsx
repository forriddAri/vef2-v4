"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import styles from "./page.module.css";
import { QuestionsApi } from "@/api";
import type { Category } from "@/types"; 

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function test() { 
      const api = new QuestionsApi();
      const response = await api.getCategories();
      if (response) {
        // Flatten the nested array into a single-level array.
        setCategories(response.data.flat());
      } else {
        setCategories([]);
      }
    }
    test();
  }, []);

  return (
    <div className={styles.page}>
      <Navigation />
      
      <section className={styles.hero}>
        <h1 className={styles.title}>Velkomin í Spurningaleikinn!</h1>
        <p className={styles.description}>
          Skoraðu á sjálfa/n þig og reyndu við þessi próf!
        </p>
        <Link href="/flokkar" className={styles.button}>
          Byrja Leik
        </Link>
      </section>

      <section className={styles.categories}>
        <h2>Flokkar</h2>
        <ul>
          {categories.length === 0 ? (
            <p>Hleð inn flokkum...</p> 
          ) : (
            categories.map((cat) => (
              <li key={cat.id} className={styles.categoryItem}>
                <Link href={`/flokkar/${cat.slug}`}>{cat.name}</Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
