import { Category, Paginated, Question, Answer } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8000";

export class QuestionsApi {
  async fetchFromApi<T>(url: string): Promise<T | null> {
    let response: Response | undefined;
    try {
      response = await fetch(url);
    } catch (e) {
      console.error('error fetching from api', url, e);
      return null;
    }

    if (!response.ok) {
      console.error('non 2xx status from API', url);
      return null;
    }
    //fix
    if (response.status === 404) {
      console.error('404 from API', url);
      return null;
    }

    let json: unknown;  
    try {
      json = await response.json();
    } catch (e) {
      console.error('error parsing json', url, e);
      return null;
    }

    return json as T;
  }

  async getCategory(slug: string): Promise<Category | null> {
    const url = BASE_URL + `categories/${slug}`;

    const response = await this.fetchFromApi<Category | null>(url);

    return response;
  }

  async getQuestions(
    categorySlug: string
  ): Promise<Paginated<Question> | null> {
    // Ensure there's a slash between BASE_URL and "questions"
    const url = `${BASE_URL}questions?category=${categorySlug}`;
    const response = await this.fetchFromApi<Paginated<Question>>(url);
    return response;
  }
  async getCategories(): Promise<Paginated<Category[]> | null> {
    return this.fetchFromApi<Paginated<Category[]>>(`${BASE_URL}categories`);
  }  

  async updateQuestion(
    questionId: string,
    payload: { text: string; answers: Answer[] }
  ): Promise<Question | null> {
    const url = `${BASE_URL}questions/${questionId}`;
    try {
      const response = await fetch(url, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("non 2xx status when updating question", url);
        return null;
      }
      return await response.json();
    } catch (e) {
      console.error("error updating question", e);
      return null;
    }
  }
}

