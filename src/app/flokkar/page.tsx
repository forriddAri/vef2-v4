"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { QuestionsApi } from "@/api"; 

type Category = {
  id: string;
  slug: string,
  name: string;
};

export default function FlokkarPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function test(){ 
    const questionsApi = new  QuestionsApi();
    const categories = await questionsApi.getCategories();
    setCategories(categories)
    }
    test()
  }, 
  []);

  return (
    <div className={styles.categories}>
      <h2>Allir flokkar</h2>
      <ul>
        {categories.length === 0 ? (
          <p>Hleð inn flokkum...</p>
        ) : (
          categories.map((cat) => (
            <li key={cat.id} className={styles.categoryItem}>
              <Link href={`/flokkar/${cat.id}`}>{cat.name}</Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
