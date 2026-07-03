'use client';

// ============================================================
//  CalendarTrack — Spir / Googleカレンダー式の縦時間軸バンド
//  ------------------------------------------------------------
//  旧UI（各30分を離散ピルで並べるグリッド）を置換する自己完結
//  コンポーネント。連続する空き30分を1本の帯にマージし、デスクトップ
//  ではカーソル追従の濃色ホバーチップ、選択枠は濃色チップで表示する。
//  縦時間軸の上下端は渡された空きスロットから自動算出（無ければ
//  10:00–20:00 にフォールバック）するため、営業時間が変わっても追従。
//  色は既存アクセント var(--bright-blue) に追従（テーマ非依存）。
//  クリック/タップ位置は30分にスナップして親へ通知するだけで、
//  予約ペイロード（slot.start）は従来と完全一致。
// ============================================================

import { useEffect, useMemo, useState } from 'react';

export type TrackSlot = {
  start: string; // ISO
  end: string;   // ISO
  date: string;  // YYYY-MM-DD (JST)
  time: string;  // HH:MM (JST)
};

interface CalendarTrackProps {
  /** 表示対象の日（親が算出済みの平日配列など） */
  weekDays: Date[];
  /** 表示日数（列数）。1 / 3 / 5 等 */
  displayDays: number;
  /** 日付(YYYY-MM-DD)ごとの空きスロット配列 */
  slotsByDate: Record<string, TrackSlot[]>;
  /** 選択中スロット（濃色チップ表示） */
  selected: TrackSlot | null;
  /** スロット選択時のコールバック */
  onSelect: (slot: TrackSlot) => void;
}

const SLOT_MIN = 30;                 // 1コマ = 30分
const DEFAULT_START_MIN = 10 * 60;   // フォールバック開始 10:00
const DEFAULT_END_MIN = 20 * 60;     // フォールバック終了 20:00

function pad2(n: number) {
  return n < 10 ? '0' + n : String(n);
}
function timeToMin(hhmm: string) {
  const p = hhmm.split(':');
  return Number(p[0]) * 60 + Number(p[1]);
}
function minToTime(m: number) {
  return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
}
function fmtYmd(d: Date) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

// 1コマの高さ(px)。CSS の --cal-slot-h と一致させる（レイアウトの単一ソース）
function slotHeightFor(width: number) {
  return width < 480 ? 26 : 22;
}

// 連続する30分slotを {startMin,endMin} の帯に結合
function mergeBands(daySlots: TrackSlot[]) {
  const sorted = daySlots.slice().sort((a, b) => (a.time < b.time ? -1 : 1));
  const bands: { startMin: number; endMin: number }[] = [];
  let cur: { startMin: number; endMin: number } | null = null;
  sorted.forEach((s) => {
    const sMin = timeToMin(s.time);
    const eMin = sMin + SLOT_MIN;
    if (cur && sMin === cur.endMin) {
      cur.endMin = eMin;
    } else {
      cur = { startMin: sMin, endMin: eMin };
      bands.push(cur);
    }
  });
  return bands;
}

