"use client";

import { useEffect, useRef, useState } from "react";
import type { AudioBook } from "@/lib/audio";

type Track = AudioBook["tracks"][number];

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

// 教材切換 + 線上播放器（原 audio.php 兩段 DOM 操作的 script）
// 點封面只顯示那本的音檔；點「播放」用下方播放器播，再點一次暫停；播完自動接下一集（同一本教材）
export function AudioLibrary({ books }: { books: AudioBook[] }) {
  const [activeBook, setActiveBook] = useState(0);
  const [current, setCurrent] = useState<{ book: number; track: Track } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 播放器出現時 body 加 class，CSS 會在頁面底部留空間，不讓播放器蓋住內容
  useEffect(() => {
    document.body.classList.toggle("has-audio-player", current !== null);
    return () => document.body.classList.remove("has-audio-player");
  }, [current]);

  // 換一集時才換 src 並播放（同一集只是切換播放/暫停）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.track.url;
    audio.play().catch(() => {});
  }, [current]);

  function toggleTrack(book: number, track: Track) {
    const audio = audioRef.current;
    if (!audio) return;
    if (current?.track.id === track.id) {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    } else {
      setCurrent({ book, track });
    }
  }

  function playNext() {
    if (!current) return;
    const list = books[current.book].tracks;
    const next = list[list.findIndex((t) => t.id === current.track.id) + 1];
    if (next) setCurrent({ book: current.book, track: next });
  }

  const shownTime = dragValue ?? time;
  const pct = duration ? (shownTime / duration) * 100 : 0;

  return (
    <>
      {/* 教材封面＋課程名稱：點哪本就只顯示那本的音檔，預設顯示第一本 */}
      <div className="audio-books">
        {books.map((book, i) => (
          <a
            key={book.key}
            className={`audio-book${i === activeBook ? " is-active" : ""}`}
            href={`#book-${i}`}
            aria-current={i === activeBook ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setActiveBook(i);
            }}
          >
            <span className="audio-book-cover">
              <img src={book.cover} alt="" />
            </span>
            <span className="audio-book-title">
              {book.title.split("\n").map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
            </span>
          </a>
        ))}
      </div>

      {books.map((book, i) => (
        <div key={book.key} className="audio-group" id={`book-${i}`} hidden={i !== activeBook}>
          <h3 className="audio-group-title">{book.title.replace(/\n/g, " ")}</h3>
          <div className="audio-list">
            {book.tracks.map((track) => {
              const isCurrent = current?.track.id === track.id;
              const on = isCurrent && playing;
              return (
                <div key={track.id} className={`audio-item${isCurrent ? " is-current" : ""}`}>
                  <span className="audio-track-name">{track.title}</span>
                  <button
                    type="button"
                    className={`audio-play${on ? " is-playing" : ""}`}
                    aria-label={`${on ? "暫停" : "播放"} ${track.title}`}
                    onClick={() => toggleTrack(i, track)}
                  >
                    {on ? "暫停" : "播放"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 線上播放器：點「播放」後固定在畫面下方，切換教材也不會中斷 */}
      <div className="audio-player" hidden={!current}>
        <div className="audio-player-inner">
          {/* 自己做控制列，不用瀏覽器內建的：iPhone 內建的在小畫面常常看不到進度條 */}
          <audio
            ref={audioRef}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onEmptied={() => {
              setTime(0);
              setDuration(0);
            }}
            onEnded={playNext}
          />
          <button
            type="button"
            className={`audio-player-toggle${playing ? " is-playing" : ""}`}
            aria-label={playing ? "暫停" : "播放"}
            onClick={() => current && toggleTrack(current.book, current.track)}
          >
            <span className="audio-player-icon" aria-hidden="true"></span>
          </button>
          <div className="audio-player-main">
            <span className="audio-player-title">{current?.track.title}</span>
            <div className="audio-player-progress">
              <span className="audio-player-time">{fmt(shownTime)}</span>
              <input
                type="range"
                className="audio-player-seek"
                min={0}
                max={isFinite(duration) ? duration : 0}
                step={0.1}
                value={shownTime}
                aria-label="播放進度"
                style={{ "--pct": `${pct}%` } as React.CSSProperties}
                // 拖曳中只更新畫面，放開才真的跳轉，避免邊拖邊載入
                onChange={(e) => setDragValue(parseFloat(e.target.value))}
                onPointerUp={() => {
                  if (dragValue != null && audioRef.current) audioRef.current.currentTime = dragValue;
                  setDragValue(null);
                }}
                onKeyUp={() => {
                  if (dragValue != null && audioRef.current) audioRef.current.currentTime = dragValue;
                  setDragValue(null);
                }}
              />
              <span className="audio-player-time">{fmt(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
