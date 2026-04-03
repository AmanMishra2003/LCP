import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: "*" })); // your Vite dev URL

app.get("/api/leetcode/:username", async (req, res) => {
    const { username } = req.params;

    const query = `
    query getUserData($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }

      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge { name }
      }
    }
  `;

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
            },
            body: JSON.stringify({ query, variables: { username } }),
        });

        const data = await response.json();

        const ranking = data?.data?.userContestRanking;
        const user = data?.data?.matchedUser;


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const stats = user.submitStats.acSubmissionNum;

        const getCount = (difficulty) =>
            stats.find(s => s.difficulty === difficulty)?.count || 0;

        const totalSolved = getCount("All");
        const easySolved = getCount("Easy");
        const mediumSolved = getCount("Medium");
        const hardSolved = getCount("Hard");

        res.json({
            username,

            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,


            rating: ranking?.rating ? Math.round(ranking.rating) : 0,
            globalRanking: ranking?.globalRanking ?? "N/A",
            topPercentage: ranking?.topPercentage ?? "N/A",
            badge: ranking?.badge?.name ?? "Unranked",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch from LeetCode" });
    }
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));