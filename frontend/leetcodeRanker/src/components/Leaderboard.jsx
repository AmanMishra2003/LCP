import { useState, useRef } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { userId } from "../assets/ranker";
import BadgePill from "../components/BadgePill";
import AddUserModal from "../components/AddUserModal";
import { useEffect } from "react";
import axios from "axios";

const avatarColors = [
    "bg-teal-200 text-teal-900", "bg-blue-200 text-blue-900",
    "bg-purple-200 text-purple-900", "bg-orange-200 text-orange-900", "bg-amber-200 text-amber-900"
];

const rankLabel = (i) => {
    if (i === 0) return <span className="text-red-500 font-semibold">1</span>;
    if (i === 1) return <span className="text-blue-400 font-semibold">2</span>;
    if (i === 2) return <span className="text-orange-400 font-semibold">3</span>;
    return <span className="text-gray-400">{i + 1}</span>;
};

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openUser, setOpenUser] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            const responses = await Promise.allSettled(
                userId.map(id => axios.get(`https://lcp-x95r.onrender.com/api/leetcode/${id}`))
            );
            console.log(responses);
            const newUsers =  responses.filter(result => result.status === "fulfilled").map((res) => {
                const data = res.value.data;
                return {
                    username: data.username,
                    badge: data.badge,
                    rating: data.rating,
                    globalRanking: data.globalRanking,
                    topPercentage: data.topPercentage,
                    totalSolved: data.totalSolved,
                    easySolved: data.easySolved,
                    mediumSolved: data.mediumSolved,
                    hardSolved: data.hardSolved,
                };
            });

            setUsers(newUsers);
        };

        fetchData();
    }, []);

    const sorted = [...users].sort((a, b) => b.rating - a.rating);

    const handleRefresh = () => {
        setSpinning(true);
        window.location.reload()
        setTimeout(() => setSpinning(false), 700);
    };

    const handleAdd = (user) => {
        setUsers(prev => [...prev, user]);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-medium">LeetCode Leaderboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Ranked by contest rating</p>
                </div>
                <div className="flex gap-2">
                    {/* <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <Plus size={14} /> Add user
                    </button> */}
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <RefreshCw size={14} className={spinning ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                {/* Column headers */}
                <div className="grid grid-cols-[48px_1fr_120px_100px_130px_110px] px-4 py-2.5 text-xs font-medium text-gray-400 border-b border-gray-100 bg-gray-50">
                    <span>Rank</span>
                    <span>User</span>
                    <span>Badge</span>
                    <span className="text-right">Rating</span>
                    <span className="text-right">Global Rank</span>
                    <span className="text-right">Top %</span>
                </div>

                {/* Loading state */}
                {users.length === 0 && (
                    <div className="px-4 py-10 text-center text-sm text-gray-400">
                        Loading users...
                    </div>
                )}

                {/* Rows */}
                {sorted.map((user, i) => {
                    const initials = user.username.slice(0, 2).toUpperCase();
                    const color = avatarColors[i % avatarColors.length];

                    return (
                        <div key={user.username}>
                            <div
                                onClick={() =>
                                    setOpenUser(openUser === user.username ? null : user.username)
                                }
                                className="grid grid-cols-[48px_1fr_120px_100px_130px_110px] px-4 py-3.5 items-center border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <span className="text-sm">{rankLabel(i)}</span>

                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${color}`}>
                                        {initials}
                                    </div>
                                    <div className="text-sm font-medium">@{user.username}</div>
                                </div>

                                <BadgePill badge={user.badge} />

                                <div className="text-right text-sm font-medium">
                                    {user.rating}
                                </div>

                                <div className="text-right text-sm text-gray-500">
                                    #{user.globalRanking?.toLocaleString() ?? "—"}
                                </div>

                                <div className="text-right text-sm text-gray-500">
                                    {user.topPercentage != null
                                        ? `${Number(user.topPercentage).toFixed(2)}%`
                                        : "—"}
                                </div>
                            </div>

                            {openUser === user.username && (
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border">
                                            <div className="text-xs text-gray-500">Total Solved</div>
                                            <div className="text-lg font-semibold">{user.totalSolved ?? 0}</div>
                                        </div>

                                        <div className="bg-green-50 rounded-xl px-4 py-3 shadow-sm border border-green-100">
                                            <div className="text-xs text-green-600">Easy</div>
                                            <div className="text-lg font-semibold text-green-700">
                                                {user.easySolved ?? 0}
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 rounded-xl px-4 py-3 shadow-sm border border-yellow-100">
                                            <div className="text-xs text-yellow-600">Medium</div>
                                            <div className="text-lg font-semibold text-yellow-700">
                                                {user.mediumSolved ?? 0}
                                            </div>
                                        </div>

                                        <div className="bg-red-50 rounded-xl px-4 py-3 shadow-sm border border-red-100">
                                            <div className="text-xs text-red-600">Hard</div>
                                            <div className="text-lg font-semibold text-red-700">
                                                {user.hardSolved ?? 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}