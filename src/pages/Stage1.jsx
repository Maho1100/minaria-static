import React, { useEffect, useMemo, useState } from "react";
import { loadProgress, saveProgress } from "../lib/progress";

export default function Stage1() {
  const [data, setData] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());
  const [fetchError, setFetchError] = useState(null);
  
  useEffect(() => {
  fetch("./data/questions.json")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
      return r.json();
    })
    .then(setData)
    .catch((e) => {
      console.error("questions.json fetch failed:", e);
      setFetchError(String(e));
    });
}, []);


  // ---- ここから「落ちないガード」(原因を画面に出す) ----
  if (fetchError) {
    return (
      <div style={{ padding: 16 }}>
        <h2>データ読み込みエラー</h2>
        <p>{fetchError}</p>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 16 }}>読み込み中…（data null）</div>;
  }

  if (!data.stages || !Array.isArray(data.stages)) {
    return (
      <div style={{ padding: 16 }}>
        <h2>エラー：stages が見つかりません</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }
  // ---- ここまで「落ちないガード」 ----

  const stage = useMemo(() => {
    return data.stages.find((s) => s.stageId === "stage1");
  }, [data]);

  // stage が見つからない場合に、何が入ってるか見えるようにする
  if (!stage) {
    return (
      <div style={{ padding: 16 }}>
        <h2>エラー：stage1 が見つかりません</h2>
        <p>stageId 一覧：</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data.stages.map((s) => s.stageId), null, 2)}
        </pre>
        <p>data.stages 全体：</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data.stages, null, 2)}</pre>
      </div>
    );
  }

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
        lastStageId: "stage1",
      };
      setProgress(next);
      saveProgress(next);
    }
  }

  function nextQuestion() {
    setPicked(null);
    setIdx((v) => v + 1);
  }

  if (!q)
    return (
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
        <p>
          <b>Q{idx + 1}.</b> {q.prompt}
        </p>

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
