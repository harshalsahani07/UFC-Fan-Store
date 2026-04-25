import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const FighterDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchDetails = () => api.get(`/fighters/${id}`).then((res) => setData(res.data));

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const submitRating = async () => {
    await api.post(`/fighters/${id}/ratings`, { rating: Number(rating), comment });
    setComment("");
    fetchDetails();
  };

  if (!data) return <div className="p-6">Loading...</div>;
  return (
    <div className="container-app py-6">
      <div className="grid md:grid-cols-2 gap-6 card-ecom p-4">
        <img src={data.fighter.imageUrl} alt={data.fighter.name} className="rounded-lg w-full h-80 object-cover" />
        <div>
          <h2 className="text-3xl font-bold">{data.fighter.name}</h2>
          <p className="text-red-500 font-semibold">{data.fighter.nickname}</p>
          <p className="mt-1">{data.fighter.division}</p>
          <p className="mt-2 font-medium">Record: {data.fighter.wins}-{data.fighter.losses}-{data.fighter.draws}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <p><span className="font-semibold">KO Wins:</span> {data.fighter.knockouts || 0}</p>
            <p><span className="font-semibold">Submission Wins:</span> {data.fighter.submissions || 0}</p>
            <p><span className="font-semibold">Height:</span> {data.fighter.height || "N/A"}</p>
            <p><span className="font-semibold">Reach:</span> {data.fighter.reach || "N/A"}</p>
            <p><span className="font-semibold">Stance:</span> {data.fighter.stance || "N/A"}</p>
            <p><span className="font-semibold">Country:</span> {data.fighter.country || "N/A"}</p>
          </div>
          <p className="mt-3">{data.fighter.bio}</p>
          <p className="my-2">Average fan rating: {data.avgRating} / 5</p>
          <div>
            <input className="border p-2 mr-2 rounded text-black" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
            <input className="border p-2 mr-2 rounded text-black" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={submitRating}>
              Rate Fighter
            </button>
          </div>
        </div>
      </div>
      <div className="card-ecom p-4 mt-4">
        <h3 className="text-xl font-bold mb-3">Notable Fight History</h3>
        <div className="space-y-2">
          {(data.fighter.notableFights || []).map((fight, idx) => (
            <div key={`${fight.opponent}-${idx}`} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <p className="font-semibold">
                vs {fight.opponent} - {fight.event} ({fight.year})
              </p>
              <p className="text-sm">
                {fight.result} by {fight.method} (Round {fight.round})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FighterDetailsPage;
