"use client";

import Link from 'next/link';
import styles from './Categories.module.css'
import { useEffect, useState } from 'react';

const URL = 'https://vef2-2025-v3-unnid-i-tima.onrender.com/categories';

type Category = {
  id: string;
  slug: string;
  title: string;
}

type Props = {
  title: string;
  tag?: string;
  popular?: boolean;
}

export default function Categories({ title, tag, popular }: Props) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(URL).catch(err => console.log(err));

      if (!response) {
        throw new Error('unable to get data')
      }

      const json = await response.json();
      setCategories(json);

      console.log(json)
    }
    fetchData();
  }, [])

  return (
    <div className={styles.cats}>
      <h2>{title}</h2>

      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <Link href={`/flokkar/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>

    </div>
  );
}