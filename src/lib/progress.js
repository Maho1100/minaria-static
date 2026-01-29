const KEY = "minaria_progress_v1";

export function defaultProgress() {
  return {
    version: "1.0",
    xp: 0,
    solved: {},          // { "s1-q1": true, ... }
    lastStageId: "stage1"
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    // 互換性チェック（雑でOK、あとで強化）
    if (!parsed || parsed.version !== "1.0") return defaultProgress();
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}
