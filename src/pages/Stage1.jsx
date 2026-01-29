import React, { useEffect, useMemo, useState } from "react";
import { loadProgress, saveProgress } from "../lib/progress";

export default function Stage1() {
  const [data, setData] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    fetch("/data/questions.json")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  const stage = useMemo(() => {
    if (!data) return null;
    return data.stages.find((s) => s.stageId === "stage1");
  }, [data]);

  const q = stage?.questions?.[idx];

  function choose(choiceIndex) {
    if (!q) return;
    if (picked !== null) return; // 連打防止
    setPicked(choiceIndex);

    const isCorrect = choiceIndex === q.answerIndex;
    const alreadySolved = !!progress.solved[q.id];

    if (isCorrect && !alreadySolved) {
      const next = {
        ...progress,
        xp: progress.xp + 10,
        solved: { ...progress.solved, [q.id]: true },
        lastStageId: "stage1"
      };
      setProgress(next);
      saveProgress(next);
    }
  }

  function nextQuestion() {
    setPicked(null);
    setIdx((v) => v + 1);
  }

  if (!stage) return <div style={{ padding: 16 }}>読み込み中…</div>;
  if (!q) return (
    <div style={{ padding: 16 }}>
      <h2>Stage1 完了！</h2>
      <p>XP: {progress.xp}</p>
      <a href="/">ホームへ</a>
    </div>
  );

  const isCorrect = picked === q.answerIndex;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>{stage.title}</h2>
      <p>XP: {progress.xp}</p>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <p><b>Q{idx + 1}.</b> {q.prompt}</p>

        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {q.choices.map((c, i) => (
            <button key={i} onClick={() => choose(i)} disabled={picked !== null}>
              {c}
            </button>
          ))}
        </div>

        {picked !== null && (
          <div style={{ marginTop: 12 }}>
            <p>{isCorrect ? "✅ 正解" : "❌ 不正解"}</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{q.explanation}</p>
            <button onClick={nextQuestion}>次へ</button>
          </div>
        )}
      </div>
    </div>
  );
}
