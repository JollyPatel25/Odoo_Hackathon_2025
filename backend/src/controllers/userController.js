// controllers/userController.js
import User from "../models/User.js";

export const getPublicProfiles = async (req, res) => {
  try {
    const {
      availability = "",
      search = "",
      searchIn = "both",
      page = 1,
      limit = 3,
    } = req.query;

    const numericLimit = Number(limit);

    const query = {
      profilePublic: true,
      ...(availability && { availability }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          ...(searchIn === "offered"
            ? [{ skillsOffered: { $regex: search, $options: "i" } }]
            : searchIn === "wanted"
            ? [{ skillsWanted: { $regex: search, $options: "i" } }]
            : [
                { skillsOffered: { $regex: search, $options: "i" } },
                { skillsWanted: { $regex: search, $options: "i" } },
              ]),
        ],
      }),
    };

    console.log("[USER CONTROLLER] Fetching profiles with query:", query);

    const total = await User.countDocuments(query);

    const profiles = await User.find(query)
      .select("-password -email")
      .skip((page - 1) * numericLimit)
      .limit(numericLimit);

    console.log(
      `[USER CONTROLLER] Found ${profiles.length} profiles (page ${page}/${Math.ceil(
        total / limit
      )})`
    );

    res.json({ profiles, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[USER CONTROLLER] Error fetching profiles:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};





// controllers/userController.js
// import User from "../models/User.js";

// export const getPublicProfiles = async (req, res) => {
//   try {
//     const { availability = "", search = "", page = 1, limit = 3 } = req.query;
//     const numericLimit  = Number(limit);
//     const query = {
//       profilePublic: true,
//       ...(availability && { availability }),
//       ...(search && {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { skillsOffered: { $regex: search, $options: "i" } },
//           { skillsWanted: { $regex: search, $options: "i" } },
//         ],
//       }),
//     };

//     console.log("[USER CONTROLLER] Fetching profiles with query:", query);

//     const total = await User.countDocuments(query);
//     const profiles = await User.find(query)
//         .select("-password -email")
//         .skip((page - 1) * numericLimit)
//         .limit(numericLimit)


//     console.log(`[USER CONTROLLER] Found ${profiles.length} profiles (page ${page}/${Math.ceil(total / limit)})`);

//     res.json({ profiles, totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     console.error("[USER CONTROLLER] Error fetching profiles:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };