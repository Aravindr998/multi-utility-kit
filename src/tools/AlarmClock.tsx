"use client";

import { useEffect, useRef, useState } from "react";
import { playAlarm, primeAudio } from "@/lib/sound";

function nextOccurrence(hhmm: string): number | null {
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  const now = new Date();
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1);
  return t.getTime();
}

function fmtRemaining(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor(s / 60) % 60;
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

type NotifState = "unsupported" | NotificationPermission;

export default function AlarmClock() {
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [ringing, setRinging] = useState(false);

  // Custom ringtone (kept in memory for the session).
  const [toneUrl, setToneUrl] = useState<string | null>(null);
  const [toneName, setToneName] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Desktop notifications.
  const [notif, setNotif] = useState<NotifState>("default");

  const ringId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setNotif(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Clean up the object URL and any running alarm on unmount.
  useEffect(() => {
    return () => {
      if (ringId.current) clearInterval(ringId.current);
      if (toneUrl) URL.revokeObjectURL(toneUrl);
    };
  }, [toneUrl]);

  // Fire once when the target time is reached.
  useEffect(() => {
    if (!target || ringing || now < target) return;
    setRinging(true);

    if (notif === "granted" && typeof Notification !== "undefined") {
      try {
        new Notification(label || "Alarm", {
          body: "It's time! ⏰",
          requireInteraction: true,
          tag: "utilityhub-alarm",
        });
      } catch {
        /* notification may be blocked despite permission */
      }
    }

    if (toneUrl && audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // playback blocked — fall back to the built-in tone
        playAlarm(5);
        ringId.current = setInterval(() => playAlarm(3), 2500);
      });
    } else {
      playAlarm(5);
      ringId.current = setInterval(() => playAlarm(3), 2500);
    }
  }, [now, target, ringing, notif, label, toneUrl]);

  function stopSound() {
    if (ringId.current) {
      clearInterval(ringId.current);
      ringId.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function setAlarm() {
    const t = nextOccurrence(time);
    if (!t) return;
    primeAudio();
    // Unlock the <audio> element inside this user gesture so it can autoplay later.
    if (toneUrl && audioRef.current) {
      const a = audioRef.current;
      a.muted = true;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {
          a.muted = false;
        });
    }
    setTarget(t);
    setRinging(false);
  }

  function stop() {
    setRinging(false);
    setTarget(null);
    stopSound();
  }

  function onTone(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    if (toneUrl) URL.revokeObjectURL(toneUrl);
    setToneUrl(URL.createObjectURL(f));
    setToneName(f.name);
  }

  function clearTone() {
    if (toneUrl) URL.revokeObjectURL(toneUrl);
    setToneUrl(null);
    setToneName(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function preview() {
    primeAudio();
    if (toneUrl && audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      playAlarm(3);
    }
  }

  function requestNotif() {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then((p) => setNotif(p));
  }

  const targetDate = target ? new Date(target) : null;

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={toneUrl ?? undefined} preload="auto" className="hidden" />

      {ringing && (
        <div
          className="flex items-center justify-between gap-3 rounded-lg p-4"
          style={{ background: "color-mix(in srgb, var(--danger) 16%, transparent)", color: "var(--foreground)" }}
        >
          <span className="font-semibold">⏰ {label || "Alarm"} — it&apos;s time!</span>
          <button className="btn btn-primary" onClick={stop}>Stop</button>
        </div>
      )}

      <div className="card grid gap-4 p-5 sm:grid-cols-[1fr_1.4fr] sm:items-end">
        <div>
          <label className="label" htmlFor="alarm-time">Alarm time</label>
          <input
            id="alarm-time"
            type="time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="alarm-label">Label (optional)</label>
          <input
            id="alarm-label"
            type="text"
            className="input"
            placeholder="e.g. Take a break"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        {/* Ringtone */}
        <div className="sm:col-span-2">
          <span className="label">Ringtone</span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => onTone(e.target.files)}
            />
            <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
              📂 Upload ringtone
            </button>
            <button className="btn btn-secondary" onClick={preview}>
              ▶ Preview
            </button>
            {toneName ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
                <span className="max-w-[12rem] truncate">{toneName}</span>
                <button onClick={clearTone} className="hover:text-[var(--foreground)]" aria-label="Remove ringtone" title="Use default tone">
                  ✕
                </button>
              </span>
            ) : (
              <span className="text-sm text-[var(--muted)]">Using the default beep</span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-[var(--faint)]">
            Your audio file stays on your device and is used only for this session.
          </p>
        </div>

        {/* Desktop notifications */}
        <div className="sm:col-span-2">
          <span className="label">Desktop notification</span>
          {notif === "unsupported" ? (
            <p className="text-sm text-[var(--muted)]">Your browser doesn&apos;t support notifications.</p>
          ) : notif === "granted" ? (
            <p className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--success)" }}>
              ✓ Enabled — you&apos;ll get a desktop notification when the alarm rings.
            </p>
          ) : notif === "denied" ? (
            <p className="text-sm text-[var(--muted)]">
              Notifications are blocked. Enable them for this site in your browser settings to get a desktop alert.
            </p>
          ) : (
            <button className="btn btn-secondary" onClick={requestNotif}>
              🔔 Enable desktop notifications
            </button>
          )}
        </div>

        <div className="sm:col-span-2">
          {!target ? (
            <button className="btn btn-primary w-full sm:w-auto" onClick={setAlarm} disabled={!time}>
              Set alarm
            </button>
          ) : (
            <button className="btn btn-secondary w-full sm:w-auto" onClick={stop}>
              Cancel alarm
            </button>
          )}
        </div>
      </div>

      {target && !ringing && targetDate && (
        <div className="card p-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            {label ? `“${label}” ` : "Alarm "}set for{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {targetDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>{" "}
            ({targetDate.toLocaleDateString(undefined, { weekday: "long" })})
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums">
            {fmtRemaining(target - now)}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">until it rings · keep this tab open</p>
        </div>
      )}

      {!target && (
        <p className="text-center text-sm text-[var(--muted)]">
          Set a time above. The alarm rings in this tab — keep it open.
        </p>
      )}
    </div>
  );
}
