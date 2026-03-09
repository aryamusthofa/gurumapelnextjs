"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function GuruMapelPage() {
  const searchParams = useSearchParams();
  const guruIdFromUrl = searchParams.get("guru_id");

  const [guruList, setGuruList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [selectedGuru, setSelectedGuru] = useState("");
  const [selectedMapel, setSelectedMapel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (guruIdFromUrl) {
      setSelectedGuru(guruIdFromUrl);
    }
  }, [guruIdFromUrl]);

  useEffect(() => {
    fetch("/api/admin/guru")
      .then((res) => res.json())
      .then((data) => setGuruList(data.guru || []));
  }, []);

  useEffect(() => {
    fetch("/api/admin/mapel")
      .then((res) => res.json())
      .then((data) => setMapelList(data.mapel || []));
  }, []);

  useEffect(() => {
    if (!selectedGuru) return;

    fetch(`/api/admin/guru/mapel?guru_id=${selectedGuru}`)
      .then((res) => res.json())
      .then((data) => {
        const ids = data.mapel.map((m) => m.id);
        setSelectedMapel(ids);
      });
  }, [selectedGuru]);

  const handleCheckbox = (mapelId) => {
    setSelectedMapel((prev) =>
      prev.includes(mapelId)
        ? prev.filter((id) => id !== mapelId)
        : [...prev, mapelId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedGuru) {
      setMessage("Pilih guru terlebih dahulu");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/guru/mapel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guru_id: selectedGuru,
        mapel_ids: selectedMapel,
      }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.message || "Berhasil disimpan");
  };

  const currentGuru = guruList.find(
    (g) => g.id == selectedGuru
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: "bold" }}>
        Atur Mapel Guru
        {currentGuru && ` - ${currentGuru.nama}`}
      </h1>

      <div style={{ marginTop: 20 }}>
        <label>Guru</label>
        <br />
        <select
          value={selectedGuru}
          onChange={(e) => setSelectedGuru(e.target.value)}
          disabled={!!guruIdFromUrl}
          style={{
            padding: 8,
            width: 300,
            backgroundColor: guruIdFromUrl ? "#f3f4f6" : "white",
            cursor: guruIdFromUrl ? "not-allowed" : "pointer",
          }}
        >
          <option value="">-- Pilih Guru --</option>
          {guruList.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nama} ({g.nis_nip})
            </option>
          ))}
        </select>
      </div>

      {selectedGuru && (
        <div style={{ marginTop: 20 }}>
          <label>Mapel yang diajar</label>
          <div style={{ marginTop: 10 }}>
            {mapelList.map((m) => (
              <div key={m.id}>
                <input
                  type="checkbox"
                  checked={selectedMapel.includes(m.id)}
                  onChange={() => handleCheckbox(m.id)}
                />
                <span style={{ marginLeft: 8 }}>
                  {m.nama_mapel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 10 }}>{message}</p>
      )}
    </div>
  );
}