export default function CalendarTrack({
  weekDays,
  displayDays,
  slotsByDate,
  selected,
  onSelect,
}: CalendarTrackProps) {
  // SSRでは22px（デスクトップ）で描画→マウント後に実幅で補正（hydration不一致なし）
  const [slotH, setSlotH] = useState(22);
  useEffect(() => {
    const update = () => setSlotH(slotHeightFor(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 連続時間軸の上下端を全スロットから算出（時間境界に丸める）
  const { trackStartMin, trackEndMin } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    Object.values(slotsByDate).forEach((arr) => {
      arr.forEach((s) => {
        const m = timeToMin(s.time);
        if (m < min) min = m;
        if (m + SLOT_MIN > max) max = m + SLOT_MIN;
      });
    });
    if (!isFinite(min) || !isFinite(max)) {
      return { trackStartMin: DEFAULT_START_MIN, trackEndMin: DEFAULT_END_MIN };
    }
    return { trackStartMin: Math.floor(min / 60) * 60, trackEndMin: Math.ceil(max / 60) * 60 };
  }, [slotsByDate]);

  const slotCount = Math.max(1, (trackEndMin - trackStartMin) / SLOT_MIN);
  const trackH = slotCount * slotH;
  const minToIdx = (m: number) => Math.floor((m - trackStartMin) / SLOT_MIN);

  // ホバー中の {列, コマidx}（30分境界を跨いだ時だけ再描画）
  const [hover, setHover] = useState<{ ymd: string; idx: number } | null>(null);

  // 各日の time->slot マップ（Y座標→slotのヒットテスト用）
  const dayMaps = useMemo(() => {
    const m: Record<string, Record<string, TrackSlot>> = {};
    weekDays.forEach((d) => {
      const ymd = fmtYmd(d);
      const map: Record<string, TrackSlot> = {};
      (slotsByDate[ymd] || []).forEach((s) => {
        map[s.time] = s;
      });
      m[ymd] = map;
    });
    return m;
  }, [weekDays, slotsByDate]);

  // クリック/ホバーのY座標を30分スナップし、空きがあれば {slot, idx} を返す
  function slotAtY(ymd: string, clientY: number, colEl: HTMLElement) {
    const rect = colEl.getBoundingClientRect();
    let y = clientY - rect.top;
    if (y < 0) y = 0;
    if (y > rect.height) y = rect.height;
    const idx = Math.floor(y / slotH);
    const time = minToTime(trackStartMin + idx * SLOT_MIN);
    const slot = dayMaps[ymd] && dayMaps[ymd][time];
    return slot ? { slot, idx } : null;
  }

  // 左：時刻ガター（1時間毎ラベル）
  const gutterLabels: { top: number; label: string }[] = [];
  for (let m = trackStartMin; m <= trackEndMin; m += 60) {
    gutterLabels.push({ top: ((m - trackStartMin) / SLOT_MIN) * slotH, label: minToTime(m) });
  }

  return (
    <div className="cal-track">
      <div className="cal-gutter" style={{ height: trackH }}>
        {gutterLabels.map((g, i) => (
          <div key={i} className="cal-gutter-label" style={{ top: g.top }}>
            {g.label}
          </div>
        ))}
      </div>

      <div
        className="cal-track-wrap"
        style={{ gridTemplateColumns: `repeat(${displayDays}, minmax(0, 1fr))` }}
      >
        {weekDays.map((d) => {
          const ymd = fmtYmd(d);
          const daySlots = slotsByDate[ymd] || [];
          const hasSlots = daySlots.length > 0;
          const bands = mergeBands(daySlots);
          const hourLines: number[] = [];
          for (let m = trackStartMin + 60; m < trackEndMin; m += 60) {
            hourLines.push(((m - trackStartMin) / SLOT_MIN) * slotH);
          }
          const isHovering = !!hover && hover.ymd === ymd;

          return (
            <div
              key={ymd}
              className={
                'cal-col' + (hasSlots ? ' has-slots' : '') + (isHovering ? ' hovering' : '')
              }
              style={{ height: trackH }}
              data-ymd={ymd}
              onClick={
                hasSlots
                  ? (e) => {
                      const hit = slotAtY(ymd, e.clientY, e.currentTarget);
                      if (hit) onSelect(hit.slot);
                    }
                  : undefined
              }
              onMouseMove={
                hasSlots
                  ? (e) => {
                      const hit = slotAtY(ymd, e.clientY, e.currentTarget);
                      setHover((prev) => {
                        if (hit) {
                          if (prev && prev.ymd === ymd && prev.idx === hit.idx) return prev;
                          return { ymd, idx: hit.idx };
                        }
                        return prev && prev.ymd === ymd ? null : prev;
                      });
                    }
                  : undefined
              }
              onMouseLeave={
                hasSlots
                  ? () => setHover((prev) => (prev && prev.ymd === ymd ? null : prev))
                  : undefined
              }
            >
              {/* 1時間毎の横罫線 */}
              <div className="cal-col-lines">
                {hourLines.map((t, i) => (
                  <div key={i} className="cal-hline" style={{ top: t }} />
                ))}
              </div>

              {!hasSlots && <div className="cal-col-empty">×</div>}

              {/* 空き帯（連続30分をマージ） */}
              {bands.map((b, i) => (
                <div
                  key={i}
                  className="cal-band"
                  style={{
                    top: minToIdx(b.startMin) * slotH,
                    height: ((b.endMin - b.startMin) / SLOT_MIN) * slotH,
                  }}
                />
              ))}

              {/* ホバープレビュー（デスクトップ・30分） */}
              {hasSlots && isHovering && (
                <div className="cal-hover" style={{ top: hover!.idx * slotH, height: slotH }}>
                  {minToTime(trackStartMin + hover!.idx * SLOT_MIN)} 選択
                </div>
              )}

              {/* 選択枠（この日が選択中なら描画） */}
              {selected && selected.date === ymd && (
                <div
                  className="cal-pick"
                  style={{ top: minToIdx(timeToMin(selected.time)) * slotH, height: slotH }}
                >
                  {selected.time} 選択
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
