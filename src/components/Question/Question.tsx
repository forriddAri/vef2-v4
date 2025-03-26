import React, { JSX } from 'react';
import { Question as QuestionType } from '../../types';
import styles from './Question.module.css';
import Link from "next/link";

export function Question({ question }: { question: QuestionType }): JSX.Element {
  const [answerId, setAnswerId] = React.useState<number | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit, valið svar:', answerId);
  };

  return (
    <div className={styles.questionContainer}>
      <h2 className={styles.questionHeading}>{question.text}</h2>
      <form onSubmit={onSubmit}>
        <ul className={styles.answerList}>
          {question.answers.map((answer) => {
            const isCorrect = answerId === answer.id && answer.correct;
            return (
              <li key={answer.id} className={styles.answerItem}>
                <input
                  type="radio"
                  name="answer"
                  value={answer.id}
                  onChange={() => setAnswerId(answer.id)}
                  className={styles.answerInput}
                />
                {answer.text} — {isCorrect ? 'RÉTT' : 'RANGT'}
              </li>
            );
          })}
        </ul>

        <button type="submit" className={styles.submitButton}>
          Svara
        </button>
      </form>

      {/* ✅ New edit button */}
      <Link href={`/qedit/${question.id}`}>
        <button className={styles.editButton}>Breyta</button>
      </Link>
    </div>
  );
}
