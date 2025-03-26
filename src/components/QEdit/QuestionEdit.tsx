"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; 
import styles from "./QuestionEdit.module.css";
import { QuestionsApi } from "@/api";
import type { Question as QuestionType, Answer } from "@/types";


export default function QuestionEditForm() {
  // Notum id frá URL-inu til að sækja spurninguna
  const { id } = useParams(); 
  const router = useRouter();
  
  // Staða fyrir spurninguna og svörin
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      const api = new QuestionsApi();
      
      const question = await api.getQuestionById(String(id));
      if (question) {
      setQuestion(question);
      setQuestionText(question.text);
      setAnswers(question.answers);
      } else {
      setMessage("Ekki tókst að sækja spurningu");
      }
      setLoading(false);
    }
    fetchQuestion();
  }, [id]);

  // Handler fyrir breytingu á svörum
  const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  // Fall til að bæta við nýju svar
  const addAnswer = () => {
    setAnswers([...answers, { text: "", correct: false, id: Date.now() }]); 
    // id er til dæmis til að auðkenna tímabundið svar
  };

  // Handler fyrir uppfærslu spurningar
  const onSubmit = async (e: React.FormEvent) => {

    console.log("Validating answers...");

answers.forEach((a, i) => {
  console.log(`Answer ${i}:`, a);

  if (typeof a.text !== "string" || a.text.trim() === "") {
    console.warn(`⚠️ Answer ${i} has invalid or empty text`);
  }
  if (typeof a.correct !== "boolean") {
    console.warn(`⚠️ Answer ${i} has invalid 'correct' value:`, a.correct);
  }
});
    
    e.preventDefault();
    const api = new QuestionsApi();

    // Búum til payload fyrir uppfærslu
    const payload = {
      text: questionText.trim(),
      answers: answers.map(({ text, correct }) => ({
        text: text.trim(),
        correct,
      })),
    } as { text: string; answers: Answer[] };

    console.log("Sending update:", payload);
    console.log("Sending PATCH to:", `/questions/${id}`);
    console.log("Payload:", payload);

    

    // Gerum ráð fyrir að þú hafir API endpoint til að uppfæra spurningu, t.d. PUT /api/questions/[id]
    const res = await api.updateQuestion(String(id), payload);
    if (res) {
      setMessage("Spurning uppfærð!");
      // Ef þú vilt, máttu vísa notandanum á aðra síðu
      router.push(`/flokkar/${question?.category.slug}`);
    } else {
      setMessage("Villa við uppfærslu spurningar");
    }
  };

  if (loading) return <p>Sæki spurningu...</p>;

  return (
    <div className={styles.editFormContainer}>
      <h2>Breyta spurningu</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label>Spurning:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            
          />
        </div>
        <div className={styles.formGroup}>
          <label>Svör:</label>
          {answers.map((answer, index) => (
            <div key={index} className={styles.answerGroup}>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
              />
              <label>
                Rétt?
                <input
                  type="checkbox"
                  checked={answer.correct}
                  onChange={(e) => handleAnswerChange(index, "correct", e.target.checked)}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addAnswer}>
            Bæta við svari
          </button>
        </div>
        <button type="submit">Vista breytingu</button>
      </form>
    </div>
  );
}
