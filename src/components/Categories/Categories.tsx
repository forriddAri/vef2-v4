'use client';

import { QuestionsApi } from '@/api';
import { Category, Paginated, UiState } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Categories.module.css';


type Props = {
  title: string;
  tag?: string;
  popular?: boolean;
};

export default function Categories({ title }: Props) {
  const [uiState] = useState<UiState>('initial');
  const [categories, setCategories] = useState<Paginated<Category[]> | null>(null);

  useEffect(() => {
    async function test() {
      const questionsApi = new QuestionsApi();
      const categories = await questionsApi.getCategories();
  
      if (categories) {
        setCategories(categories);
      } else {
        console.error("Gat ekki sótt flokka.");
      }
    }
  
    test();
  }, []);
  


  console.log(categories);

  return (
    <div className={styles.cats}>
      <h2>{title}</h2>

      {uiState === 'loading' && <p>Sæki flokka...</p>}
      {uiState === 'error' && <p>Villa við að sækja flokka</p>}
      {uiState === 'data' && categories && (
        <ul>
        {categories?.data.flat().map((category) => (
        <li key={category.id}>
        <Link href={`/flokkar/${category.slug}`}>{category.name}</Link>
        </li> 
      ))}
      </ul>
      )}
    </div>
  );
}
