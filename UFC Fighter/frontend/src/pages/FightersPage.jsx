import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const FightersPage = () => {
  const [fighters, setFighters] = useState([]);
  useEffect(() => {
    api.get("/fighters").then((res) => setFighters(res.data));
  }, []);

  return (
    <div className="container-app py-6">
      <h2 className="text-3xl font-bold mb-1">Top 10 All-Time Fighters</h2>
      <p className="mb-5 text-slate-600 dark:text-slate-300">Including McGregor, Khabib, Charles Oliveira and more legends.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fighters.map((f, index) => (
          <div key={f._id} className="card-ecom overflow-hidden">
            <img src={f.imageUrl} alt={f.name} className="h-52 w-full object-cover" />
            <div className="p-3">
              <p className="text-xs text-red-500 font-semibold">Rank #{index + 1}</p>
              <h3 className="font-bold">{f.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{f.nickname}</p>
              <p className="text-sm mt-1">{f.division}</p>
              <p className="text-sm font-medium mt-1">Record: {f.wins}-{f.losses}-{f.draws}</p>
              <Link to={`/fighters/${f._id}`} className="inline-block mt-3 px-3 py-1.5 bg-slate-200 text-slate-900 rounded-lg">
              View Profile
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FightersPage;
